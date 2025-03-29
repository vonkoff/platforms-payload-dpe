import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { headers as getHeaders } from "next/headers";
import { RenderPage } from "../../../../components/RenderPage";

type PageParams = Promise<{ tenant: string; slug?: string[] }>;

export default async function Page(props: {
  //WARNING: USED BEFORE
  // params: { tenant: string; slug?: string[] };
  params: PageParams;
}) {
  //WARNING: USED BEFORE
  // Resolve route parameters as recommended by Next.js:
  // const params = await Promise.resolve(props.params);

  //INFO: Changed to this below. Different from multi-tenant example because getting error
  const params = await props.params;

  let { tenant, slug: slugArray } = params;
  console.log("[Tenant-Domains] Original route parameters:", {
    tenant,
    slugArray,
  });

  // If the first route parameter is coming out as "localhost" (or perhaps it contains a dot)
  // then assume that the real tenant is actually the first element of the slug array.
  if (
    (tenant === "localhost" || tenant.includes(".")) &&
    slugArray &&
    slugArray.length > 1
  ) {
    const realTenant = slugArray[0];
    slugArray = slugArray.slice(1);
    console.log("[Tenant-Domains] Adjusted parameters:", {
      tenant: realTenant,
      slugArray,
    });
    tenant = realTenant;
  }

  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  // Even if the admin preview request is unauthenticated, we can override access for preview.
  const { user } = await payload.auth({ headers });
  console.log("[Tenant-Domains] Authenticated user:", user);

  // Look up the tenant document by its slug (which should now be correctly set)
  const tenantQuery = await payload.find({
    collection: "tenants",
    overrideAccess: user ? false : true,
    user,
    where: {
      slug: { equals: tenant },
    },
  });
  console.log("[Tenant-Domains] Tenant query result:", tenantQuery);

  if (tenantQuery.docs.length === 0) {
    console.error("[Tenant-Domains] No tenant found for slug:", tenant);
    return notFound();
  }
  const tenantId = tenantQuery.docs[0].id;
  console.log("[Tenant-Domains] Resolved tenant ID:", tenantId);

  // Build the slug constraint for your page lookup
  let slugConstraint: any;
  if (slugArray && slugArray.length > 0) {
    slugConstraint = { slug: { equals: slugArray.join("/") } };
  } else {
    slugConstraint = {
      or: [
        { slug: { equals: "" } },
        { slug: { equals: "home" } },
        { slug: { exists: false } },
      ],
    };
  }
  console.log("[Tenant-Domains] Slug constraint:", slugConstraint);

  // Query pages where the tenant field equals the tenant's ID and the slug matches.
  const pageQuery = await payload.find({
    collection: "pages",
    overrideAccess: user ? false : true,
    user,
    where: {
      and: [{ tenant: { equals: tenantId } }, slugConstraint],
    },
  });
  console.log("[Tenant-Domains] Page query result:", pageQuery);

  const pageData = pageQuery.docs?.[0];
  if (!pageData) {
    console.error(
      "[Tenant-Domains] No page found for tenant ID:",
      tenantId,
      "with slug constraint:",
      slugConstraint,
    );
    return notFound();
  }

  console.log("[Tenant-Domains] Found page data:", pageData);
  return <RenderPage data={pageData} />;
}

// import { notFound } from "next/navigation";
// import { getPayload } from "payload";
// import configPromise from "@payload-config";
// import { headers as getHeaders } from "next/headers";
//
// import { RenderPage } from "../../../../components/RenderPage";
//
// export default async function Page(props: {
//   params: { tenant: string; slug?: string[] };
// }) {
//   // Resolve route parameters as recommended by Next.js
//   const params = await Promise.resolve(props.params);
//   let { tenant, slug: slugArray } = params;
//   console.log("[Tenant-Domains] Original route parameters:", {
//     tenant,
//     slugArray,
//   });
//
//   // Adjust parameters: if tenant appears as a domain (e.g. "gold.test"),
//   // assume the actual tenant slug is the first element of slugArray.
//   if (tenant.includes(".") && slugArray && slugArray.length > 0) {
//     tenant = slugArray[0];
//     slugArray = slugArray.slice(1);
//     console.log("[Tenant-Domains] Adjusted parameters:", { tenant, slugArray });
//   }
//
//   // Get request headers and Payload instance
//   const headers = await getHeaders();
//   const payload = await getPayload({ config: configPromise });
//   const { user } = await payload.auth({ headers });
//   console.log("[Tenant-Domains] Authenticated user:", user);
//
//   // For preview mode, if no user is present, override access.
//   const overrideAccess = user ? false : true;
//
//   // Look up the tenant document using the tenant slug
//   const tenantQuery = await payload.find({
//     collection: "tenants",
//     overrideAccess,
//     user,
//     where: {
//       slug: { equals: tenant },
//     },
//   });
//   console.log("[Tenant-Domains] Tenant query result:", tenantQuery);
//
//   if (tenantQuery.docs.length === 0) {
//     console.error("[Tenant-Domains] No tenant found for slug:", tenant);
//     return notFound();
//   }
//   const tenantId = tenantQuery.docs[0].id;
//   console.log("[Tenant-Domains] Resolved tenant ID:", tenantId);
//
//   // Build the slug constraint for the page lookup.
//   let slugConstraint: any;
//   if (slugArray && slugArray.length > 0) {
//     slugConstraint = { slug: { equals: slugArray.join("/") } };
//   } else {
//     slugConstraint = {
//       or: [
//         { slug: { equals: "" } },
//         { slug: { equals: "home" } },
//         { slug: { exists: false } },
//       ],
//     };
//   }
//   console.log("[Tenant-Domains] Slug constraint:", slugConstraint);
//
//   // Query the pages collection using the tenant's ID and the slug constraint.
//   const pageQuery = await payload.find({
//     collection: "pages",
//     overrideAccess,
//     user,
//     where: {
//       and: [{ tenant: { equals: tenantId } }, slugConstraint],
//     },
//   });
//   console.log("[Tenant-Domains] Page query result:", pageQuery);
//
//   const pageData = pageQuery.docs?.[0];
//   if (!pageData) {
//     console.error(
//       "[Tenant-Domains] No page found for tenant ID:",
//       tenantId,
//       "with slug constraint:",
//       slugConstraint,
//     );
//     return notFound();
//   }
//
//   console.log("[Tenant-Domains] Found page data:", pageData);
//   return <RenderPage data={pageData} />;
// }
