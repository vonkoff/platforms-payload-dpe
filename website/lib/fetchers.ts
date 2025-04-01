import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

//FIXME: Tanstack form implementation so far
// Update this function in your fetchers.ts file
export async function getVehicleModels(domain: string): Promise<string[]> {
  const payload = await getPayload({ config });
  const site = await getSiteData(domain);

  if (!site) return [];

  return await unstable_cache(
    async () => {
      const vehiclesQuery = await payload.find({
        collection: "vehicles",
        where: {
          dealerId: { equals: site.id },
        },
        select: {
          make: true,
          model: true,
        },
        limit: 100,
      });

      // Extract unique make/model combinations
      const uniqueModels = new Set<string>();
      vehiclesQuery.docs.forEach((doc) => {
        if (doc.make && doc.model) {
          console.log(doc.make);
          uniqueModels.add(`${doc.make} ${doc.model}`);
        }
      });
      console.log("unique models", vehiclesQuery);

      return Array.from(uniqueModels);
    },
    [`vehicleModels-${site.id}`],
    {
      revalidate: 900,
      tags: [`vehicleModels-${site.id}`],
    },
  )();
}

export async function getHeaderData(domain: string) {
  const payload = await getPayload({ config });
  const site = await getSiteData(domain);

  if (!site) return null;

  return await unstable_cache(
    async () => {
      const headerQuery = await payload.find({
        collection: "header",
        limit: 1,
        where: {
          tenant: { equals: site.id },
        },
      });

      return headerQuery.docs[0] || null;
    },
    [`header-${site.id}`],
    {
      revalidate: 900,
      tags: [`header-${site.id}`],
    },
  )();
}

export async function getGeneralContactInfo(domain: string) {
  const payload = await getPayload({ config });
  const site = await getSiteData(domain);

  if (!site) return null;

  return await unstable_cache(
    async () => {
      const generalQuery = await payload.find({
        collection: "general",
        limit: 1,
        where: {
          tenant: { equals: site.id },
        },
      });

      const generalDoc = generalQuery.docs[0] || null;
      if (!generalDoc) return null;

      // Extract contact info from the general document
      const phoneNumbers =
        generalDoc?.dealerInfo?.dealerInfo?.phoneNumbers || {};
      const location = generalDoc?.dealerInfo?.dealerInfo?.location || {};

      // Get hours from weekdayHours
      const today = new Date().toString().slice(0, 3) + "day"; // e.g., "monday"
      const weekdayHours = generalDoc?.departmentHours?.weekdayHours || [];

      // Find today's hours or use first entry
      const todayHours = weekdayHours.find((entry) =>
        entry?.days?.includes(today as any),
      );

      const formattedHours = todayHours
        ? formatHours(todayHours.openTime, todayHours.closeTime)
        : "9:00AM - 7:00PM"; // Default hours

      // Format the contact info in a structure usable by layout
      return {
        sales: phoneNumbers?.sales || "",
        service: phoneNumbers?.service || "",
        parts: phoneNumbers?.parts || "",
        address: formatAddress(location),
        hours: formattedHours,
      };
    },
    [`general-contact-${site.id}`],
    {
      revalidate: 900,
      tags: [`general-${site.id}`],
    },
  )();
}

// Helper to format address
function formatAddress(location: Record<string, any> = {}) {
  const address = location?.address || "";
  const city = location?.city || "";
  const state = location?.state || "";
  const zipcode = location?.zipcode || "";

  const parts = [address, city, state, zipcode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "";
}

// Helper to format hours from date strings
function formatHours(openTime: string, closeTime: string): string {
  try {
    // Parse ISO date strings to get just the time portion
    const openDate = new Date(openTime);
    const closeDate = new Date(closeTime);

    // Format as AM/PM
    const openFormatted = openDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const closeFormatted = closeDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${openFormatted} - ${closeFormatted}`;
  } catch (e) {
    // Fallback if date parsing fails
    return "9:00AM - 7:00PM";
  }
}

export async function getContactForTenant(
  tenantId: string,
  slug: string,
  draft: boolean = false,
) {
  const payload = await getPayload({ config });
  return await unstable_cache(
    async () => {
      const generalQuery = await payload.find({
        collection: "general",
        draft,
        limit: 1,
        where: {
          tenant: { equals: tenantId },
        },
      });
      return generalQuery.docs[0] || null;
    },
    [`page-${tenantId}-${slug}-${draft ? "draft" : "published"}`],
    {
      revalidate: 900,
      tags: [`page-${tenantId}-${slug}`],
    },
  )();
}

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
