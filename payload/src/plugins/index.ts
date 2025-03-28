import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { searchPlugin } from "@payloadcms/plugin-search";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { sentryPlugin } from "@payloadcms/plugin-sentry";
import { Plugin } from "payload";
import { revalidateRedirects } from "@/hooks/revalidateRedirects";
import { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import {
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Config } from "@/payload-types";
// import type { Config } from "./types/payload-types";
import { isSuperAdmin } from "@/access/isSuperAdmin";
import { getUserTenantIDs } from "@/utilities/getUserTenantIDs";
import { beforeSyncWithSearch } from "@/search/beforeSync";

import { Page, Post } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";

import * as Sentry from "@sentry/nextjs";

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title
    ? `${doc.title} | Payload Website Template`
    : "Payload Website Template";
};

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
  sentryPlugin({
    Sentry,
  }),
  payloadCloudPlugin(),
  multiTenantPlugin<Config>({
    collections: {
      pages: {},
      posts: {},
      vehicles: {},
      general: {
        isGlobal: true,
      },
      header: {
        isGlobal: true,
      },
    },
    tenantField: {
      access: {
        read: () => true,
        update: ({ req }) => {
          if (isSuperAdmin(req.user)) {
            return true;
          }
          return getUserTenantIDs(req.user).length > 0;
        },
      },
    },
    tenantsArrayField: {
      includeDefaultField: false,
    },
    userHasAccessToAllTenants: (user) => isSuperAdmin(user),
  }),

  redirectsPlugin({
    collections: ["pages", "posts"],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "from") {
            return {
              ...field,
              admin: {
                description:
                  "You will need to rebuild the website when changing this field.",
              },
            };
          }
          return field;
        });
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ["categories"],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "confirmationMessage") {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({
                      enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                    }),
                  ];
                },
              }),
            };
          }
          return field;
        });
      },
    },
  }),
  searchPlugin({
    collections: ["posts"],
    beforeSync: beforeSyncWithSearch,
    //   searchOverrides: {
    //     fields: ({ defaultFields }) => {
    //       return [...defaultFields, ...searchFields];
    //     },
    //   },
    // }),
    searchOverrides: {
      // Change the collection labels here
      labels: {
        singular: "Search Collection",
        plural: "Search Collections",
      },
      // @ts-expect-error - PayloadCMS type definitions are overly strict here
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "doc") {
            return {
              ...field,
              label: "Edit Details",
              admin: {
                ...field.admin,
                // label: "Edit Details", // Try this too
                description: "Link to the original document",
              },
            };
          }
          return field;
        });
      },
    },
  }),
];
