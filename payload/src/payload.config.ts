import { mongooseAdapter } from "@payloadcms/db-mongodb";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Pages } from "./collections/Pages";
import { Tenants } from "./collections/Tenants";
import Vehicles from "./collections/Vehicles";
import { General } from "./collections/General";
import { Posts } from "./collections/Posts";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import Users from "./collections/Users";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seed } from "./seed";
import { plugins } from "./plugins";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    user: "users",
    components: {
      views: {
        dashboard: {
          Component: "/elements/Dashboard#Dashboard",
        },
      },
      beforeLogin: ["/elements/BeforeLogin#BeforeLogin"],
      graphics: {
        Icon: "/elements/Logo#Icon",
        Logo: "/elements/Logo#Logo",
      },
      // Nav: "/elements/Nav#Nav",
    },
    avatar: {
      Component: "/elements/Avatar#Avatar",
    },
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: "light",
  },
  collections: [
    Pages,
    Posts,
    Media,
    Categories,
    Users,
    Tenants,
    General,
    Vehicles,
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  onInit: async (args) => {
    if (process.env.SEED_DB) {
      await seed(args);
    }
  },
  editor: lexicalEditor({}),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
  secret: process.env.PAYLOAD_SECRET as string,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: [...plugins],
});
