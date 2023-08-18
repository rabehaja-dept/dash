import * as OptimizelyReactSDK from "@optimizely/react-sdk";

export type OptimizelyProviderProps = {
  id: string;
  datafile: string | object;
  optimizelySdkKey: string;
  children: React.ReactNode;
};

export function OptimizelyProvider({
  id,
  datafile,
  optimizelySdkKey,
  children,
}: OptimizelyProviderProps) {
  // create an optimizely instance
  const optimizely = OptimizelyReactSDK.createInstance({
    datafile,
    sdkKey: optimizelySdkKey,
  });

  return (
    <OptimizelyReactSDK.OptimizelyProvider
      optimizely={optimizely}
      timeout={500}
      user={{ id }}
      isServerSide={true}
    >
      {children}
    </OptimizelyReactSDK.OptimizelyProvider>
  );
}
