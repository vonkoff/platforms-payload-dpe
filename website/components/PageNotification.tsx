// components/PageNotification.tsx
import React from "react";
import Link from "next/link";
// import { X } from "lucide-react";
import { cookies } from "next/headers";
import DismissButton from "./DissmissNotificationButton";

type LinkType = {
  type?: "reference" | "custom";
  url?: string;
  newTab?: boolean;
};

export type NotificationProps = {
  enabled?: boolean;
  message?: string;
  backgroundColor?: string;
  textColor?: string;
  hasLink?: boolean;
  linkWrapper?: {
    link?: LinkType;
  };
  dismissible?: boolean;
  notificationId?: string;
};

export const Notification: React.FC<NotificationProps> = async ({
  enabled = false,
  message = "",
  backgroundColor = "#E5F6FD",
  textColor = "#0C4A6E",
  hasLink = false,
  linkWrapper,
  dismissible = false,
  //FIXME: Should it be global?
  notificationId = "global",
}) => {
  // Don't render if not enabled or no message
  const cookieStore = await cookies();
  const isDismissed =
    cookieStore.get(`notification-dismissed-${notificationId}`)?.value ===
    "true";

  if (!enabled || !message || isDismissed) return null;

  const NotificationContent = () => (
    <div className="container mx-auto flex h-full items-center justify-center px-4 text-center">
      <p>{message}</p>
    </div>
  );

  // If notification should be a link
  if (hasLink && linkWrapper?.link?.url) {
    const link = linkWrapper.link;
    const target = link.newTab ? "_blank" : "_self";
    const rel = link.newTab ? "noopener noreferrer" : undefined;
    const url = link.url || "/";

    return (
      <div
        className="relative w-full"
        style={{ backgroundColor, color: textColor }}
      >
        <Link
          href={url}
          target={target}
          rel={rel}
          className="block w-full cursor-pointer py-3 hover:opacity-90"
        >
          <NotificationContent />
        </Link>

        {dismissible && (
          <DismissButton
            notificationId={notificationId}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-current opacity-70 hover:opacity-100 focus:outline-none"
          />
        )}
      </div>
    );
  }

  // Regular notification (not a link)
  return (
    <div
      style={{
        backgroundColor,
        color: textColor,
      }}
      className="relative w-full py-3"
    >
      <NotificationContent />

      {dismissible && (
        <DismissButton
          notificationId={notificationId}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-current opacity-70 hover:opacity-100 focus:outline-none"
        />
      )}
    </div>
  );
};
