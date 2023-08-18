import { GOOGLE_MAPS_API_KEY as key } from "~/config";
import GoogleMapReact from "google-map-react";

/**
 *
 * MAKE SURE TO ADD YOUR OWN GOOGLE MAPS API KEY
 * TO THE CONFIG FILE. THE DEFAULT KEY
 * WILL NOT WORK IN PRODUCTION.
 *
 */

export type GoogleMapProps = {
  defaultCenter?: {
    lat: number;
    lng: number;
  };
  defaultZoom?: number;
  height: string;
  width: string;
  children?: React.ReactNode;
};

/**
 * @description A wrapper around GoogleMapReact
 * @see https://github.com/google-map-react/google-map-react
 * @param {{ lat: number, lng: number}} defaultCenter - The center of the map
 * @param {number} defaultZoom - The zoom level of the map
 * @param {string} height - The height of the map
 * @param {string} width - The width of the map
 * @param {React.ReactNode} children - The children of the map
 */
export const GoogleMap = ({
  defaultCenter = { lat: 52.370216, lng: 4.895168 },
  defaultZoom = 12,
  height,
  width,
  children,
}: GoogleMapProps) => {
  return (
    // Important! Always set the container height explicitly
    <div style={{ height, width }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
      >
        {!!children && children}
      </GoogleMapReact>
    </div>
  );
};
