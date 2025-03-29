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
        {
          name: "hasDropdown",
          type: "checkbox",
          label: "Enable Dropdown Menu",
          defaultValue: false,
        },
        {
          name: "dropdownItems",
          type: "array",
          label: "Dropdown Menu Items",
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.hasDropdown === true,
            initCollapsed: true,
            components: {
              RowLabel: "/components/RowLabel#RowLabel",
            },
          },
        },
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
  //TODO: Fix?
  // hooks: {
  //   afterChange: [revalidateHeader],
  // },
};
