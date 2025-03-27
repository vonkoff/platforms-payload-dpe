import { Tab } from "payload";

export const dealerInfoTab: Tab = {
  label: "Dealer Info",
  fields: [
    {
      name: "dealerInfo",
      type: "group",
      fields: [
        {
          name: "dealerInfo",
          type: "group",
          fields: [
            {
              name: "basicInfo",
              type: "group",
              label: "Basic Information",
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                  label: "Name",
                  admin: {
                    description:
                      "Name of the dealer with proper capitalization.",
                  },
                },
                //TODO: Maybe we need it later?
                // {
                //   name: 'id',
                //   type: 'text',
                //   label: 'ID',
                //   admin: {
                //     description: 'ID of the dealer. Used only in form notification emails.',
                //   },
                // },
                {
                  name: "description",
                  type: "textarea",
                  label: "Description",
                  admin: {
                    description:
                      "Description of the dealer that shows on certain pages.",
                  },
                },
                //TODO: For OEM dealerships?
                // {
                //   name: 'makes',
                //   type: 'array',
                //   label: 'Makes',
                //   admin: {
                //     description: 'List of makes for the dealer.',
                //   },
                //   fields: [
                //     {
                //       name: 'make',
                //       type: 'text',
                //     },
                //   ],
                // },
                // {
                //   name: 'nextModelYearMonth',
                //   type: 'select',
                //   label: 'Which month will next model year be available?',
                //   options: [
                //     { label: 'January', value: 'january' },
                //     { label: 'February', value: 'february' },
                //     { label: 'March', value: 'march' },
                //     { label: 'April', value: 'april' },
                //     { label: 'May', value: 'may' },
                //     { label: 'June', value: 'june' },
                //     { label: 'July', value: 'july' },
                //     { label: 'August', value: 'august' },
                //     { label: 'September', value: 'september' },
                //     { label: 'October', value: 'october' },
                //     { label: 'November', value: 'november' },
                //     { label: 'December', value: 'december' },
                //   ],
                // },
              ],
            },

            {
              label: "Location Info",
              type: "collapsible", // required
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "location",
                  type: "group",
                  label: "Location",
                  fields: [
                    {
                      name: "address",
                      type: "text",
                      label: "Address",
                    },
                    {
                      name: "city",
                      type: "text",
                      label: "City",
                    },
                    //TODO: Make list of choices
                    {
                      name: "state",
                      type: "text",
                      label: "State",
                    },
                    {
                      name: "zipcode",
                      type: "text",
                      label: "Zipcode",
                    },
                    {
                      name: "country",
                      type: "text",
                      label: "Country",
                    },
                    {
                      name: "location",
                      type: "point",
                      label: "Location",
                    },
                    {
                      name: "googleMapsUrl",
                      type: "text",
                      label: "Google Maps URL",
                    },
                    {
                      name: "googleMapsApiKey",
                      type: "text",
                      label: "Google Maps API Key",
                    },
                    //TODO: Mapbox?
                    // {
                    //   name: 'mapboxAccessToken',
                    //   type: 'text',
                    //   label: 'Mapbox Access Token',
                    // },
                    // {
                    //   name: 'mapboxStyleUrl',
                    //   type: 'text',
                    //   label: 'Mapbox Style URL',
                    // },
                    // {
                    //   name: 'mapboxMapMarker',
                    //   type: 'upload',
                    //   label: 'MapBox Map Marker',
                    //   relationTo: 'media',
                    // },
                  ],
                },
              ],
            },
            //TODO: Work in later...for SEO?
            // Maybe just make it base off longitude and latitude my own api that would find the location and cities near by
            // {
            //   name: 'targetCities',
            //   type: 'array',
            //   label: 'Target Cities',
            //   maxRows: 5,
            //   fields: [
            //     {
            //       name: 'city',
            //       type: 'text',
            //       label: 'Target City',
            //     },
            //   ],
            // },
            {
              label: "Phone Number Info",
              type: "collapsible", // required
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "phoneNumbers",
                  type: "group",
                  label: "Phone Numbers",
                  admin: {
                    style: {
                      fontSize: "24px", // Adjust this value as needed
                      fontWeight: "bold",
                    },
                  },
                  fields: [
                    {
                      name: "enablePhoneSorting",
                      type: "checkbox",
                      label: "Enable Phone Sorting",
                    },
                    {
                      name: "default",
                      type: "text",
                      label: "Default",
                    },
                    {
                      name: "fax",
                      type: "text",
                      label: "Fax",
                    },
                    {
                      name: "tollFree",
                      type: "text",
                      label: "Toll Free",
                    },
                    {
                      name: "commercial",
                      type: "text",
                      label: "Commercial",
                    },
                    {
                      name: "mobileCommercial",
                      type: "text",
                      label: "Mobile Commercial",
                    },
                    {
                      name: "financing",
                      type: "text",
                      label: "Financing",
                    },
                    {
                      name: "parts",
                      type: "text",
                      label: "Parts",
                    },
                    {
                      name: "mobileParts",
                      type: "text",
                      label: "Mobile Parts",
                    },
                    {
                      name: "sales",
                      type: "text",
                      label: "Sales",
                    },
                    {
                      name: "mobileSales",
                      type: "text",
                      label: "Mobile Sales",
                    },
                    {
                      name: "service",
                      type: "text",
                      label: "Service",
                    },
                    {
                      name: "mobileService",
                      type: "text",
                      label: "Mobile Service",
                    },
                    {
                      name: "bodyShop",
                      type: "text",
                      label: "Body Shop",
                    },
                    {
                      name: "collisionCenter",
                      type: "text",
                      label: "Collision Center",
                    },
                    {
                      name: "insuranceCenter",
                      type: "text",
                      label: "Insurance Center",
                    },
                    {
                      name: "rentalCenter",
                      type: "text",
                      label: "Rental Center",
                    },
                    //TODO: No idea what this is
                    // {
                    //   name: 'convertToMobile',
                    //   type: 'select',
                    //   label: 'Convert to Mobile Numbers',
                    //   options: [
                    //     { label: 'Yes', value: 'yes' },
                    //     { label: 'No', value: 'no' },
                    //   ],
                    // },
                  ],
                },
              ],
            },
            //TODO: Figure out emails...how we could connect to places and where needed
            {
              label: "Email Addresse Info",
              type: "collapsible",
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "emailAddresses",
                  type: "group",
                  label: "Email Addresses",
                  fields: [
                    {
                      name: "default",
                      type: "text",
                      label: "Default",
                    },
                    {
                      name: "replyTo",
                      type: "text",
                      label: "Reply To",
                    },
                    {
                      name: "financing",
                      type: "text",
                      label: "Financing",
                    },
                    {
                      name: "parts",
                      type: "text",
                      label: "Parts",
                    },
                    {
                      name: "sales",
                      type: "text",
                      label: "Sales",
                    },
                    {
                      name: "service",
                      type: "text",
                      label: "Service",
                    },
                    {
                      name: "bodyShop",
                      type: "text",
                      label: "Body Shop",
                    },
                    {
                      name: "collisionCenter",
                      type: "text",
                      label: "Collision Center",
                    },
                  ],
                },
              ],
            },
            //TODO: Add back and make it work
            // {
            //   name: 'favicon',
            //   type: 'upload',
            //   label: 'Favicon',
            //   relationTo: 'media',
            // },
          ],
        },
      ],
    },
  ],
};
