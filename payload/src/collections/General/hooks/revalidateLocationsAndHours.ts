import type { GlobalAfterChangeHook } from "payload";
//TODO: Work on this and making cache work with cloudflare

import { revalidateTag } from "next/cache";

export const revalidateLocationsAndHours: GlobalAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  payload.logger.info(`Revalidating location and hours`);

  revalidateTag("global_header");

  return doc;
};

// import { AfterChangeHook } from 'payload/dist/collections/config/types'
//
// export const revalidateHours: AfterChangeHook = async ({ req }) => {
//   try {
//     if (process.env.NEXT_PUBLIC_SERVER_URL) {
//       const nextRevalidate = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/revalidate`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${process.env.REVALIDATION_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       })
//
//       if (!nextRevalidate.ok) {
//         console.error('Error revalidating hours:', await nextRevalidate.text())
//       }
//     }
//   } catch (err) {
//     console.error('Error in revalidation process:', err)
//   }
// }
