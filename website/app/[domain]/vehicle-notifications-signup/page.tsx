import { getSiteData, getVehicleModels } from "@/lib/fetchers";
import VehicleNotificationsForm from "@/components/VehicleNotificationsForm";

interface VehicleNotificationsPageProps {
  params: Promise<{
    domain: string;
  }>;
}
export default async function VehicleNotificationsPage({
  params,
}: VehicleNotificationsPageProps) {
  const { domain } = await params;

  // Fetch data server-side
  const tenant = await getSiteData(domain);
  console.log(tenant, "tenant");

  // Only fetch vehicle models if we have a tenant
  const vehicleOptions = tenant.domain
    ? ((await getVehicleModels(domain)) as string[])
    : [];

  console.log(vehicleOptions);

  // Loading state is no longer needed since data is fetched server-side

  if (!tenant) {
    return (
      <div className="container mx-auto px-4 py-8">Dealership not found</div>
    );
  }

  // Pass data as props to the client component
  return (
    <VehicleNotificationsForm tenant={tenant} vehicleOptions={vehicleOptions} />
  );
}
