import type { CollectionConfig } from "payload";
import { adminGroups } from "@/utilities/adminGroups";

import { dealerInfoTab } from "./tabs/dealerInfo";
import { departmentHoursTab } from "./tabs/departmentHours";
import { siteNoticeTab } from "./tabs/siteNotice";
import { socialMediaTab } from "./tabs/socialMedia";
import { trackingCodesTab } from "./tabs/trackingCodes";

export const General: CollectionConfig = {
  slug: "general",
  admin: {
    group: adminGroups.globals,
  },
  access: {
    read: () => true,
    // create: createOnceAccess,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        departmentHoursTab,
        dealerInfoTab,
        siteNoticeTab,
        socialMediaTab,
        trackingCodesTab,
      ],
    },
  ],
};
