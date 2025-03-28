import type { CollectionConfig } from "payload";

import { adminGroups } from "@/utilities/adminGroups";
import { link } from "@/fields/link";
// import { revalidateHeader } from "./hooks/revalidateHeader";

export const Header: CollectionConfig = {
  slug: "header",
  access: {
    read: () => true,
  },
  admin: {
    group: adminGroups.globals,
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "/components/RowLabel#RowLabel",
        },
      },
    },
  ],
  // hooks: {
  //   afterChange: [revalidateHeader],
  // },
};
