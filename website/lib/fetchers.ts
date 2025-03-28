import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

export async function getPageForTenant(
  tenantId: string,
  slug: string,
  draft: boolean = false,
) {
  const payload = await getPayload({ config });
  return await unstable_cache(
    async () => {
      const pageQuery = await payload.find({
        collection: "pages",
        draft,
        limit: 1,
        overrideAccess: draft,
        where: {
          slug: { equals: slug },
          tenant: { equals: tenantId },
        },
      });
      return pageQuery.docs[0] || null;
    },
    [`page-${tenantId}-${slug}-${draft ? "draft" : "published"}`],
    {
      revalidate: 900,
      tags: [`page-${tenantId}-${slug}`],
    },
  )();
}

export async function getSiteData(domain: string) {
  const payload = await getPayload({ config });
  const domainWithoutPort = domain.split(":")[0]; // Remove port, e.g., "blasiusattleboro.test:3000" → "blasiusattleboro.test"
  console.log(
    "domainWithoutPort: ",
    domainWithoutPort,
    "- getSiteData Function",
  );
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  console.log("subdomain: ", domainWithoutPort, "- getSiteData Function");

  return await unstable_cache(
    async () => {
      const tenantQuery = await payload.find({
        collection: "tenants",
        where: subdomain
          ? { subdomain: { equals: subdomain } }
          : { domain: { equals: domainWithoutPort } },
        limit: 1,
      });

      return tenantQuery.docs[0] || null;
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getPagesForSite(domain: string) {
  const payload = await getPayload({ config });
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const tenantQuery = await payload.find({
        collection: "tenants",
        where: subdomain
          ? { subdomain: { equals: subdomain } }
          : { domain: { equals: domain } },
        limit: 1,
      });

      const tenant = tenantQuery.docs[0];
      if (!tenant) return [];

      const pagesQuery = await payload.find({
        collection: "pages",
        where: {
          tenant: { equals: tenant.id },
        },
        sort: "-createdAt",
      });

      return pagesQuery.docs;
    },
    [`${domain}-pages`],
    {
      revalidate: 900,
      tags: [`${domain}-pages`],
    },
  )();
}

export async function getPageData(domain: string, slug: string) {
  const payload = await getPayload({ config });
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const tenantQuery = await payload.find({
        collection: "tenants",
        where: subdomain
          ? { subdomain: { equals: subdomain } }
          : { domain: { equals: domain } },
        limit: 1,
      });

      const tenant = tenantQuery.docs[0];
      if (!tenant) return null;

      const pageQuery = await payload.find({
        collection: "pages",
        where: {
          and: [{ tenant: { equals: tenant.id } }, { slug: { equals: slug } }],
        },
        limit: 1,
      });

      return pageQuery.docs[0] || null;
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900,
      tags: [`${domain}-${slug}`],
    },
  )();
}
