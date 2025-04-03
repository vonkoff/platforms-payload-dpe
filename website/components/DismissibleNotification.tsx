// // components/DismissableNotification.tsx
// "use client";
//
// import React, { useState, useEffect } from "react";
// import { Notification, NotificationProps } from "./PageNotification";
//
// interface DismissableNotificationProps extends NotificationProps {
//   notificationId: string;
// }
//
// export const DismissibleNotification: React.FC<DismissableNotificationProps> = (
//   props,
// ) => {
//   const { notificationId, ...notificationProps } = props;
//   const [dismissed, setDismissed] = useState(false);
//   const [mounted, setMounted] = useState(false);
//
//   //TODO: Consider localstorage instead of sessionstorage so it stays?
//   useEffect(() => {
//     setMounted(true);
//     const isDismissed = sessionStorage.getItem(
//       `notification-dismissed-${notificationId}`,
//     );
//     if (isDismissed === "true") {
//       setDismissed(true);
//     }
//   }, [notificationId]);
//
//   const handleDismiss = () => {
//     setDismissed(true);
//     // Store dismissal in localStorage
//     sessionStorage.setItem(`notification-dismissed-${notificationId}`, "true");
//   };
//
//   // Don't render anything during SSR or before hydration
//   if (!mounted) return null;
//
//   // Don't render if dismissed
//   if (dismissed) return null;
//
//   return (
//     <Notification
//       {...notificationProps}
//       dismissible={true}
//       onDismiss={handleDismiss}
//     />
//   );
// };
