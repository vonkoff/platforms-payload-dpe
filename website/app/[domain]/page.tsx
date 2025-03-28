import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";

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

export default async function SiteHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const [data] = await Promise.all([getSiteData(domain)]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <div className="mb-20 w-full">
        <h1>hi</h1>
      </div>
    </>
  );
}
