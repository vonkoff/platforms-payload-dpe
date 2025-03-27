import type { CollectionConfig } from "payload";

import { superAdminOrTenantAdminAccess } from "./Pages/access/superAdminOrTenantAdmin";
// import { anyone } from '../access/anyone'
// import { authenticated } from '../access/authenticated'
import { slugField } from "@/fields/slug";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: () => true,
    update: superAdminOrTenantAdminAccess,
  },

  // access: {
  //   create: authenticated,
  //   delete: authenticated,
  //   read: anyone,
  //   update: authenticated,
  // },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    ...slugField(),
  ],
};
