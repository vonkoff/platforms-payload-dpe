import { Tab } from 'payload'

// const validateNoDuplicateDays = ({ value, data, siblingData }) => {
//   const otherEntries =
//     data?.departmentHours?.weekdayHours?.filter((entry) => entry !== siblingData) || []
//
//   const allSelectedDays = otherEntries.flatMap((entry) => entry?.days || [])
//   const duplicateDays = value?.filter((day) => allSelectedDays.includes(day))
//
//   if (duplicateDays?.length > 0) {
//     return `The following days are already scheduled: ${duplicateDays.join(', ')}`
//   }
//   return true
// }

export const departmentHoursTab: Tab = {
  label: 'Department Hours',
  fields: [
    {
      name: 'departmentHours',
      type: 'group',
      fields: [
        {
          name: 'weekdayHours',
          type: 'array',
          label: 'Weekly Hours',
          fields: [
            {
              name: 'days',
              type: 'select',
              hasMany: true,
              required: true,
              // validate: validateNoDuplicateDays,
              options: [
                { label: 'Monday', value: 'monday' },
                { label: 'Tuesday', value: 'tuesday' },
                { label: 'Wednesday', value: 'wednesday' },
                { label: 'Thursday', value: 'thursday' },
                { label: 'Friday', value: 'friday' },
                { label: 'Saturday', value: 'saturday' },
                { label: 'Sunday', value: 'sunday' },
              ],
            },
            {
              name: 'openTime',
              type: 'date',
              required: true,
              label: 'Opening Time',
              admin: {
                date: {
                  pickerAppearance: 'timeOnly',
                  displayFormat: 'h:mm aa',
                  timeFormat: 'h:mm aa',
                  timeIntervals: 15,
                },
              },
            },
            {
              name: 'closeTime',
              type: 'date',
              required: true,
              label: 'Closing Time',
              admin: {
                date: {
                  pickerAppearance: 'timeOnly',
                  displayFormat: 'h:mm aa',
                  timeFormat: 'h:mm aa',
                  timeIntervals: 15,
                },
              },
            },
          ],
        },
        {
          name: 'displaySettings',
          type: 'group',
          label: 'Hours Display Settings',
          fields: [
            {
              name: 'openText',
              type: 'text',
              label: 'Open Text',
              defaultValue: 'Open Today!',
            },
            {
              name: 'closedText',
              type: 'text',
              label: 'Closed Text',
              defaultValue: 'Closed',
            },
            {
              name: 'hoursLabel',
              type: 'text',
              label: 'Regular Hours Label',
              defaultValue: 'Regular Hours',
            },
          ],
        },
      ],
    },
  ],
}
