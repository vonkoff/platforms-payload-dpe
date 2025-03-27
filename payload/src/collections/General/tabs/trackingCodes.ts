import { Tab } from 'payload'

// TODO: Look into
// adfiy, adroll, googlelead, autobytel, callmeaserument/centruyinteractive, crazyegg, inspectlet, mBuyAdvertising, mongoometrics, showroomLogic

export const trackingCodesTab: Tab = {
  label: 'Tracking Code Configuration',
  fields: [
    {
      name: 'trackingCodes',
      type: 'group',
      fields: [
        {
          name: 'trackingCodes',
          type: 'group',
          fields: [
            {
              name: 'autoTrader',
              type: 'group',
              label: 'AutoTrader',
              fields: [
                {
                  name: 'digitalAudienceAnalysisSslUrl',
                  type: 'text',
                  label: 'Digital Audience Analysis SSL URL',
                },
                {
                  name: 'digitalAudienceAnalysisNonSslUrl',
                  type: 'text',
                  label: 'Digital Audience Analysis Non-SSL URL',
                },
              ],
            },
            {
              name: 'edmundsPartnerAnalytics',
              type: 'group',
              label: 'Edmunds Partner Analytics',
              fields: [
                {
                  name: 'partnerId',
                  type: 'text',
                  label: 'Partner ID',
                  admin: {
                    description: 'Numeric value from Script line',
                  },
                },
              ],
            },
            {
              name: 'hubSpot',
              type: 'group',
              label: 'HubSpot Analytics',
              fields: [
                {
                  name: 'trackingId',
                  type: 'text',
                  label: 'Tracking ID',
                  admin: {
                    description: 'ID from the code snippet',
                  },
                },
              ],
            },
            {
              name: 'mixPanel',
              type: 'group',
              label: 'MixPanel Analytics',
              fields: [
                {
                  name: 'projectId',
                  type: 'text',
                  label: 'Project ID',
                  admin: {
                    description: 'Project ID from MixPanel Admin / Code Snippet',
                  },
                },
                {
                  name: 'globallyTrackedEvents',
                  type: 'text',
                  label: 'Globally Tracked Events',
                  admin: {
                    description: 'Events that apply site-wide',
                  },
                },
              ],
            },
            {
              name: 'lotLinx',
              type: 'group',
              label: 'LotLinx Inventory Advertising',
              fields: [
                {
                  name: 'lotLinxId',
                  type: 'text',
                  label: 'LotLinx ID',
                  admin: {
                    description: 'Value of LotLinxID from the Code Snippet',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
