import React from "react";
import Link from "next/link";
//FIXME: Remove the X or make it part of svg or just make it a character
import { X } from "lucide-react";

type LinkType = {
  type?: "reference" | "custom";
  reference?: {
    relationTo: string;
    value: string | { id: string };
  };
  url?: string;
  newTab?: boolean;
};

// Helper function to resolve link URL
const resolveLinkUrl = (link: LinkType) => {
  if (!link) return "#";

  if (link.type === "custom" && link.url) {
    return link.url;
  }

  if (link.type === "reference" && link.reference) {
    const { relationTo, value } = link.reference;
    return `/${relationTo}/${typeof value === "string" ? value : value.id || ""}`;
  }

  return "#";
};

export type NotificationProps = {
  enabled?: boolean;
  message?: string;
  backgroundColor?: string;
  textColor?: string;
  dismissible?: boolean;
  hasLink?: boolean;
  linkWrapper?: {
    link?: LinkType;
  };
};

export const Notification: React.FC<NotificationProps> = ({
  enabled = false,
  message = "",
  backgroundColor = "#E5F6FD",
  textColor = "#0C4A6E",
  dismissible = false,
  hasLink = false,
  linkWrapper,
}) => {
  // Don't render if not enabled or no message
  if (!enabled || !message) return null;

  const NotificationContent = () => (
    <div className="container mx-auto flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <p>{message}</p>
      </div>
      {dismissible && (
        <button
          className="flex items-center justify-center rounded-full p-1 hover:bg-black hover:bg-opacity-20"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  // If notification should be a link
  if (hasLink && linkWrapper?.link) {
    const link = linkWrapper.link;
    const linkUrl = resolveLinkUrl(link);
    const target = link.newTab ? "_blank" : "_self";
    const rel = link.newTab ? "noopener noreferrer" : undefined;

    return (
      <Link
        href={linkUrl}
        target={target}
        rel={rel}
        className="block w-full cursor-pointer py-3 hover:opacity-90"
        style={{
          backgroundColor,
          color: textColor,
        }}
      >
        <NotificationContent />
      </Link>
    );
  }

  // Regular notification (not a link)
  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
      }}
      className="w-full py-3"
    >
      <NotificationContent />
    </div>
  );
};
