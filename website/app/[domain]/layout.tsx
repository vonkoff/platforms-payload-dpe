import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
// TODO: Fix up use of SVG
import { Menu, ChevronDown } from "lucide-react";
import {
  getSiteData,
  getGeneralContactInfo,
  getHeaderData,
} from "@/lib/fetchers";
import { cn } from "@/lib/utils";

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
  };
}

// Helper function to resolve link URL
const resolveLinkUrl = (link: any) => {
  if (!link) return "#";

  if (link.type === "custom" && link.url) {
    return link.url;
  }

  if (link.type === "reference" && link.reference) {
    const { relationTo, value } = link.reference;
    // For references, you'd typically generate a URL based on the collection type and ID
    // This is a simplified version - adjust according to your routing structure
    return `/${relationTo}/${typeof value === "string" ? value : value.id || ""}`;
  }

  return "#";
};

// NavigationMenuLink component
const NavMenuLink = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) => (
  <Link
    className={cn(
      //TODO: hover:text-blue-600 is how color of link changes
      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-blue-600 focus:bg-gray-100 focus:text-blue-600",
      className,
    )}
    {...props}
  />
);

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

  if (
    domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    data.domain &&
    process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  ) {
    return redirect(`https://${data.domain}`);
  }

  // Fetch contact info
  const defaultContactInfo = {
    sales: "959-209-4911",
    service: "959-209-4911",
    parts: "959-209-4911",
    address: "699 Straits Turnpike, Watertown, CT 06795",
    hours: "9:00AM - 7:00PM",
  };

  const contactInfo =
    (await getGeneralContactInfo(domain)) || defaultContactInfo;

  // Fetch header data
  const headerData = await getHeaderData(domain);
  const navItems = headerData?.navItems || [];

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
                <address className="truncate not-italic">
                  {contactInfo.address}
                </address>
              </div>
            )}

            {/* Hours */}
            {contactInfo.hours && (
              <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
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

            {/* Desktop Navigation using shadcn NavigationMenu */}
            <div className="hidden lg:block">
              <NavigationMenu>
                <NavigationMenuList className="flex items-center gap-6">
                  {navItems.map((item: any) => (
                    <NavigationMenuItem key={item.id || item.link.label}>
                      {item.hasDropdown ? (
                        <>
                          <NavigationMenuTrigger className="font-medium text-gray-600 hover:text-blue-600">
                            {item.link.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[200px] gap-2 p-4">
                              {item.dropdownItems?.map((dropdownItem: any) => (
                                <li
                                  key={
                                    dropdownItem.id || dropdownItem.link.label
                                  }
                                >
                                  <NavMenuLink
                                    href={resolveLinkUrl(dropdownItem.link)}
                                  >
                                    {dropdownItem.link.label}
                                  </NavMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <Link
                          href={resolveLinkUrl(item.link)}
                          className="whitespace-nowrap font-medium text-gray-600 hover:text-blue-600"
                          target={item.link.newTab ? "_blank" : "_self"}
                        >
                          {item.link.label}
                        </Link>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
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
                  {navItems.map((item: any) => (
                    <div key={item.id || item.link.label}>
                      {item.hasDropdown ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2">
                            <span className="text-lg font-medium text-gray-600">
                              {item.link.label}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                          </div>
                          <div className="space-y-2 pl-4">
                            {item.dropdownItems?.map((dropdownItem: any) => (
                              <Link
                                key={dropdownItem.id || dropdownItem.link.label}
                                href={resolveLinkUrl(dropdownItem.link)}
                                className="block py-2 text-base text-gray-600 hover:text-blue-600"
                                target={
                                  dropdownItem.link.newTab ? "_blank" : "_self"
                                }
                              >
                                {dropdownItem.link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={resolveLinkUrl(item.link)}
                          className="block py-2 text-lg font-medium text-gray-600 hover:text-blue-600"
                          target={item.link.newTab ? "_blank" : "_self"}
                        >
                          {item.link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div>{children}</div>
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
                {navItems.slice(0, 6).map((item: any) => (
                  <li key={item.id || item.link.label}>
                    <Link
                      href={resolveLinkUrl(item.link)}
                      className="text-gray-300 hover:text-white"
                      target={item.link.newTab ? "_blank" : "_self"}
                    >
                      {item.link.label}
                    </Link>
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
