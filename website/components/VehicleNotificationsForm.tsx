//FIXME: Tanstack form implementation so far
// "use client";
//
// import { useActionState } from "react";
// import { initialFormState } from "@tanstack/react-form/nextjs";
// import {
//   mergeForm,
//   useForm,
//   useStore,
//   useTransform,
// } from "@tanstack/react-form";
// import { submitNotificationForm } from "@/lib/actions";
// import { formOptions } from "@tanstack/react-form/nextjs";
//
// type FrequencyOptions = "daily" | "weekly";
//
// const formOpts = formOptions({
//   defaultValues: {
//     email: "",
//     firstName: "",
//     frequency: "daily" as FrequencyOptions,
//     selectedModels: [] as string[],
//   },
// });
//
// interface VehicleNotificationsFormProps {
//   tenant: any;
//   vehicleOptions: string[];
// }
//
// export default function VehicleNotificationsForm({
//   tenant,
//   vehicleOptions,
// }: VehicleNotificationsFormProps) {
//   // Use the server action with useActionState
//   const [state, action] = useActionState(
//     submitNotificationForm,
//     initialFormState,
//   );
//
//   // Create the form with TanStack
//   const form = useForm({
//     ...formOpts,
//     transform: useTransform((baseForm) => mergeForm(baseForm, state!), [state]),
//   });
//
//   // Get form errors for display
//   const formErrors = useStore(form.store, (formState) => formState.errors);
//
//   // Check for submission status
//   const submissionState = useStore(form.store, (formState) => ({
//     isSubmitting: formState.isSubmitting,
//     isSubmitted: formState.isSubmitted,
//     canSubmit: formState.canSubmit,
//   }));
//
//   // Display a success message after submission
//   if (state?.success) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
//           <p className="font-bold">Success!</p>
//           <p>{state.message}</p>
//         </div>
//         <button
//           onClick={() => form.reset()}
//           className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//         >
//           Submit another
//         </button>
//       </div>
//     );
//   }
//
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="mb-4 text-2xl font-bold">Vehicle Notification Sign-Up</h1>
//
//       {/* Display form errors */}
//       {formErrors.length > 0 && (
//         <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
//           <ul className="list-disc pl-5">
//             {formErrors.map((error) => (
//               <li key={error as string}>{error as string}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//
//       <form
//         action={action as never}
//         onSubmit={() => form.handleSubmit()}
//         className="max-w-md space-y-4"
//       >
//         {/* Email Field */}
//         <form.Field name="email">
//           {(field) => (
//             <div>
//               <label htmlFor={field.name} className="block text-sm font-medium">
//                 Email
//               </label>
//               <input
//                 id={field.name}
//                 name={field.name}
//                 type="email"
//                 value={field.state.value}
//                 onChange={(e) => field.handleChange(e.target.value)}
//                 className="mt-1 block w-full rounded-md border p-2"
//                 required
//               />
//               {field.state.meta.errors.length > 0 && (
//                 <div className="mt-1 text-sm text-red-500">
//                   {field.state.meta.errors.map((error) => (
//                     <p key={error as string}>{error as string}</p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </form.Field>
//
//         {/* First Name Field */}
//         <form.Field name="firstName">
//           {(field) => (
//             <div>
//               <label htmlFor={field.name} className="block text-sm font-medium">
//                 First Name
//               </label>
//               <input
//                 id={field.name}
//                 name={field.name}
//                 type="text"
//                 value={field.state.value}
//                 onChange={(e) => field.handleChange(e.target.value)}
//                 className="mt-1 block w-full rounded-md border p-2"
//                 required
//               />
//               {field.state.meta.errors.length > 0 && (
//                 <div className="mt-1 text-sm text-red-500">
//                   {field.state.meta.errors.map((error) => (
//                     <p key={error as string}>{error as string}</p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </form.Field>
//
//         {/* Frequency Field */}
//         <form.Field name="frequency">
//           {(field) => (
//             <div>
//               <label htmlFor={field.name} className="block text-sm font-medium">
//                 Notification Frequency
//               </label>
//               <select
//                 id={field.name}
//                 name={field.name}
//                 value={field.state.value}
//                 onChange={(e) => {
//                   field.handleChange(e.target.value);
//                 }}
//                 className="mt-1 block w-full rounded-md border p-2"
//               >
//                 <option value="daily">Daily</option>
//                 <option value="weekly">Weekly</option>
//               </select>
//             </div>
//           )}
//         </form.Field>
//
//         {/* Vehicle Models Field */}
//         <form.Field name="selectedModels">
//           {(field) => (
//             <div>
//               <span className="block text-sm font-medium">Select Models</span>
//               <div className="mt-2 space-y-2">
//                 {vehicleOptions.length > 0 ? (
//                   vehicleOptions.map((option: string) => (
//                     <label key={option} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         name={`${field.name}[]`}
//                         value={option}
//                         checked={field.state.value.includes(option)}
//                         onChange={(e) => {
//                           if (e.target.checked) {
//                             field.pushValue(option);
//                           } else {
//                             field.removeValue(
//                               field.state.value.indexOf(option),
//                             );
//                           }
//                         }}
//                         className="mr-2"
//                       />
//                       {option}
//                     </label>
//                   ))
//                 ) : (
//                   <p>No vehicle models available</p>
//                 )}
//               </div>
//               {field.state.meta.errors.length > 0 && (
//                 <div className="mt-1 text-sm text-red-500">
//                   {field.state.meta.errors.map((error) => (
//                     <p key={error as string}>{error as string}</p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </form.Field>
//
//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={!submissionState.canSubmit || submissionState.isSubmitting}
//           className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {submissionState.isSubmitting ? "Submitting..." : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// }
