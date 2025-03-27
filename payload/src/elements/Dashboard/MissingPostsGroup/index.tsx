// src/elements/Dashboard/MissingPostsGroup/index.tsx
import React from "react";
// import { getPayload } from "payload";
import Link from "next/link";
import { formatAdminURL } from "@payloadcms/ui/shared";
import { FeatureCard } from "../DashboardFeatureCard";
import { CompactFeatureCard } from "../DashboardCompactFeatureCard"; // New import
import { BasePayload } from "payload";
import { AlertTriangle } from "lucide-react";

import "./index.scss";

type Props = {
  adminRoute: string;
  payload: BasePayload;
};

export const MissingPostsGroup: React.FC<Props> = async ({
  adminRoute,
  payload,
}) => {
  // Query posts with missing information
  const missingSeoTitle = await payload.find({
    collection: "posts",
    where: {
      "meta.title": {
        exists: false,
      },
    },
    limit: 0,
  });

  const missingSeoDesc = await payload.find({
    collection: "posts",
    where: {
      "meta.description": {
        exists: false,
      },
    },
    limit: 0,
  });

  const missingSeoImage = await payload.find({
    collection: "posts",
    where: {
      "meta.image": {
        exists: false,
      },
    },
    limit: 0,
  });

  const missingHeroImage = await payload.find({
    collection: "posts",
    where: {
      heroImage: {
        exists: false,
      },
    },
    limit: 0,
  });

  const missingCategories = await payload.find({
    collection: "posts",
    where: {
      categories: {
        exists: false,
      },
    },
    limit: 0,
  });

  // Calculate total SEO issues (posts missing any SEO field)
  const missingSeoCount = Math.max(
    missingSeoTitle.totalDocs,
    missingSeoDesc.totalDocs,
    missingSeoImage.totalDocs,
  );

  // Only display section if we have issues
  const hasIssues =
    missingSeoCount > 0 ||
    missingHeroImage.totalDocs > 0 ||
    missingCategories.totalDocs > 0;

  if (!hasIssues) {
    return null;
  }

  return (
    <div className="dashboard__group missing-posts-group">
      <p className="dashboard__label">
        <AlertTriangle
          size={16}
          style={{ marginRight: "8px", verticalAlign: "middle" }}
        />
        Posts With Missing Information
      </p>
      <ul className="dashboard__card-list">
        {missingSeoCount > 0 && (
          <li>
            <CompactFeatureCard
              title="Missing SEO"
              href={formatAdminURL({
                adminRoute,
                path: `/collections/posts?where[meta.title][exists]=false`,
              })}
              Link={Link}
              count={missingSeoCount}
            />
          </li>
        )}

        {missingHeroImage.totalDocs > 0 && (
          <li>
            <CompactFeatureCard
              title="Missing Hero Images"
              href={formatAdminURL({
                adminRoute,
                path: `/collections/posts?where[heroImage][exists]=false`,
              })}
              Link={Link}
              count={missingHeroImage.totalDocs}
              variant="yellow"
            />
          </li>
        )}

        {missingCategories.totalDocs > 0 && (
          <li>
            <FeatureCard
              title="Missing Categories"
              href={formatAdminURL({
                adminRoute,
                path: `/collections/posts?where[categories][exists]=false`,
              })}
              Link={Link}
              count={missingCategories.totalDocs}
            />
          </li>
        )}
      </ul>
    </div>
  );
};
