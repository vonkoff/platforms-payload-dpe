import Link from "next/link";

export default async ({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string[] }>;
}) => {
  return (
    <div>
      <h1>Multi-Tenant Example</h1>
      <p>
        This multi-tenant example allows you to explore multi-tenancy with
        domains and with slugs.
      </p>
      <p>Click for ADMIN:</p>
      <Link href="/admin">ADMIN LINK</Link>

      <h2>Domains</h2>
      <p>
        When you visit a tenant by domain, the domain is used to determine the
        tenant.
      </p>
      <p>
        For example, visiting{" "}
        <a href="http://gold.test:3000/tenant-domains/login">
          http://gold.test:3000/tenant-domains/login
        </a>{" "}
        will show the tenant with the domain "gold.test".
      </p>

      <h2>Slugs</h2>
      <p>
        When you visit a tenant by slug, the slug is used to determine the
        tenant.
      </p>
      <p>
        For example, visiting{" "}
        <a href="http://localhost:3000/tenant-slugs/silver/login">
          http://localhost:3000/tenant-slugs/silver/login
        </a>{" "}
        will show the tenant with the slug "silver".
      </p>
    </div>
  );
};
