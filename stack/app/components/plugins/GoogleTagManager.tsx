import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import * as gtag from "../utils/gtags.client";

export type GoogleTagManagerProps = {
  gaTrackingId: string;
};

export const GoogleTagManager = ({ gaTrackingId }: GoogleTagManagerProps) => {
  const location = useLocation();

  useEffect(() => {
    /**
     * We're manually sending page views here,
     * so `send_page_view: false;`
     * is set in the ga initialization
     */
    gtag.pageview(location.pathname, gaTrackingId);
  }, [location, gaTrackingId]);

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
      />
      <script
        async
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                  send_page_view: false
                });
              `,
        }}
      />
    </>
  );
};
