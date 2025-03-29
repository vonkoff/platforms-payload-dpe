import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteData, getPageForTenant } from "@/lib/fetchers";
import { RenderHero } from "@/heros/RenderHero";
import { RenderBlocks } from "@/blocks/RenderBlocks";

// export async function generateStaticParams() {
//   const allSites = await db.query.sites.findMany({
//     // feel free to remove this filter if you want to generate paths for all sites
//     where: (sites, { eq }) => eq(sites.subdomain, "demo"),
//     columns: {
//       subdomain: true,
//       customDomain: true,
//     },
//   });
//
//   const allPaths = allSites
//     .flatMap(({ subdomain, customDomain }) => [
//       subdomain && {
//         domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//       },
//       customDomain && {
//         domain: customDomain,
//       },
//     ])
//     .filter(Boolean);
//
//   return allPaths;
// }
//
//

type Params = Promise<{ slug: string; domain: string }>;

export default async function DomainHomePage(props: { params: Params }) {
  const { domain } = await props.params;
  console.log(domain, "- domain page.tsx");
  const tenant = await getSiteData(domain);
  console.log(tenant, "- tenant page.tsx");
  if (!tenant) notFound();
  const { isEnabled: draft } = await draftMode();
  const page = await getPageForTenant(tenant.id, "home", draft);
  console.log(page, "- page found page.tsx");
  if (!page) notFound();
  const { hero, layout } = page;
  return (
    <article>
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  );
}

//TODO: Needed?
// export default async function SiteHomePage(
//   props: {
//     params: Promise<{ domain: string }>;
//   }
// ) {
//   const params = await props.params;
//   const domain = decodeURIComponent(params.domain);
//   const [data] = await Promise.all([getSiteData(domain)]);
//
//   if (!data) {
//     notFound();
//   }
//
//   return (
//     <>
//       <div className="mb-20 w-full">
//         <h1>hi</h1>
//       </div>
//     </>
//   );
// }
