import { DataSource, In } from 'typeorm';
import { User } from '../../user/user.entity';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepo = dataSource.getRepository(User);
  const seedUsers: Array<Partial<User>> = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@taskforge.com',
      password: 'admin123',
      isActive: true,
      isDelete: false,
    },
    {
      firstName: 'Rakib',
      lastName: 'Hasan',
      email: 'rakib@taskforge.com',
      password: 'rakib123',
      isActive: true,
      isDelete: false,
    },
    {
      firstName: 'Nusrat',
      lastName: 'Jahan',
      email: 'nusrat@taskforge.com',
      password: 'nusrat123',
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

  const users = userRepo.create(usersToInsert);
  await userRepo.save(users);
  console.log(`User seed complete: created ${users.length} users`);
}
