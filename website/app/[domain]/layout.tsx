import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { getSiteData } from "@/lib/fetchers";
import { Metadata } from "next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Phone, Clock, MapPin, Menu } from "lucide-react";

export async function generateMetadata(props: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata | null> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);
  if (!data) {
    return null;
  }
  const {
    name: title,
    description,
    image,
    logo,
    //@ts-ignore
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@vercel",
    },
    icons: [logo],
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   data.customDomain && {
    //     alternates: {
    //       canonical: `https://${data.customDomain}`,
    //     },
    //   }),
  };
}

export default async function SiteLayout(props: {
  params: Promise<{ domain: string }>;
  children: ReactNode;
}) {
  const params = await props.params;

  const { children } = props;

  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  // const generalDoc = await fetchGeneralDataForTenant(data.id);

  // Optional: Redirect to custom domain if it exists
  // if (
  //   domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
  //   data.customDomain &&
  //   process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  // ) {
  //   return redirect(`https://${data.customDomain}`);
  // }

  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.domain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.domain}`);
  }

  // Fallback defaults
  // const defaultContactInfo: ContactInfo = {
  const defaultContactInfo = {
    sales: "959-209-4911",
    service: "959-209-4911",
    parts: "959-209-4911",
    address: "699 Straits Turnpike, Watertown, CT 06795",
    hours: "9:00AM - 7:00PM",
  };

  // Extract dynamic contact info from General data
  // TODO: Fixup fallback
  // const contactInfo = getContactInfo(generalDoc, defaultContactInfo);
  const contactInfo = defaultContactInfo;

  const navItems = [
    "New",
    "Pre-Owned",
    "Custom Order",
    "Service & Parts",
    "Finance",
    "About Us",
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Info Bar - Hidden below lg, forced single line */}
      <div className="hidden overflow-hidden bg-gray-100 py-2 text-gray-700 lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between lg:text-xs xl:text-sm">
            {/* Contact Numbers - Compressed spacing at lg */}
            <div className="flex shrink-0 items-center lg:gap-2 xl:gap-4">
              {contactInfo.sales && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Phone size={14} />
                  <span className="font-semibold">Sales:</span>
                  <a
                    href={`tel:${contactInfo.sales}`}
                    className="hover:text-blue-600"
                  >
                    {contactInfo.sales}
                  </a>
                </div>
              )}
              {contactInfo.service && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Phone size={14} />
                  <span className="font-semibold">Service:</span>
                  <a
                    href={`tel:${contactInfo.service}`}
                    className="hover:text-blue-600"
                  >
                    {contactInfo.service}
                  </a>
                </div>
              )}
              {contactInfo.parts && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Phone size={14} />
                  <span className="font-semibold">Parts:</span>
                  <a
                    href={`tel:${contactInfo.parts}`}
                    className="hover:text-blue-600"
                  >
                    {contactInfo.parts}
                  </a>
                </div>
              )}
            </div>

            {/* Address with truncation if needed */}
            {contactInfo.address && (
              <div className="mx-4 flex shrink items-center gap-1 whitespace-nowrap">
                <MapPin size={14} className="shrink-0" />
                <address className="truncate not-italic">
                  {contactInfo.address}
                </address>
              </div>
            )}

            {/* Hours */}
            {contactInfo.hours && (
              <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
                <Clock size={14} className="shrink-0" />
                <span>Today: {contactInfo.hours}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo Placeholder */}
            <div className="text-2xl font-bold text-gray-800">DEALERSHIP</div>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="whitespace-nowrap font-medium text-gray-600 hover:text-blue-600"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger className="p-2 lg:hidden">
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {navItems.map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="py-2 text-lg font-medium text-gray-600 hover:text-blue-600"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">About Us</h3>
              <p className="text-gray-300">
                Your trusted dealership serving the community with quality
                vehicles and exceptional service.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact</h3>
              <div className="space-y-2 text-gray-300">
                <p>Sales: {contactInfo.sales}</p>
                <p>Service: {contactInfo.service}</p>
                <p>Parts: {contactInfo.parts}</p>
                <p>{contactInfo.address}</p>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Hours</h3>
              <p className="text-gray-300">Today: {contactInfo.hours}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
