import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

export async function getSiteData(domain: string) {
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
