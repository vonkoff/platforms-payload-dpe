import { Tab } from 'payload'

export const siteNoticeTab: Tab = {
  label: 'Site Notice',
  fields: [
    {
      name: 'siteNotice',
      type: 'group',
      fields: [
        {
          name: 'siteNotice',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Enable Site Notice',
            },
            {
              name: 'displayAtTop',
              type: 'checkbox',
              label: 'Check this box to move the notice to the top of each page',
            },
            // {
            //   name: 'priority',
            //   type: 'number',
            //   label: 'Set the Priority of the placement',
            //   admin: {
            //     description:
            //       'MUST be a number > 0. This is only applicable on sites where DI Stacks are enabled.',
            //   },
            // },
            {
              name: 'removeCloseButton',
              type: 'checkbox',
              label:
                'Check if you would like to remove the close button and disable the ability to close the site notice.',
            },
            {
              name: 'removeIBackground',
              type: 'checkbox',
              label: 'Remove the transparent "i" background',
            },
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Notice Background Color',
              admin: {
                description:
                  'Enter the hex code (6 digit color code) of a specific color. Red is the default (b90000).',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              label: 'Notice Text Color',
              admin: {
                description:
                  'Enter the hex code (6 digit color code) of a specific color. White is the default (ffffff).',
              },
            },
            // {
            //   name: 'zIndex',
            //   type: 'number',
            //   label: 'Notice Z-Index',
            // },
            // {
            //   name: 'margin',
            //   type: 'number',
            //   label: 'Notice Margin',
            // },
            {
              name: 'message',
              type: 'richText',
              label: 'Site Notice',
              admin: {
                description: 'Enter a message below to show on all pages across your site.',
              },
            },
          ],
        },
      ],
    },
  ],
}
