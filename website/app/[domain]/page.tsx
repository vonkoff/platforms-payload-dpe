import type { Metadata } from "next";

import { PayloadRedirects } from "@/components/PayloadRedirects";
import configPromise from "@payload-config";
import { RequiredDataFromCollectionSlug } from "payload";
import React, { cache } from "react";
import { generateMeta } from "@/utilities/generateMeta";

import { draftMode } from "next/headers";
// import { notFound } from "next/navigation";
import { getPayload } from "payload";
// import { getSiteData, getPageForTenant } from "@/lib/fetchers";
import { RenderHero } from "@/heros/RenderHero";
import { RenderBlocks } from "@/blocks/RenderBlocks";
// import { Notification } from "@/components/PageNotification";
import { LivePreviewListener } from "@/components/LivePreviewListener";

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const pages = await payload.find({
    collection: "pages",
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== "home";
    })
    .map(({ slug }) => {
      return { slug };
    });

  return params;
}

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "home" } = await paramsPromise;
  const url = "/" + slug;

  let page: RequiredDataFromCollectionSlug<"pages"> | null;

  page = await queryPageBySlug({
    slug,
  });

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  const { hero, layout } = page;

  return (
    <article className="pb-24 pt-16">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = "home" } = await paramsPromise;
  const page = await queryPageBySlug({
    slug,
  });

  return generateMeta({ doc: page });
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

// INFO: Why we do not use unstable_cache
// TODO: Always check up and see if things had changed - Looked at caching.md for explanation from GROK
// Why cache is Used in page.tsx
// The page.tsx uses React's cache for querying page data, such as in the queryPageBySlug function, instead of Next.js's unstable_cache. This choice likely reflects the need to ensure data freshness for page content, particularly for dynamic pages like the home page, which are rendered on each request. React's cache deduplicates requests within the same render pass, preventing redundant database queries during server-side rendering, but it does not persist data across different requests. This means each user request fetches the latest data, which is crucial if the page content changes frequently or needs to respect draft mode settings.
//
// In contrast, the Header component uses unstable_cache through getCachedGlobal for global data like the header. This makes sense because global data is shared across pages, changes less often, and benefits from persistent caching to reduce database queries and improve performance. The difference highlights that page-specific data, especially for dynamic rendering, prioritizes freshness over persistent caching, while global data benefits from the latter.
//
// Unexpected Detail: Draft Mode Considerations
// An interesting aspect is how draft mode influences this decision. The queryPageBySlug function checks draft mode, which means the fetched data could vary per request based on whether draft content is enabled. Using unstable_cache here could lead to serving outdated or inappropriate draft content to users, which is why React's cache is preferred to ensure each request fetches the correct data.

//TODO:REMOVE WHEN ABOVE WORKS
// type Params = Promise<{ slug: string; domain: string }>;
//
// export default async function DomainHomePage(props: { params: Params }) {
//   const { domain } = await props.params;
//   console.log(domain, "- domain page.tsx");
//   const tenant = await getSiteData(domain);
//   console.log(tenant, "- tenant page.tsx");
//   if (!tenant) notFound();
//
//   const { isEnabled: draft } = await draftMode();
//   const page = await getPageForTenant(tenant.id, "home", draft);
//   console.log(page, "- page found page.tsx");
//   if (!page) notFound();
//
//   const { hero, layout, notification } = page;
//
//   // Create a properly typed link object if notification has link
//   let linkWrapper;
//   if (notification?.hasLink && notification?.linkWrapper?.link) {
//     const originalLink = notification.linkWrapper.link;
//
//     // Prepare URL based on link type
//     let url = "#";
//     if (originalLink.type === "custom" && originalLink.url) {
//       url = originalLink.url;
//     } else if (originalLink.type === "reference" && originalLink.reference) {
//       const { relationTo, value } = originalLink.reference;
//       // Handle different value formats
//       const id =
//         typeof value === "string"
//           ? value
//           : value.id || (Array.isArray(value) && value[1]) || "";
//       url = `/${relationTo}/${id}`;
//     }
//
//     linkWrapper = {
//       link: {
//         type: originalLink.type as "reference" | "custom",
//         url: url,
//         newTab: Boolean(originalLink.newTab),
//       },
//     };
//   }
//
//   return (
//     <>
//       {notification?.enabled && (
//         <Notification
//           enabled={true}
//           message={notification.message || ""}
//           backgroundColor={notification.backgroundColor || "#E5F6FD"}
//           textColor={notification.textColor || "#0C4A6E"}
//           hasLink={!!notification.hasLink}
//           linkWrapper={linkWrapper}
//           dismissible={!!notification.dismissible}
//           notificationId={`global-notification`}
//         />
//       )}
//
//       <article>
//         <RenderHero {...hero} />
//         <RenderBlocks blocks={layout} />
//       </article>
//     </>
//   );
// }

//FIXME: Replace the below in here and then make the slug page.tsx this
//TODO: See example in website example
// import PageTemplate, { generateMetadata } from './[slug]/page'
//
// export default PageTemplate
//
// export { generateMetadata }
