## Setting up Google Analytics

We've built-in support for Google Analytics by simply passing in your Analytics Tracking ID as an environment variable. This is optional - analytics code won't be added to your site if you leave this value blank.

To get started, set up an analytics property for your webpage in Google Analytics and add your tracking ID as the `GA_TRACKING_ID` environment variable. For more information about how to get started with Google Analytics and specifics about getting a tracking id, visit the [Google Analytics Documentation](https://support.google.com/analytics/answer/9306384?hl=en).

To extend Google Analytics functionality even further, try adding new methods to the `app/components/utils/gtags.client.ts` file and using them in your component code.
