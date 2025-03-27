import { Tab } from 'payload'

export const socialMediaTab: Tab = {
  label: 'Social Media',
  fields: [
    {
      name: 'social',
      type: 'group',
      fields: [
        {
          name: 'social',
          type: 'group',
          fields: [
            {
              name: 'dealerProfiles',
              type: 'group',
              label: 'Dealer Review Profiles',
              fields: [
                {
                  name: 'carsUrl',
                  type: 'text',
                  label: 'CARS Dealer URL',
                },
                {
                  name: 'dealerRaterUrl',
                  type: 'text',
                  label: 'DealerRater Dealer URL',
                },
                {
                  name: 'edmundsUrl',
                  type: 'text',
                  label: 'Edmunds Dealer URL',
                },
                {
                  name: 'reviewsFeedUrl',
                  type: 'text',
                  label: 'Reviews Feed URL',
                },
              ],
            },
            {
              name: 'socialMedia',
              type: 'group',
              label: 'Social Media Profiles',
              fields: [
                {
                  name: 'facebook',
                  type: 'group',
                  label: 'Facebook',
                  fields: [
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Facebook URL',
                    },
                    {
                      name: 'appId',
                      type: 'text',
                      label: 'Facebook App ID',
                    },
                    {
                      name: 'appSecret',
                      type: 'text',
                      label: 'Facebook App Secret',
                      admin: {
                        description:
                          'Optional - Used to bypass certain Facebook limits for access tokens',
                      },
                    },
                  ],
                },
                {
                  name: 'instagram',
                  type: 'text',
                  label: 'Instagram URL',
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  label: 'LinkedIn URL',
                },
                {
                  name: 'maps',
                  type: 'text',
                  label: 'Maps URL',
                },
                {
                  name: 'pinterest',
                  type: 'text',
                  label: 'Pinterest URL',
                },
                {
                  name: 'tiktok',
                  type: 'text',
                  label: 'TikTok URL',
                },
                {
                  name: 'xTwitter',
                  type: 'text',
                  label: 'X URL',
                },
                {
                  name: 'yelp',
                  type: 'text',
                  label: 'Yelp URL',
                },
                {
                  name: 'youtube',
                  type: 'text',
                  label: 'YouTube URL',
                },
              ],
            },
            {
              name: 'openGraph',
              type: 'group',
              label: 'Open Graph Overrides - Frontpage Only',
              fields: [
                {
                  name: 'type',
                  type: 'text',
                  label: 'Open Graph Type',
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Open Graph Title',
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Open Graph URL',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Open Graph Description',
                },
                {
                  name: 'siteName',
                  type: 'text',
                  label: 'Open Graph Site Name',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
