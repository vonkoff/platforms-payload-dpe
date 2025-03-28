import { Config } from "payload";

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
        subdomain: `${td.dealerId}`,
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
