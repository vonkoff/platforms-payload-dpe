import type { CollectionConfig } from "payload";

import { isSuperAdminAccess } from "@/access/isSuperAdmin";
import { updateAndDeleteAccess } from "./access/updateAndDelete";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  access: {
    create: isSuperAdminAccess,
    delete: updateAndDeleteAccess,
    read: ({ req }) => Boolean(req.user),
    update: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "domain",
      type: "text",
      admin: {
        description: "Custom domain for the tenant, e.g., 'example.com'",
      },
    },
    {
      name: "subdomain",
      type: "text",
      admin: {
        description:
          "Subdomain for the tenant, e.g., 'my-tenant' for my-tenant.maindomain.com",
      },
      index: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      admin: {
        description: "Used for url paths, example: /tenant-slug/page-slug",
      },
      index: true,
      required: true,
    },
    //TODO: Change to only allow read and change from SuperADMIN
    {
      name: "dealerId",
      type: "text",
      admin: {
        description: "DealerID of Tenant for SFTP purposes",
      },
      unique: true,
      index: true,
      required: true,
    },
    {
      name: "allowPublicRead",
      type: "checkbox",
      admin: {
        description:
          "If checked, logging in is not required to read. Useful for building public pages.",
        position: "sidebar",
      },
      defaultValue: false,
      index: true,
    },
  ],
};
