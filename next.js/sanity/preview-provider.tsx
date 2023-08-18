import { useMemo } from "react";
import { LiveQueryProvider } from "next-sanity/preview";
import { client } from "./lib/client";

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const currentClient = useMemo(() => client(token), [token]);
  return (
    <LiveQueryProvider client={currentClient}>{children}</LiveQueryProvider>
  );
}
