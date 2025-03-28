import Image from "next/image";
import { getPayload } from "payload";
import config from "@payload-config";

export default async function HomePage() {
  const payload = await getPayload({ config });

  const tenants = await payload.find({
    collection: "tenants",
    limit: 1000,
    overrideAccess: true,
    pagination: false,
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-10 bg-black">
      <Image
        width={512}
        height={512}
        src="/logo.png"
        alt="Platforms Starter Kit"
        className="w-48"
      />
      <div className="text-white">
        {tenants.docs && tenants.docs.length > 0 ? (
          <ul>
            {tenants.docs.map((tenant) => (
              <li key={tenant.id}>
                {tenant.name} (Subdomain: {tenant.subdomain || "N/A"}, Custom
                Domain: {tenant.domain || "N/A"})
              </li>
            ))}
          </ul>
        ) : (
          "No tenants found"
        )}
      </div>
    </div>
  );
}
