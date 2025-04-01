// import { Block } from "payload";
//
// export const NotificationBlock: Block = {
//   slug: "notification",
//   labels: {
//     singular: "Notification",
//     plural: "Notifications",
//   },
//   fields: [
//     {
//       name: "title",
//       label: "Title",
//       type: "text",
//     },
//     {
//       name: "message",
//       label: "Message",
//       type: "text",
//       required: true,
//     },
//     {
//       name: "variant",
//       label: "Variant",
//       type: "select",
//       defaultValue: "default",
//       options: [
//         {
//           label: "Default",
//           value: "default",
//         },
//         {
//           label: "Info",
//           value: "info",
//         },
//         {
//           label: "Warning",
//           value: "warning",
//         },
//         {
//           label: "Success",
//           value: "success",
//         },
//         {
//           label: "Error",
//           value: "error",
//         },
//       ],
//     },
//     {
//       name: "dismissible",
//       label: "Dismissible",
//       type: "checkbox",
//       defaultValue: false,
//     },
//     {
//       name: "link",
//       label: "Link",
//       type: "group",
//       fields: [
//         {
//           name: "label",
//           label: "Label",
//           type: "text",
//         },
//         {
//           name: "url",
//           label: "URL",
//           type: "text",
//         },
//         {
//           name: "newTab",
//           label: "Open in new tab",
//           type: "checkbox",
//           defaultValue: false,
//         },
//       ],
//     },
//   ],
// };
//
// // Export for use in your blocks configuration
// export default NotificationBlock;
