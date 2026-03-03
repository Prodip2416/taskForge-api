import { DataSource, In } from 'typeorm';
import { User } from '../../user/user.entity';
import { BcryptService } from '../../auth/hashing/provider/bcrypt.service';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);
  const hashingProvider = new BcryptService();
  const seedUsers: Array<Partial<User>> = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@taskforge.com',
      password: 'Tf@123456',
      isActive: true,
      isDelete: false,
    },
    {
      firstName: 'Rakib',
      lastName: 'Hasan',
      email: 'rakib@taskforge.com',
      password: 'Tf@123456',
      isActive: true,
      isDelete: false,
    },
    {
      firstName: 'Nusrat',
      lastName: 'Jahan',
      email: 'nusrat@taskforge.com',
      password: 'Tf@123456',
      isActive: true,
      isDelete: false,
    },
  ];

  const emails = seedUsers
    .map((user) => user.email)
    .filter((email): email is string => Boolean(email));

  const existingUsers = await userRepo.find({
    where: { email: In(emails) },
    select: { email: true },
  });
  const existingEmailSet = new Set(existingUsers.map((user) => user.email));
  const usersToInsert = seedUsers.filter(
    (user) => user.email && !existingEmailSet.has(user.email),
  );

  if (!usersToInsert.length) {
    console.log('User seed skipped: all users already exist');
    return;
  }

  const usersWithHashedPassword = await Promise.all(
    usersToInsert.map(async (user) => ({
      ...user,
      password: user.password
        ? await hashingProvider.hashPassword(user.password)
        : user.password,
    })),
  );

  const users = userRepo.create(usersWithHashedPassword);
  await userRepo.save(users);
  console.log(`User seed complete: created ${users.length} users`);
}
