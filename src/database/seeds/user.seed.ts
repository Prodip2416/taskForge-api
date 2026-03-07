import { DataSource, In } from 'typeorm';
import { User } from '../../user/user.entity';
import { Role } from '../../role/role.entity';
import { BcryptService } from '../../auth/hashing/provider/bcrypt.service';
import { RoleEnum } from '../../user/enum/role.enum';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);
  const hashingProvider = new BcryptService();

  // 1. Fetch roles from DB
  const roles = await roleRepo.find({
    where: { name: In(Object.values(RoleEnum)) },
  });

  if (!roles.length) {
    console.warn('User seed skipped: no roles found, run role seeder first');
    return;
  }

  const roleMap = new Map(roles.map((role) => [role.name, role]));

  const getRole = (name: RoleEnum): Role[] => {
    const role = roleMap.get(name);
    return role ? [role] : [];
  };

  // 2. Seed data with roles
  const seedUserData: Array<Partial<User> & { roles: Role[] }> = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@taskforge.com',
      password: 'Tf@123456',
      isActive: true,
      isDelete: false,
      roles: getRole(RoleEnum.ADMIN),
    },
    {
      firstName: 'Rakib',
      lastName: 'Hasan',
      email: 'rakib@taskforge.com',
      password: 'Tf@123456',
      isActive: true,
      isDelete: false,
      roles: getRole(RoleEnum.USER),
    },
    {
      firstName: 'Nusrat',
      lastName: 'Jahan',
      email: 'nusrat@taskforge.com',
      password: 'Tf@123456',
      isActive: true,
      isDelete: false,
      roles: getRole(RoleEnum.MODERATOR),
    },
  ];

  // 3. Filter already existing users
  const emails = seedUserData
    .map((user) => user.email)
    .filter((email): email is string => Boolean(email));

  const existingUsers = await userRepo.find({
    where: { email: In(emails) },
    select: { email: true },
  });

  const existingEmailSet = new Set(existingUsers.map((user) => user.email));

  const usersToInsert = seedUserData.filter(
    (user) => user.email && !existingEmailSet.has(user.email),
  );

  if (!usersToInsert.length) {
    console.log('User seed skipped: all users already exist');
    return;
  }

  // 4. Hash passwords
  const usersWithHashedPassword = await Promise.all(
    usersToInsert.map(async (user) => ({
      ...user,
      password: user.password
        ? await hashingProvider.hashPassword(user.password)
        : user.password,
    })),
  );

  // 5. Save with roles
  const users = userRepo.create(usersWithHashedPassword);
  await userRepo.save(users);

  // 6. Log results
  users.forEach((user) => {
    const assignedRoles = user.roles?.map((r) => r.name).join(', ') || 'none';
    console.log(`✔ Created user: ${user.email} → roles: [${assignedRoles}]`);
  });

  console.log(`User seed complete: created ${users.length} users`);
}