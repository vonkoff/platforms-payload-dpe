import { getPayload } from "payload";
import configPromise from "@payload-config";

type Props = {
  collection: string;
  slug: string;
  req: any; // Adjust the type according to your project
  data?: any; // The document data from Payload
};

export const generatePreviewPath = async ({
  collection,
  slug,
  req,
  data,
}: Props) => {
  // Log the data for debugging if needed:
  console.log("generatePreviewPath – data received:", data);

  let tenantSlug = "";

  // If the tenant data is populated (an object with a slug), use it.
  if (data?.tenant && typeof data.tenant === "object" && data.tenant.slug) {
    tenantSlug = data.tenant.slug;
  } else if (data?.tenant && typeof data.tenant === "string") {
    // The tenant field is just an ObjectId string.
    // Perform an extra query to get the tenant's info.
    const payload = await getPayload({ config: configPromise });
    const tenantQuery = await payload.find({
      collection: "tenants",
      overrideAccess: true,
      where: {
        id: { equals: data.tenant }, // or _id if that's what you use
      },
    });
    if (tenantQuery.docs.length > 0) {
      tenantSlug = tenantQuery.docs[0].slug;
    }
  }
  console.log("generatePreviewPath – extracted tenant:", tenantSlug);

  // Build the rest of the preview URL parameters.
  const collectionPrefixMap: Record<string, string> = {
    posts: "/posts",
    pages: "",
  };

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: `${collectionPrefixMap[collection]}/${slug}`,
    previewSecret: process.env.PREVIEW_SECRET || "",
    tenant: tenantSlug,
  });

  const isProduction =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.VERCEL_PROJECT_PRODUCTION_URL);

  let protocol = "http:";
  if (isProduction) {
    protocol = "https:";
  } else if (typeof req.protocol === "string") {
    protocol = req.protocol;
  } else if (req.headers.get && req.headers.get("x-forwarded-proto")) {
    protocol = req.headers.get("x-forwarded-proto") + ":";
  }

  let host: string | null = null;
  const tenantDomain = data?.tenant?.domain;
  if (tenantDomain) {
    host = tenantDomain;
  } else if (typeof req.host === "string") {
    host = req.host;
  } else if (req.headers.get && req.headers.get("host")) {
    host = req.headers.get("host");
  }

  if (!host) {
    throw new Error("Could not determine the host for the preview URL");
  }

  // Append :3000 in development if no port is present
  if (!isProduction && !host.includes(":")) {
    host = `${host}:3000`;
  }

  const url = `${protocol}//${host}/next/preview?${encodedParams.toString()}`;
  return url;
};

// TODO: The below is removed. Think about whether you are fine with using an extra call to the database for showing previews like you do above.
// You could make the below work if you include tenant as part of the Pages collection data so you can pull from it directly. Right now though the
// `const tenant` is always empty since that is not something that is filled in the collection. The pages collections already have tenant mentioned
// as an $oid for some reason. Not sure if adding the tenant value again would be adding stupid unceessary data to the json.
// import { PayloadRequest, CollectionSlug } from "payload";
//
// const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
//   posts: "/posts",
//   pages: "", // For pages you might not have a prefix
// };
//
// type Props = {
//   collection: keyof typeof collectionPrefixMap;
//   slug: string;
//   req: PayloadRequest;
//   data?: unknown; // document data including tenant info
// };
//
// export const generatePreviewPath = ({ collection, slug, req, data }: Props) => {
//   // Extract tenant slug from the document's tenant field
//   const tenant = (data as { tenant?: { slug: string } })?.tenant?.slug || "";
//
//   const encodedParams = new URLSearchParams({
//     slug,
//     collection,
//     // This produces a path like "/test" if pages prefix is empty.
//     path: `${collectionPrefixMap[collection]}/${slug}`,
//     previewSecret: process.env.PREVIEW_SECRET || "",
//     tenant,
//   });
//
//   const isProduction =
//     process.env.NODE_ENV === "production" ||
//     Boolean(process.env.VERCEL_PROJECT_PRODUCTION_URL);
//
//   let protocol: string = "http:";
//   if (isProduction) {
//     protocol = "https:";
//   } else if (typeof req.protocol === "string") {
//     protocol = req.protocol;
//   } else if (req.headers.get && req.headers.get("x-forwarded-proto")) {
//     protocol = req.headers.get("x-forwarded-proto") + ":";
//   }
//
//   let host: string | null = null;
//   const tenantDomain = (data as { tenant?: { domain: string } })?.tenant
//     ?.domain;
//   if (tenantDomain) {
//     host = tenantDomain;
//   } else if (typeof req.host === "string") {
//     host = req.host;
//   } else if (req.headers.get && req.headers.get("host")) {
//     host = req.headers.get("host");
//   }
//
//   if (!host) {
//     throw new Error("Could not determine the host for the preview URL");
//   }
//
//   // Append :3000 in development if no port is present
//   if (!isProduction && !host.includes(":")) {
//     host = `${host}:3000`;
//   }
//
//   const url = `${protocol}//${host}/next/preview?${encodedParams.toString()}`;
//   return url;
// };
