//TODO: Look at old commits to find opengraph-image.tsx file
//showed how to make images for pages
//INFO: Fontmapper was used here to get fonts. Look back at commits if want to see

import { draftMode } from "next/headers";
import { getSiteData, getPageForTenant } from "@/lib/fetchers";
import { notFound } from "next/navigation";
import { RenderHero } from "@/heros/RenderHero";
import { RenderBlocks } from "@/blocks/RenderBlocks";

type Params = Promise<{ slug: string; domain: string }>;

export default async function DomainPage(props: { params: Params }) {
  const { domain, slug } = await props.params;

  const tenant = await getSiteData(domain);
  if (!tenant) notFound();
  const { isEnabled: draft } = await draftMode();
  const page = await getPageForTenant(tenant.id, slug, draft);
  if (!page) notFound();
  const { hero, layout } = page;
  return (
    <article>
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  );
}
