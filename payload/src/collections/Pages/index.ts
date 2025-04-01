import type { CollectionConfig } from "payload";

import { slugField } from "@/fields/slug";
// import { ensureUniqueSlug } from './hooks/ensureUniqueSlug'
import { superAdminOrTenantAdminAccess } from "@/collections/Pages/access/superAdminOrTenantAdmin";
import { generatePreviewPath } from "../../utilities/generatePreviewPath";
import { Archive } from "../../blocks/ArchiveBlock/config";
import { CallToAction } from "../../blocks/CallToAction/config";
import { Content } from "../../blocks/Content/config";
import { FormBlock } from "../../blocks/Form/config";
import { MediaBlock } from "../../blocks/MediaBlock/config";
import { colorPickerField } from "@/fields/colorPicker";
import { link } from "@/fields/link";
//FIXME: Notification block finish up and use
// import NotificationBlock from "../../blocks/NotificationBlock/config";
import { hero } from "@/heros/config";
import { populatePublishedAt } from "@/hooks/populatePublishedAt";
import { revalidateDelete, revalidatePage } from "./hooks/revalidatePage";

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    create: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
    read: () => true,
    update: superAdminOrTenantAdminAccess,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: typeof data?.slug === "string" ? data.slug : "",
          collection: "pages",
          req,
          data,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === "string" ? data.slug : "",
        collection: "pages",
        req,
        data,
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          fields: [
            hero,
            {
              name: "notification",
              type: "group",
              label: "Page Notification",
              admin: {
                description:
                  "Add a notification specific to this page (optional)",
              },
              fields: [
                {
                  name: "enabled",
                  type: "checkbox",
                  label: "Show Notification",
                  defaultValue: false,
                },
                {
                  name: "message",
                  type: "text",
                  label: "Notification Message",
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                colorPickerField({
                  name: "backgroundColor",
                  label: "Background Color",
                  defaultValue: "#E5F6FD",
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                }),
                colorPickerField({
                  name: "textColor",
                  label: "Text Color",
                  defaultValue: "#0C4A6E",
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                }),
                {
                  name: "dismissible",
                  type: "checkbox",
                  label: "Allow users to dismiss this notification",
                  defaultValue: false,
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: "hasLink",
                  type: "checkbox",
                  label: "Make the entire notification clickable",
                  defaultValue: false,
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: "linkWrapper",
                  type: "group",
                  label: "Notification Link",
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData?.enabled && siblingData?.hasLink === true,
                    style: {
                      borderTop: "1px solid #e1e1e1",
                      paddingTop: "1rem",
                      marginTop: "1rem",
                    },
                  },
                  fields: [
                    link({
                      appearances: false,
                      disableLabel: true,
                    }),
                  ],
                },

                // {
                //   name: "link",
                //   type: "group",
                //   label: "Add Link",
                //   admin: {
                //     condition: (_, siblingData) => siblingData?.enabled,
                //   },
                //   fields: [
                //     {
                //       name: "text",
                //       type: "text",
                //       label: "Link Text",
                //     },
                //     {
                //       name: "url",
                //       type: "text",
                //       label: "URL",
                //     },
                //     {
                //       name: "newTab",
                //       type: "checkbox",
                //       label: "Open in new tab",
                //       defaultValue: false,
                //     },
                //   ],
                // },
              ],
            },
          ],
          label: "Hero",
        },
        {
          fields: [
            {
              name: "layout",
              type: "blocks",
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                // NotificationBlock,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: "Content",
        },
        {
          name: "meta",
          label: "SEO",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: "media",
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
        },
      ],
    },

    {
      name: "publishedAt",
      type: "date",
      admin: { position: "sidebar" },
    },
    ...slugField(),

    //TODO: Removed from multi-tenant start... think slug I would like to work with nested doc plugin.
    // Should ensure unique slug by parent
    // {
    //   name: "slug",
    //   type: "text",
    //   defaultValue: "home",
    //   hooks: { beforeValidate: [ensureUniqueSlug] },
    //   index: true,
    // },
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 50,
  },
};
