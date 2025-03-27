import { Config } from "payload";

// export const seed: NonNullable<Config['onInit']> = async (payload): Promise<void> => {
//   const tenant1 = await payload.create({
//     collection: 'tenants',
//     data: {
//       name: 'Tenant 1',
//       slug: 'gold',
//       domain: 'gold.localhost',
//     },
//   })
//
//   const tenant2 = await payload.create({
//     collection: 'tenants',
//     data: {
//       name: 'Tenant 2',
//       slug: 'silver',
//       domain: 'silver.localhost',
//     },
//   })
//
//   const tenant3 = await payload.create({
//     collection: 'tenants',
//     data: {
//       name: 'Tenant 3',
//       slug: 'bronze',
//       domain: 'bronze.localhost',
//     },
//   })
//
//   await payload.create({
//     collection: 'users',
//     data: {
//       email: 'demo@payloadcms.com',
//       password: 'demo',
//       roles: ['super-admin'],
//     },
//   })
//
//   await payload.create({
//     collection: 'users',
//     data: {
//       email: 'tenant1@payloadcms.com',
//       password: 'demo',
//       tenants: [
//         {
//           roles: ['tenant-admin'],
//           tenant: tenant1.id,
//         },
//       ],
//       username: 'tenant1',
//     },
//   })
//
//   await payload.create({
//     collection: 'users',
//     data: {
//       email: 'tenant2@payloadcms.com',
//       password: 'demo',
//       tenants: [
//         {
//           roles: ['tenant-admin'],
//           tenant: tenant2.id,
//         },
//       ],
//       username: 'tenant2',
//     },
//   })
//
//   await payload.create({
//     collection: 'users',
//     data: {
//       email: 'tenant3@payloadcms.com',
//       password: 'demo',
//       tenants: [
//         {
//           roles: ['tenant-admin'],
//           tenant: tenant3.id,
//         },
//       ],
//       username: 'tenant3',
//     },
//   })
//
//   await payload.create({
//     collection: 'users',
//     data: {
//       email: 'multi-admin@payloadcms.com',
//       password: 'demo',
//       tenants: [
//         {
//           roles: ['tenant-admin'],
//           tenant: tenant1.id,
//         },
//         {
//           roles: ['tenant-admin'],
//           tenant: tenant2.id,
//         },
//         {
//           roles: ['tenant-admin'],
//           tenant: tenant3.id,
//         },
//       ],
//       username: 'multi-admin',
//     },
//   })
//
//   await payload.create({
//     collection: 'pages',
//     data: {
//       slug: 'home',
//       tenant: tenant1.id,
//       title: 'Page for Tenant 1',
//     },
//   })
//
//   await payload.create({
//     collection: 'pages',
//     data: {
//       slug: 'home',
//       tenant: tenant2.id,
//       title: 'Page for Tenant 2',
//     },
//   })
//
//   await payload.create({
//     collection: 'pages',
//     data: {
//       slug: 'home',
//       tenant: tenant3.id,
//       title: 'Page for Tenant 3',
//     },
//   })
// }

export const seed: NonNullable<Config["onInit"]> = async (
  payload,
): Promise<void> => {
  // Define the list of new tenants
  const tenantData = [
    { dealerId: "blasiusattleboro", name: "Blasius of Attleboro" },
    { dealerId: "blasiusboston", name: "Blasius Boston" },
    { dealerId: "blasiusbristol", name: "Blasius of Bristol" },
    { dealerId: "blasiusfederal", name: "Blasius Federal Road" },
    { dealerId: "blasiusmiddletown", name: "Blasius of Middletown" },
    { dealerId: "blasiusnewbritain", name: "Blasius of New Britain" },
    { dealerId: "blasiusnorth", name: "Blasius North" },
    { dealerId: "blasiuspreownedas", name: "Blasius Pre-Owned" },
    { dealerId: "blasiussouthas", name: "Blasius South Auto Sales" },
    {
      dealerId: "lbchevycadillac",
      name: "Loehmann Blasius Chevrolet Cadillac",
    },
  ];

  // Create tenants sequentially
  const createdTenants = [];
  for await (const td of tenantData) {
    const tenant = await payload.create({
      collection: "tenants",
      data: {
        name: td.name,
        slug: td.dealerId,
        domain: `${td.dealerId}.test`,
        dealerId: td.dealerId,
      },
    });
    createdTenants.push(tenant);
  }

  // Create super-admin users
  await payload.create({
    collection: "users",
    data: {
      email: "demo@payloadcms.com",
      password: "demo",
      roles: ["super-admin"],
      username: "demo",
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "sftp@dealerproedge.com",
      password: "randomPassword",
      roles: ["super-admin"],
      username: "sftp",
    },
  });

  // Create tenant-admin users sequentially
  for await (const tenant of createdTenants) {
    await payload.create({
      collection: "users",
      data: {
        email: `admin@${tenant.dealerId}.payloadcms.com`,
        password: "demo",
        tenants: [
          {
            roles: ["tenant-admin"],
            tenant: tenant.id,
          },
        ],
        username: tenant.dealerId,
      },
    });
  }

  // Create multi-admin user
  await payload.create({
    collection: "users",
    data: {
      email: "multi-admin@payloadcms.com",
      password: "demo",
      tenants: createdTenants.map((tenant) => ({
        roles: ["tenant-admin"],
        tenant: tenant.id,
      })),
      username: "multi-admin",
    },
  });
};
