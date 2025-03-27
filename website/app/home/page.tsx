import { InlineSnippet } from "@/components/form/domain-configuration";
import Image from "next/image";
import { getPayload } from "payload";
import { config, Tenant } from "payload-app";

export default async function HomePage() {
  const payload = await getPayload({ config: config });
  console.log("Payload initialized successfully");

  // Fetch tenants from the "tenants" collection
  const tenants = await payload.find({
    collection: "tenants",
    limit: 1000,
    overrideAccess: true,
    pagination: false,
  });

  // Log the raw response and key details
  console.log("Tenants fetch response:", tenants);
  console.log("Number of tenants found:", tenants.docs.length);
  console.log("Tenant docs:", tenants.docs);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <Image
        width={512}
        height={512}
        src="/logo.png"
        alt="Platforms on Vercel"
        className="w-48"
      />
      <div className="text-white">
        {tenants.docs && tenants.docs.length > 0 ? (
          <ul>
            {tenants.docs.map((tenant) => (
              <li key={tenant.id}>
                {tenant.name} (Slug: {tenant.slug})
              </li>
            ))}
          </ul>
        ) : (
          "No tenants found"
        )}
      </div>
      <h1 className="text-white">
        Edit this page on{" "}
        <InlineSnippet className="ml-2 bg-blue-900 text-blue-100">
          app/home/page.tsx
        </InlineSnippet>
      </h1>
    </div>
  );
}
