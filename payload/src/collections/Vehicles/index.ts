import {
  CollectionConfig,
  FieldAccess,
  CollectionBeforeChangeHook,
  TextField,
  NumberField,
  DateField,
  SelectField,
  CheckboxField,
  ArrayField,
  TextareaField,
  RichTextField,
  JSONField,
  FieldHook,
  headersWithCors,
} from "payload";
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ParagraphFeature,
  BlockquoteFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { getR2Client } from "@/utilities/r2";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
// TODO: STUFF
//  - Add Version log default payload
//  - Add "Delete" button and View Vehicle Button (takes you to page)
//  - Add "Published" or "excluded". Add "In Progress, $Pending Sales, or $Sold"
//  - Add Features as seperate tab
//  - Add Similar Vehicles as seperate tab

interface VehicleData {
  id: string | number;
  vin?: string;
  stock?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  our_price?: number;
  // Add other fields as needed
  lockedFields?: { field: string }[];
  [key: string]: any;
}

// Move lockedFields options to a constant
const LOCKABLE_FIELDS = [
  "vin",
  "stock",
  "year",
  "make",
  "model",
  "trim",
  "ourPrice",
  "type",
  "dateAdded",
  "dateInStock",
  "internetSpecial",
  "viewCount",
  "originalPrice",
  "sellingPrice",
  "msrp",
  "bookValue",
  "invoice",
  "internetPrice",
  "cost",
  "packCost",
  "additionalEquipmentCost",
  "wholesalePrice",
  "holdbackCost",
  "floorPlanCost",
  "dealerProcessingFee",
  "miscPrice1",
  "miscPrice2",
  "miscPrice3",
  "discounts",
  "totalSavings",
  "leasePayment",
  "advancedPricingDetail",
  "description",
  "odometer",
  "body",
  "bodytype",
  "doors",
  "capacity",
  "exteriorColor",
  "exteriorColorGeneric",
  "interiorColor",
  "interiorColorGeneric",
  "cityMpg",
  "hwMpg",
  "evRange",
  "fueltype",
  "engineDescription",
  "cylinders",
  "engineDisplacement",
  "hp",
  "engineBlockType",
  "engineAspirationType",
  "transmissionDescription",
  "drivetrain",
  "dateModified",
  "dateSold",
  "eta",
  "certified",
  "location",
  "status",
  "inTransit",
  "daysInStock",
  "dealerId",
  "nhtsaVehicleData",
  "styleDescription",
  "modelNumber",
  "modelCode",
  "chromeBody",
  "chromeExteriorColor",
  "chromeMake",
  "chromeModel",
  "chromeStyleId",
  "chromeStyleName",
  "chromeTrim",
  "features",
  "historyReportLogo",
  "modelYear",
  "options",
  "premiumOptions",
  "warranty",
  //TODO: Add back in when ready
  //Feature_Groups
  // "Interior",
  // "Exterior",
  // "Tech",
  // "Entertainment",
  // "Safety",
  // "PremiumOptions",
  // "Comfort",
  // "Convenience",
  // "ExteriorAndAppearance",
  // "FuelEconomyAndEmissions",
  // "InCarEntertainment",
  // "PowertrainAndMechanical",
  // "TechnologyAndTelematics",
] as const;

const FEATURE_GROUPS = [
  "Interior",
  "Exterior",
  "Tech",
  "Entertainment",
  "Safety",
  "PremiumOptions",
  "Comfort",
  "Convenience",
  "ExteriorAndAppearance",
  "FuelEconomyAndEmissions",
  "InCarEntertainment",
  "PowertrainAndMechanical",
  "TechnologyAndTelematics",
];

const createFeatureGroup = (groupName: string) => {
  return [
    createEditableField(groupName, "array", {
      // label: groupName,
      label: groupName,
      admin: {
        description: `${groupName} features of the vehicle`,
        components: {
          Field: "/components/FeaturesField#FeaturesField",
        },
      },
      fields: [
        {
          name: "feature",
          type: "text",
          required: true,
          admin: {
            description: `Add a ${groupName} feature`,
          },
        },
      ],
    }),
    //TODO: Figure out later. Look for featuesfield blocked out comments. The items did not show when locking virtual field
    // createLockedVirtualField(groupName, "array", {
    //   label: `${groupName} 🔒`,
    //   admin: {
    //     components: {
    //       Field: "/components/FeaturesField#FeaturesField",
    //     },
    //     readOnly: true,
    //   },
    //   fields: [
    //     {
    //       name: "feature",
    //       type: "text",
    //       required: true,
    //       admin: {
    //         description: `Add a ${groupName} feature`,
    //       },
    //     },
    //   ],
    // }),
  ];
};

const restrictUpdateIfLocked =
  (fieldName: string): FieldAccess<VehicleData> =>
  ({ req, doc }) => {
    if (!req.user || !doc) return true;
    const lockedFields = doc?.lockedFields || [];
    return !lockedFields.some((item) => item.field === fieldName);
  };

const isFieldLockedInData = (
  fieldName: string,
  data: Partial<VehicleData>,
): boolean => {
  const lockedFields = data?.lockedFields || [];
  return lockedFields.some((item) => item.field === fieldName);
};

// Field factories with specific types

// Create a formatted display field that will appear right next to the number field
// WARNING: Too much work making createCurrencyDisplayField and the virtual one work. Better to just let the users work with numbers
const createCurrencyDisplayField = (
  name: string,
  options: any = {},
): TextField => {
  // Explicitly return TextField type
  return {
    name: `${name} Display`,
    type: "text", // This should match the TextField type
    admin: {
      className: "CurrencyDisplayField",
      readOnly: true,
      width: options.width || "50%",
      condition: (data: Partial<VehicleData>) =>
        // Only show when the number field is visible
        !isFieldLockedInData(name, data),
      ...(options.admin || {}),
    },
    hooks: {
      beforeChange: [
        ({ siblingData }: { siblingData: Partial<VehicleData> }) => {
          // This field shouldn't be stored in the database
          delete siblingData[`${name}_formatted`];
        },
      ],
      afterRead: [
        // Fix the hook parameter type to match Payload's expectations
        (({ value, data }) => {
          // Format the number with $ and commas
          const numValue = data?.[name];
          if (numValue === undefined || numValue === null) return "";

          return `$${Number(numValue).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}`;
        }) as FieldHook<VehicleData, string>, // Use a proper type cast
      ],
    },
    access: {
      create: () => false,
      update: () => false,
    },
    // Add virtual: true to prevent storing in the database
    virtual: true,
  };
};

const createLockedCurrencyDisplayField = (
  name: string,
  options: any = {},
): TextField => {
  // Explicitly return TextField type
  return {
    name: `${name} Display 🔒`,
    type: "text",
    admin: {
      className: "LockedCurrencyDisplayField",
      readOnly: true,
      width: options.width || "50%",
      condition: (data: Partial<VehicleData>) =>
        // Only show when the field is locked
        isFieldLockedInData(name, data),
      ...(options.admin || {}),
    },
    hooks: {
      beforeChange: [
        ({ siblingData }: { siblingData: Partial<VehicleData> }) => {
          // This field shouldn't be stored in the database
          delete siblingData[`${name}_locked_formatted`];
        },
      ],
      afterRead: [
        // Fix the hook parameter type to match Payload's expectations
        (({ value, data }) => {
          // Format the number with $ and commas
          const numValue = data?.[name];
          if (numValue === undefined || numValue === null) return "";

          return `$${Number(numValue).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}`;
        }) as FieldHook<VehicleData, string>, // Use a proper type cast
      ],
    },
    access: {
      create: () => false,
      update: () => false,
    },
    // Add virtual: true to prevent storing in the database
    virtual: true,
  };
};

const createEditableField = (name: string, type: string, options: any = {}) => {
  const baseField = {
    name,
    type,
    required: options.required ?? false,
    unique: options.unique ?? false,
    access: {
      update: restrictUpdateIfLocked(name),
    },
    admin: {
      width: options.width || "50%",
      condition: (data: Partial<VehicleData>) =>
        !isFieldLockedInData(name, data),
      ...options.admin,
    },
  };

  switch (type) {
    case "text":
      return baseField as TextField;
    case "number":
      return baseField as NumberField;
    case "date":
      return baseField as DateField;
    case "select":
      return { ...baseField, options: options.options || [] } as SelectField;
    case "checkbox":
      return baseField as CheckboxField;
    case "textarea":
      return baseField as TextareaField;
    case "richText":
      return { ...baseField, editor: options.editor } as RichTextField;
    case "json":
      return baseField as JSONField;
    case "array":
      return { ...baseField, fields: options.fields || [] } as ArrayField;
    default:
      throw new Error(`Unsupported field type: ${type}`);
  }
};

const createLockedVirtualField = (
  name: string,
  type: string,
  options: any = {},
) => {
  const baseField = {
    name: `${name} 🔒`,
    virtual: true,
    type,
    admin: {
      width: options.width || "50%",
      readOnly: true,
      condition: (data: Partial<VehicleData>) =>
        isFieldLockedInData(name, data),
      description: "This field is locked.",
      ...options.admin,
    },
    hooks: {
      beforeChange: [
        ({ siblingData }: { siblingData: Partial<VehicleData> }) => {
          delete siblingData[`${name} 🔒`];
        },
      ],
      afterRead: [
        (({ data }: { data: Partial<VehicleData> | undefined }) => {
          return data?.[name];
        }) as FieldHook<VehicleData, string | number | boolean | undefined>,
      ],
    },
    access: {
      create: () => false,
      update: () => false,
    },
  };

  switch (type) {
    case "text":
      return baseField as TextField;
    case "number":
      return baseField as NumberField;
    case "date":
      return baseField as DateField;
    case "select":
      return { ...baseField, options: options.options || [] } as SelectField;
    case "checkbox":
      return baseField as CheckboxField;
    case "textarea":
      return baseField as TextareaField;
    case "richText":
      return { ...baseField, editor: options.editor } as RichTextField;
    case "json":
      return baseField as JSONField;
    case "array":
      return { ...baseField, fields: options.fields || [] } as ArrayField;
    default:
      throw new Error(`Unsupported field type: ${type}`);
  }
};

const preserveLockedFields: CollectionBeforeChangeHook<VehicleData> = async ({
  data,
  originalDoc,
}) => {
  if (!originalDoc) return data;

  const mergedData = { ...data };
  const lockedFields = (originalDoc.lockedFields || []).map(
    (item: { field: string }) => item.field,
  );

  lockedFields.forEach((field: string) => {
    if (field in originalDoc && originalDoc[field] !== undefined) {
      mergedData[field] = originalDoc[field];
    }
  });

  return mergedData;
};

// {
//   //TODO: Default to name of vehicle stuff. Add this back at some point as a field
//   name: "search_title",
//   type: "text",
//   admin: { description: "Optional title for search/display" },
// },

//TODO: Add this back once search_title is put in correct place
// useAsTitle: "search_title", // Display this field as the title in the admin UI

export const Vehicles: CollectionConfig = {
  slug: "vehicles",
  admin: {
    defaultColumns: ["vin", "stock", "year", "make", "model", "ourPrice"],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    beforeChange: [preserveLockedFields],
  },
  versions: {
    drafts: { autosave: false, schedulePublish: false },
    maxPerDoc: 50,
  },
  fields: [
    // Row 1: VIN and Stock
    {
      type: "row",
      fields: [
        {
          name: "vin",
          type: "text",
          required: true,
          unique: true,
          access: {
            create: () => true,
            update: () => false,
          },
          admin: {
            width: "50%",
            condition: (data: Partial<VehicleData>) => !data.id,
          },
        },
        {
          name: "vin 🚗",
          type: "text",
          virtual: true,
          admin: {
            width: "50%",
            readOnly: true,
            condition: (data: Partial<VehicleData>) => !!data.id,
          },
          hooks: {
            beforeChange: [
              ({ siblingData }: { siblingData: Partial<VehicleData> }) => {
                delete siblingData["vin 🚗"];
              },
            ],
            afterRead: [
              (({ data }: { data: Partial<VehicleData> | undefined }) => {
                return data?.vin;
              }) as FieldHook<VehicleData, string | undefined>,
            ],
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        createEditableField("stock", "text", {
          admin: { required: true },
        }),
        createLockedVirtualField("stock", "text", {}),
      ],
    },
    // Sidebar Fields
    createEditableField("dateAdded", "date", {
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    }),
    createLockedVirtualField("dateAdded", "date", {
      admin: { position: "sidebar" },
    }),
    createEditableField("dateInStock", "date", {
      admin: { position: "sidebar", date: { pickerAppearance: "dayAndTime" } },
    }),
    createLockedVirtualField("dateInStock", "date", {
      admin: { position: "sidebar" },
    }),
    createEditableField("age", "number", { admin: { position: "sidebar" } }),
    createLockedVirtualField("age", "number", {
      admin: { position: "sidebar" },
    }),
    createEditableField("internetSpecial", "checkbox", {
      admin: { position: "sidebar" },
    }),
    createLockedVirtualField("internetSpecial", "checkbox", {
      admin: { position: "sidebar" },
    }),
    createEditableField("viewCount", "number", {
      admin: { position: "sidebar", readOnly: true },
    }),
    createLockedVirtualField("viewCount", "number", {
      admin: { position: "sidebar" },
    }),
    {
      name: "lockedFields",
      type: "array",
      label: "Locked Fields",
      admin: {
        position: "sidebar",
        description: "Select fields to prevent automatic updates.",
      },
      fields: [
        {
          name: "field",
          type: "select",
          options: LOCKABLE_FIELDS.map((value) => ({ label: value, value })),
          required: true,
        },
      ],
    },
    // Tabs
    {
      type: "tabs",
      tabs: [
        {
          label: "Basic Info",
          description: "Core vehicle identification details",
          fields: [
            {
              type: "row",
              fields: [
                createEditableField("type", "select", {
                  required: true,
                  options: [
                    { label: "New", value: "new" },
                    { label: "Used", value: "used" },
                    { label: "Certified Used", value: "certified_used" },
                  ],
                  admin: {
                    width: "50%",
                    description: "e.g., New, Used, Certified Used",
                  },
                }),
                createLockedVirtualField("type", "select", {
                  admin: { width: "50%" },
                }),
                createEditableField("year", "number", {
                  required: true,
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("year", "number", {
                  admin: { width: "50%" },
                }),
              ],
            },
            {
              type: "row",
              fields: [
                createEditableField("make", "text", {
                  required: true,
                  admin: { width: "33%" },
                }),
                createLockedVirtualField("make", "text", {
                  admin: { width: "33%" },
                }),
                createEditableField("model", "text", {
                  required: true,
                  admin: { width: "33%" },
                }),
                createLockedVirtualField("model", "text", {
                  admin: { width: "33%" },
                }),
                createEditableField("trim", "text", {
                  admin: { width: "33%" },
                }),
                createLockedVirtualField("trim", "text", {
                  admin: { width: "33%" },
                }),
              ],
            },
          ],
        },
        {
          label: "Vehicle Images",
          description: "Manage vehicle images stored in Cloudflare R2",
          fields: [
            createEditableField("photoUrls", "array", {
              fields: [{ name: "url", type: "text" }],
            }),
            createEditableField("photosLastModified", "date", {
              admin: { date: { pickerAppearance: "dayAndTime" } },
            }),
            //TODO: Work on removing this and just working of the array of Photos
            {
              name: "vehicleImages", // This won't store data; it’s a UI field
              type: "ui", // Use 'ui' type for custom components
              admin: {
                components: {
                  Field: "/components/VehicleImagesField#VehicleImagesField",
                },
              },
            },
          ],
        },
        // Pricing Section
        {
          label: "Pricing",
          description: "All pricing-related details",
          fields: [
            {
              type: "row",
              fields: [
                createEditableField("ourPrice", "number", {
                  required: true,
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("ourPrice", "number", {
                  admin: { width: "50%" },
                }),
                createEditableField("originalPrice", "number", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("originalPrice", "number", {
                  admin: { width: "50%" },
                }),
              ],
            },
            {
              type: "row",
              fields: [
                createEditableField("sellingPrice", "number", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("sellingPrice", "number", {
                  admin: { width: "50%" },
                }),
                createEditableField("msrp", "number", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("msrp", "number", {
                  admin: { width: "50%" },
                }),
              ],
            },
            createEditableField("internetPrice", "number"),
            createLockedVirtualField("internetPrice", "number"),
            createEditableField("bookValue", "number"),
            createLockedVirtualField("bookValue", "number"),
            createEditableField("invoice", "number"),
            createLockedVirtualField("invoice", "number"),
            createEditableField("cost", "number"),
            createLockedVirtualField("cost", "number"),
            createEditableField("packCost", "number"),
            createLockedVirtualField("packCost", "number"),
            createEditableField("additionalEquipmentCost", "number"),
            createLockedVirtualField("additionalEquipmentCost", "number"),
            createEditableField("wholesalePrice", "number"),
            createLockedVirtualField("wholesalePrice", "number"),
            createEditableField("holdbackCost", "number"),
            createLockedVirtualField("holdbackCost", "number"),
            createEditableField("floorPlanCost", "number"),
            createLockedVirtualField("floorPlanCost", "number"),
            createEditableField("dealerProcessingFee", "number"),
            createLockedVirtualField("dealerProcessingFee", "number"),
            {
              type: "row",
              fields: [
                createEditableField("miscPrice1", "number", {
                  admin: { width: "33%" },
                }),
                createLockedVirtualField("miscPrice1", "number", {
                  admin: { width: "33%" },
                }),
                createEditableField("miscPrice2", "number", {
                  admin: { width: "33%" },
                }),
                createLockedVirtualField("miscPrice2", "number", {
                  admin: { width: "33%" },
                }),
                createEditableField("miscPrice3", "number", {
                  admin: { width: "33%" },
                }),
                createLockedVirtualField("miscPrice3", "number", {
                  admin: { width: "33%" },
                }),
              ],
            },
          ],
        },
        // Specifications Section
        {
          label: "Specifications",
          description: "Technical and performance details",
          fields: [
            createEditableField("description", "richText", {
              editor: lexicalEditor({
                features: () => [
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  ParagraphFeature(),
                  HeadingFeature(),
                  BlockquoteFeature(),
                  HorizontalRuleFeature(),
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  StrikethroughFeature(),
                ],
              }),
            }),
            createLockedVirtualField("description", "richText"),
            {
              type: "row",
              fields: [
                createEditableField("odometer", "number", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("odometer", "number", {
                  admin: { width: "50%" },
                }),
                createEditableField("body", "text", {
                  admin: { width: "50%", description: "e.g., Sedan, SUV" },
                }),
                createLockedVirtualField("body", "text", {
                  admin: { width: "50%" },
                }),
              ],
            },
            {
              type: "row",
              fields: [
                createEditableField("bodytype", "text", {
                  admin: {
                    width: "50%",
                    description: "Broader category, e.g., Passenger Car",
                  },
                }),
                createLockedVirtualField("bodytype", "text", {
                  admin: { width: "50%" },
                }),
                createEditableField("doors", "number", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("doors", "number", {
                  admin: { width: "50%" },
                }),
              ],
            },
            createEditableField("capacity", "number"),
            createLockedVirtualField("capacity", "number"),
            {
              type: "row",
              fields: [
                createEditableField("exteriorColor", "text", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("exteriorColor", "text", {
                  admin: { width: "50%" },
                }),
                createEditableField("exteriorColorGeneric", "text", {
                  admin: {
                    width: "50%",
                    description: "e.g., Blue instead of Midnight Blue",
                  },
                }),
                createLockedVirtualField("exteriorColorGeneric", "text", {
                  admin: { width: "50%" },
                }),
              ],
            },
            {
              type: "row",
              fields: [
                createEditableField("interiorColor", "text", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("interiorColor", "text", {
                  admin: { width: "50%" },
                }),
                createEditableField("interiorColorGeneric", "text", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("interiorColorGeneric", "text", {
                  admin: { width: "50%" },
                }),
              ],
            },
            {
              type: "row",
              fields: [
                createEditableField("cityMpg", "text", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("cityMpg", "text", {
                  admin: { width: "50%" },
                }),
                createEditableField("hwMpg", "text", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("hwMpg", "text", {
                  admin: { width: "50%" },
                }),
              ],
            },
            createEditableField("evRange", "text"),
            createLockedVirtualField("evRange", "text"),
            createEditableField("fueltype", "text"),
            createLockedVirtualField("fueltype", "text"),
            createEditableField("engineDescription", "text"),
            createLockedVirtualField("engineDescription", "text"),
            {
              type: "row",
              fields: [
                createEditableField("cylinders", "number", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("cylinders", "number", {
                  admin: { width: "50%" },
                }),
                createEditableField("engineDisplacement", "number", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("engineDisplacement", "number", {
                  admin: { width: "50%" },
                }),
              ],
            },
            createEditableField("hp", "number"),
            createLockedVirtualField("hp", "number"),
            createEditableField("engineBlockType", "text"),
            createLockedVirtualField("engineBlockType", "text"),
            createEditableField("engineAspirationType", "text"),
            createLockedVirtualField("engineAspirationType", "text"),
            createEditableField("transmissionDescription", "text"),
            createLockedVirtualField("transmissionDescription", "text"),
            createEditableField("drivetrain", "text"),
            createLockedVirtualField("drivetrain", "text"),
          ],
        },
        // Inventory Details Section
        {
          label: "Inventory Details",
          description: "Stock and availability information",
          fields: [
            {
              type: "row",
              fields: [
                createEditableField("dateModified", "date", {
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "dayAndTime" },
                  },
                }),
                createLockedVirtualField("dateModified", "date", {
                  admin: { width: "50%" },
                }),
                createEditableField("dateSold", "date", {
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "dayAndTime" },
                  },
                }),
                createLockedVirtualField("dateSold", "date", {
                  admin: { width: "50%" },
                }),
              ],
            },
            createEditableField("eta", "date"),
            createLockedVirtualField("eta", "date"),
            createEditableField("certified", "checkbox"),
            createLockedVirtualField("certified", "checkbox"),
            createEditableField("location", "text"),
            createLockedVirtualField("location", "text"),
            createEditableField("status", "text"),
            createLockedVirtualField("status", "text"),
            createEditableField("inTransit", "select", {
              options: ["Yes", "No"],
            }),
            createLockedVirtualField("inTransit", "select", {
              options: ["Yes", "No"],
            }),
            createEditableField("daysInStock", "textarea"),
            createLockedVirtualField("daysInStock", "textarea"),
            createEditableField("dealerId", "textarea"),
            createLockedVirtualField("dealerId", "textarea"),
          ],
        },

        {
          label: "Features",
          description: "Vehicle features organized by category",
          fields: [
            // Feature category information
            {
              name: "features_info",
              type: "ui",
              admin: {
                components: {
                  Field: "/components/FeaturesInfoField#FeaturesInfoField",
                },
              },
            },

            // Feature Groups - each returns an array with both editable and locked versions
            // TODO: TEST OUT VIRTUAL FIELDS!
            ...FEATURE_GROUPS.flatMap(createFeatureGroup),
          ],
        },

        // Additional Info Section
        //
        {
          label: "Additional Info",
          description: "Descriptions, special fields, and external data",
          fields: [
            createEditableField("nhtsaVehicleData", "json"),
            createLockedVirtualField("nhtsaVehicleData", "json"),
            {
              type: "row",
              fields: [
                createEditableField("styleDescription", "text", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("styleDescription", "text", {
                  admin: { width: "50%" },
                }),
                createEditableField("modelNumber", "text", {
                  admin: { width: "50%" },
                }),
                createLockedVirtualField("modelNumber", "text", {
                  admin: { width: "50%" },
                }),
              ],
            },
            createEditableField("modelCode", "text"),
            createLockedVirtualField("modelCode", "text"),
            createEditableField("chromeBody", "textarea"),
            createLockedVirtualField("chromeBody", "textarea"),
            createEditableField("chromeExteriorColor", "textarea"),
            createLockedVirtualField("chromeExteriorColor", "textarea"),
            createEditableField("chromeMake", "textarea"),
            createLockedVirtualField("chromeMake", "textarea"),
            createEditableField("chromeModel", "textarea"),
            createLockedVirtualField("chromeModel", "textarea"),
            createEditableField("chromeStyleId", "textarea"),
            createLockedVirtualField("chromeStyleId", "textarea"),
            createEditableField("chromeStyleName", "textarea"),
            createLockedVirtualField("chromeStyleName", "textarea"),
            createEditableField("chromeTrim", "textarea"),
            createLockedVirtualField("chromeTrim", "textarea"),
            createEditableField("features", "textarea"),
            createLockedVirtualField("features", "textarea"),
            createEditableField("historyReportLogo", "textarea"),
            createLockedVirtualField("historyReportLogo", "textarea"),
            createEditableField("modelYear", "textarea"),
            createLockedVirtualField("modelYear", "textarea"),
            createEditableField("options", "textarea"),
            createLockedVirtualField("options", "textarea"),
            createEditableField("premiumOptions", "textarea"),
            createLockedVirtualField("premiumOptions", "textarea"),
            createEditableField("warranty", "textarea"),
            createLockedVirtualField("warranty", "textarea"),
            createEditableField("disposition", "text"),
            createLockedVirtualField("disposition", "text"),
          ],
        },
      ],
    },
  ],
  endpoints: [
    // In your Vehicles collection config
    {
      path: "/:id/images/list",
      method: "get",
      handler: async (req) => {
        const id = req.routeParams?.id as string;
        const R2 = getR2Client();

        try {
          const vehicle = await req.payload.findByID({
            collection: "vehicles",
            id,
          });

          if (!vehicle) {
            return Response.json(
              { error: "Vehicle not found" },
              { status: 404 },
            );
          }

          console.log("Listing images for:", {
            dealerId: vehicle.dealerId,
            vin: vehicle.vin,
          });

          const command = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET,
            Prefix: `${vehicle.dealerId}/${vehicle.vin}/`,
          });
          const result = await R2.send(command);
          console.log("R2 List result:", result);

          const images = (result.Contents || [])
            .map((obj) => obj.Key?.split("/").pop())
            .filter(Boolean);
          console.log("Processed images:", images);

          return Response.json(
            { images },
            {
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          );
        } catch (error) {
          console.error("Error listing images:", error);
          return Response.json(
            { error: "Internal server error", details: error.message },
            { status: 500 },
          );
        }
      },
    },
    {
      path: "/:id/images/upload",
      method: "post",
      handler: async (req) => {
        const id = req.routeParams?.id as string;
        const R2 = getR2Client();

        try {
          const vehicle = await req.payload.findByID({
            collection: "vehicles",
            id,
          });

          if (!vehicle) {
            return Response.json(
              { error: "Vehicle not found" },
              { status: 404 },
            );
          }

          if (!req.formData) {
            return Response.json(
              { error: "No form data provided" },
              { status: 400 },
            );
          }

          const formData = await req.formData();
          const file = formData.get("file") as File;
          const fileName = formData.get("fileName") as string;

          if (!file) {
            return Response.json(
              { error: "No file provided" },
              { status: 400 },
            );
          }

          const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: `${vehicle.dealerId}/${vehicle.vin}/${fileName}`,
            Body: Buffer.from(await file.arrayBuffer()),
            ContentType: file.type,
          });
          await R2.send(command);

          return Response.json(
            { message: "Upload successful" },
            {
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          );
        } catch (error) {
          console.error("Error uploading image:", error);
          return Response.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }
      },
    },
    {
      path: "/:id/images/delete",
      method: "post",
      handler: async (req) => {
        const id = req.routeParams?.id as string;
        const R2 = getR2Client();

        try {
          const vehicle = await req.payload.findByID({
            collection: "vehicles",
            id,
          });

          if (!vehicle) {
            return Response.json(
              { error: "Vehicle not found" },
              { status: 404 },
            );
          }

          if (!req.json) {
            return Response.json(
              { error: "No JSON data provided" },
              { status: 400 },
            );
          }

          const data = await req.json();
          const fileName = data.fileName as string;

          if (!fileName) {
            return Response.json(
              { error: "No filename provided" },
              { status: 400 },
            );
          }

          const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: `${vehicle.dealerId}/${vehicle.vin}/${fileName}`,
          });
          await R2.send(command);

          return Response.json(
            { message: "Delete successful" },
            {
              headers: headersWithCors({
                headers: new Headers(),
                req,
              }),
            },
          );
        } catch (error) {
          console.error("Error deleting image:", error);
          return Response.json(
            { error: "Internal server error" },
            { status: 500 },
          );
        }
      },
    },
  ],
};

export default Vehicles;
