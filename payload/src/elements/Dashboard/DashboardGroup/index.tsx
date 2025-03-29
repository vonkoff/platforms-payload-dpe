import { EntityType, formatAdminURL } from "@payloadcms/ui/shared";
import { FC } from "react";
import { Card } from "@payloadcms/ui";
import Link from "next/link";
import { BasePayload, CollectionSlug, StaticLabel } from "payload";
import { getStringFromLabel } from "@/utilities/getStringFromLabel";

import "./index.scss";
import { adminGroups } from "@/utilities/adminGroups";
import { FeatureCard } from "../DashboardFeatureCard";

type Props = {
  adminRoute: string;
  label: string;
  entities: {
    label: StaticLabel;
    slug: string;
    type: EntityType;
  }[];
  payload: BasePayload;
};

export const DashboardGroup: FC<Props> = async ({
  label: groupLabel,
  adminRoute,
  entities,
  payload,
}) => {
  const getCounts = async () => {
    const docCounts: Record<string, number> = {};
    for (let i = 0; i < entities.length; i++) {
      const slug = entities[i].slug as CollectionSlug;
      const { totalDocs } = await payload.count({ collection: slug });
      docCounts[slug] = totalDocs;
    }
    return docCounts;
  };

  const isFeaturedGroup = groupLabel === adminGroups.featured;
  let counts: Record<string, number> = {};

  if (isFeaturedGroup) {
    counts = await getCounts();
  }

  return (
    <div className="dashboard__group">
      <p className="dashboard__label">{groupLabel}</p>
      <ul className="dashboard__card-list">
        {entities.map(({ slug, type, label }, entityIndex) => {
          // Convert StaticLabel to string
          const titleString = getStringFromLabel(label);

          return (
            <li key={entityIndex}>
              {isFeaturedGroup ? (
                <FeatureCard
                  title={titleString}
                  href={formatAdminURL({
                    adminRoute,
                    path:
                      type === EntityType.collection
                        ? `/collections/${slug}`
                        : `/globals/${slug}`,
                  })}
                  Link={Link}
                  count={counts[slug] ?? 0}
                />
              ) : (
                <Card
                  title={titleString}
                  href={formatAdminURL({
                    adminRoute,
                    path:
                      type === EntityType.collection
                        ? `/collections/${slug}`
                        : `/globals/${slug}`,
                  })}
                  Link={Link}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
