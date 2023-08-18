# Optimizely

DEPT DASH™ stacks have an optional integration with [Optimizely](https://www.optimizely.com/), a feature-flagging and A/B testing/experimentation platform.

## Getting started

1. Create an Optimizely account and project. You can do this by following the [Optimizely Quick Start Guide](https://help.optimizely.com/Integrate_Other_Platforms/Quick_Start_Guide).

2. Update the `OPTIMIZELY_SDK_KEY` environment variable in the `.env` file to match the SDK key for your Optimizely project.

3. Create some flags, experiments, audiences, events, and variables in your Optimizely project. You can do this by following the guides below.

   1. Create a new Optimizely feature flag. You can do this by following the [Optimizely Feature Flag Guide](https://help.optimizely.com/Feature_Flag/Feature_Flag_Guide).

   2. Create a new Optimizely experiment. You can do this by following the [Optimizely Experiment Guide](https://help.optimizely.com/Experiment/Experiment_Guide).

   3. Create a new Optimizely audience. You can do this by following the [Optimizely Audience Guide](https://help.optimizely.com/Audience/Audience_Guide).

   4. Create a new Optimizely event. You can do this by following the [Optimizely Event Guide](https://help.optimizely.com/Event/Event_Guide).

   5. Create a new Optimizely variable. You can do this by following the [Optimizely Variable Guide](https://help.optimizely.com/Variable/Variable_Guide).

4. Check out the `routes/_/optimizely.tsx` file to see some very simple examples of how to use Optimizely in your application.
