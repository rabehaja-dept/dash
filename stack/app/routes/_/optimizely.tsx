import {
  useDecision,
  OptimizelyFeature,
  OptimizelyExperiment,
  OptimizelyVariation,
} from "@optimizely/react-sdk";

/**
 * See https://github.com/optimizely/react-sdk
 */

export function OptimizelyExampleOne() {
  const [decision] = useDecision("test_flag");
  const enabled = decision["enabled"] ? (
    <p> Feature enabled </p>
  ) : (
    <p> Feature not enabled </p>
  );

  return (
    <>
      <h2 className="text-title-md">Example One</h2>
      <div className="text-body-md">
        This example uses the
        <code className="text-primary">
          <pre>useDecision()</pre>
        </code>
        hook to determine the results of a feature flag.
      </div>
      <div className="border-1 w-[400px] border border-border p-16 text-center">
        {enabled}
      </div>
    </>
  );
}

export function OptimizelyExampleTwo() {
  return (
    <>
      <h2 className="mt-12 text-title-md">Example Two</h2>
      <div className="text-body-md">
        This example uses the
        <code className="text-primary">
          <pre>{"<OptimizelyFeature />"}</pre>
        </code>
        component to determine the results of a feature flag.
      </div>
      <div className="border-1 w-[400px] border border-border p-16 text-center">
        <OptimizelyFeature feature="test_flag_two">
          {(isEnabled, variables) =>
            isEnabled ? (
              <p>Feature enabled!</p>
            ) : (
              <p>
                Feature not enabled. <br />
                Variable values: &nbsp;
                {JSON.stringify(variables)}
              </p>
            )
          }
        </OptimizelyFeature>
      </div>
    </>
  );
}

export function ExperimentComponent() {
  return (
    <>
      <h2 className="mt-12 text-title-md">Example Three</h2>
      <div className="text-body-md">
        This example uses the
        <code className="text-primary">
          <pre>{`<OptimizelyExperiment /> && <OptimizelyVariation />`}</pre>
        </code>
        components to determine the results of a feature flag's experiment.
        <br />
        This example can result in a "simple," "complex," or "standard"
        variation.
      </div>
      <div className="w-[400px] text-center">
        <OptimizelyExperiment
          experiment="test_flag_three_experiment"
          timeout={3000}
        >
          <OptimizelyVariation variation="simple">
            <div className="border-1 border border-border p-16">
              Simple variation
            </div>
          </OptimizelyVariation>

          <OptimizelyVariation variation="complex">
            <div className="border-1 border border-border p-16">
              Complex variation
            </div>
          </OptimizelyVariation>

          <OptimizelyVariation variation="standard">
            <div className="border-1 border border-border p-16">
              Standard variation
            </div>
          </OptimizelyVariation>

          <OptimizelyVariation default>
            <div className="border-1 border border-border p-16">
              Standard variation
            </div>
          </OptimizelyVariation>
        </OptimizelyExperiment>
      </div>
    </>
  );
}

export default function Optimizely() {
  return (
    <div className="m-10 flex flex-col items-center text-center">
      <OptimizelyExampleOne />
      <OptimizelyExampleTwo />
      <ExperimentComponent />
    </div>
  );
}
