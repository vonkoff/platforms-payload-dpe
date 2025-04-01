// import React from "react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { X } from "lucide-react";
// import { cn } from "@/utilities/ui";
//
// type NotificationVariant = "default" | "info" | "warning" | "success" | "error";
//
// export type NotificationBlockProps = {
//   title?: string;
//   message: string;
//   variant?: NotificationVariant;
//   dismissible?: boolean;
//   link?: {
//     label: string;
//     url: string;
//     newTab?: boolean;
//   };
// };
//
// export const NotificationBlock: React.FC<NotificationBlockProps> = ({
//   title,
//   message,
//   variant = "default",
//   dismissible = false,
//   link,
// }) => {
//   const [isVisible, setIsVisible] = React.useState(true);
//
//   if (!isVisible) return null;
//
//   const variantStyles = {
//     default: "bg-gray-100 text-gray-800",
//     info: "bg-blue-50 text-blue-800",
//     warning: "bg-yellow-50 text-yellow-800",
//     success: "bg-green-50 text-green-800",
//     error: "bg-red-50 text-red-800",
//   };
//
//   return (
//     <Alert
//       className={cn(
//         "relative border-none rounded-none",
//         variantStyles[variant]
//       )}
//     >
//       <div className="container mx-auto px-4 py-2 flex items-center justify-between">
//         <div className="flex-1">
//           {title && <AlertTitle className="font-semibold">{title}</AlertTitle>}
//           <AlertDescription className="flex items-center gap-3">
//             <span>{message}</span>
//             {link && (
//               <a
//                 href={link.url}
//                 target={link.newTab ? "_blank" : "_self"}
//                 className="underline font-medium hover:text-blue-600"
//                 rel={link.newTab ? "noopener noreferrer" : undefined}
//               >
//                 {link.label}
//               </a>
//             )}
//           </AlertDescription>
//         </div>
//         {dismissible && (
//           <button
//             onClick={() => setIsVisible(false)}
//             className="p-1 rounded-full hover:bg-gray-200"
//             aria-label="Dismiss notification"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         )}
//       </div>
//     </Alert>
//   );
// };
