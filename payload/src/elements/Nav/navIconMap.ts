import { CollectionSlug, GlobalSlug } from "payload";
import {
  Image,
  LayoutGrid,
  List,
  LucideProps,
  Car,
  StickyNote,
  Building,
  User,
  IterationCcw,
  ClipboardList,
  ClipboardPenLine,
  Search,
  BadgeInfo,
} from "lucide-react";
import { ExoticComponent } from "react";

export const navIconMap: Partial<
  Record<CollectionSlug | GlobalSlug, ExoticComponent<LucideProps>>
> = {
  categories: List,
  // customers: User,
  // devices: TabletSmartphone,
  // discountCodes: Percent,
  media: Image,
  tenants: Building,
  // orders: BookCopy,
  pages: StickyNote,
  posts: LayoutGrid,
  redirects: IterationCcw,
  // reviews: Star,
  users: User,
  forms: ClipboardList,
  "form-submissions": ClipboardPenLine,
  search: Search,
  general: BadgeInfo,
  vehicles: Car,
  // header: Smile,
  // mainMenu: Menu,
  // footer: Footprints,
};

export const getNavIcon = (slug: string) =>
  Object.hasOwn(navIconMap, slug)
    ? navIconMap[slug as CollectionSlug | GlobalSlug]
    : undefined;
