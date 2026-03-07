import { DataSource } from 'typeorm';
import { Role } from '../../role/role.entity';
import { RoleEnum } from '../../user/enum/role.enum';

const seedRoleData: Array<Partial<Role>> = [
  {
    name: RoleEnum.ADMIN,
    description: 'Full access to all resources and settings',
  },
  {
    name: RoleEnum.USER,
    description: 'Standard access to assigned tasks and projects',
  },
  {
    name: RoleEnum.MODERATOR,
    description: 'Can manage content and moderate user activities',
  },
];

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepo = dataSource.getRepository(Role);

  // 1. Get existing role names
  const existingRoles = await roleRepo.find({
    select: { name: true },
  });
  const existingRoleNames = new Set(existingRoles.map((role) => role.name));

  // 2. Filter out already existing roles
  const rolesToInsert = seedRoleData.filter(
    (role) => role.name && !existingRoleNames.has(role.name),
  );

  if (!rolesToInsert.length) {
    console.log('Role seed skipped: all roles already exist');
    return;
  }

  // 3. Save new roles
  const roles = roleRepo.create(rolesToInsert);
  await roleRepo.save(roles);

  // 4. Log results
  roles.forEach((role) => {
    console.log(`✔ Created role: ${role.name} — ${role.description}`);
  });

  console.log(`Role seed complete: created ${roles.length} roles`);
}