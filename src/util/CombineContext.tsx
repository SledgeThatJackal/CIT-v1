/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ReactNode } from "react";

function combineContext(
  providers: { provider: ComponentType<any>; props?: Record<string, any> }[]
): ComponentType<{ children: ReactNode }> {
  return providers.reduce(
    (Acc, { provider: Provider, props }) => {
      // eslint-disable-next-line react/display-name
      return ({ children }: { children: ReactNode }) => {
        return (
          <Provider {...props}>
            <Acc>{children}</Acc>
          </Provider>
        );
      };
    },
    ({ children }: { children: ReactNode }) => <>{children}</>
  );
}

export default function CombinedContextProvider({
  providers,
  children,
}: {
  providers: { provider: ComponentType<any>; props?: Record<string, any> }[];
  children: ReactNode;
}) {
  const CombinedProvider = combineContext(providers);
  return <CombinedProvider>{children}</CombinedProvider>;
}
