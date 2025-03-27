// src/components/MissingInfoDashboard.tsx
import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";

// Server component to fetch data
async function getMissingInfoStats() {
  // Get payload instance
  const payload = await getPayload({ config });

  try {
    // Find posts with missing SEO title
    const missingSeoTitle = await payload.find({
      collection: "posts",
      where: {
        "meta.title": {
          exists: false,
        },
      },
      limit: 0, // Just get the count
    });

    // Find posts with missing SEO description
    const missingSeoDesc = await payload.find({
      collection: "posts",
      where: {
        "meta.description": {
          exists: false,
        },
      },
      limit: 0,
    });

    // Find posts with missing SEO image
    const missingSeoImage = await payload.find({
      collection: "posts",
      where: {
        "meta.image": {
          exists: false,
        },
      },
      limit: 0,
    });

    // Find posts with missing hero image
    const missingHeroImage = await payload.find({
      collection: "posts",
      where: {
        heroImage: {
          exists: false,
        },
      },
      limit: 0,
    });

    // Find posts with missing categories
    const missingCategories = await payload.find({
      collection: "posts",
      where: {
        categories: {
          exists: false,
        },
      },
      limit: 0,
    });

    // Calculate total SEO issues (docs missing any of the 3 SEO fields)
    const missingSeoCount = Math.max(
      missingSeoTitle.totalDocs,
      missingSeoDesc.totalDocs,
      missingSeoImage.totalDocs,
    );

    return {
      missingSeo: missingSeoCount,
      missingHeroImage: missingHeroImage.totalDocs,
      missingCategories: missingCategories.totalDocs,
    };
  } catch (error) {
    console.error("Error fetching content stats:", error);
    return {
      missingSeo: 0,
      missingHeroImage: 0,
      missingCategories: 0,
    };
  }
}

// Client component to render the dashboard UI
const MissingInfoDashboardUI = ({ stats }) => {
  // If there are no issues, don't show the dashboard
  const hasIssues =
    stats.missingSeo > 0 ||
    stats.missingHeroImage > 0 ||
    stats.missingCategories > 0;

  if (!hasIssues) {
    return null; // Don't show anything if there are no issues
  }

  const cardStyle = {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    margin: "20px 0",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    backgroundColor: "#fff",
  };

  const headerStyle = {
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "10px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
  };

  const warningIconStyle = {
    color: "#e53e3e",
    marginRight: "10px",
    fontSize: "24px",
  };

  const itemStyle = {
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "4px",
    backgroundColor: "#f7fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const buttonStyle = {
    backgroundColor: "#e53e3e",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={warningIconStyle}>⚠️</span>
        <h2 style={{ margin: 0 }}>Posts With Missing Information</h2>
      </div>

      <div>
        {stats.missingSeo > 0 && (
          <div style={itemStyle}>
            <span>
              <strong>{stats.missingSeo}</strong> posts missing SEO information
            </span>
            <a
              href={`/admin/collections/posts?where[meta.title][exists]=false`}
              style={buttonStyle}
            >
              View Posts
            </a>
          </div>
        )}

        {stats.missingHeroImage > 0 && (
          <div style={itemStyle}>
            <span>
              <strong>{stats.missingHeroImage}</strong> posts missing hero
              images
            </span>
            <a
              href={`/admin/collections/posts?where[heroImage][exists]=false`}
              style={buttonStyle}
            >
              View Posts
            </a>
          </div>
        )}

        {stats.missingCategories > 0 && (
          <div style={itemStyle}>
            <span>
              <strong>{stats.missingCategories}</strong> posts missing
              categories
            </span>
            <a
              href={`/admin/collections/posts?where[categories][exists]=false`}
              style={buttonStyle}
            >
              View Posts
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Main component
const MissingInfoDashboard: React.FC = async () => {
  const stats = await getMissingInfoStats();

  return <MissingInfoDashboardUI stats={stats} />;
};

export default MissingInfoDashboard;
