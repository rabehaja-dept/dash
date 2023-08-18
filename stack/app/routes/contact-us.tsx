import { useTranslation } from "react-i18next";
import type { Handle } from "~/@types";
import type { MetaFunction } from "@remix-run/node";
import { GoogleMap } from "~/components/plugins";
import { useGeoLocation } from "~/hooks/useGeoLocation";

export const handle: Handle = {
  i18n: ["common"],
};

export const meta: MetaFunction = () => ({
  title: "Contact Us",
  description: "Find a location near you!",
});

export default function Locations() {
  const { t } = useTranslation("common");
  const { latitude, longitude } = useGeoLocation();

  return (
    <section className="mx-10 my-10">
      <h2 className="mb-4 lg:mb-12">{t("Contact Us")}</h2>
      <GoogleMap
        height="600px"
        width="100%"
        defaultZoom={1}
        defaultCenter={{
          lat: latitude || 38.6532846,
          lng: longitude || -90.3838891,
        }}
      >
        {DeptLocations.map((location) => (
          <MapPin key={location.name} lat={location.lat} lng={location.lng} />
        ))}
        {latitude && longitude && <MyLocation lat={latitude} lng={longitude} />}
      </GoogleMap>
    </section>
  );
}

// These props are picked up by the parent Google Map component
export type MapPinProps = {
  lat: number;
  lng: number;
};

export const MapPin = ({ lat, lng }: MapPinProps) => {
  return (
    <div className="h-6 w-6">
      <div className="absolute left-0 top-0 h-2 w-2 rounded-full bg-black" />
      <span className="absolute left-0 top-0 h-2 w-2 animate-ping rounded-full bg-black opacity-75"></span>
      <img
        src="/logo.svg"
        alt="Logo"
        className="ml-[6px] mt-[6px] inline-block w-[50px]"
        width="20px"
      />
    </div>
  );
};

export const MyLocation = ({ lat, lng }: MapPinProps) => {
  return (
    <div className="relative flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
      <span className="inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
    </div>
  );
};

const DeptLocations: { name: string; lat: number; lng: number }[] = [
  {
    name: "Arhus",
    lat: 56.1500809,
    lng: 10.1982646,
  },
  {
    name: "Amsterdam",
    lat: 52.3446486,
    lng: 4.8441142,
  },
  {
    name: "Austin",
    lat: 30.2686541,
    lng: -97.7453496,
  },
  {
    name: "Berlin",
    lat: 52.5222301,
    lng: 13.4346461,
  },
  {
    name: "Bern",
    lat: 46.9466415,
    lng: 7.4541708,
  },
  {
    name: "Boston",
    lat: 42.3582655,
    lng: -71.0552519,
  },
  {
    name: "Charlottesville",
    lat: 38.0303642,
    lng: -78.481468,
  },
  {
    name: "Chicago",
    lat: 41.8815235,
    lng: -87.638181,
  },
  {
    name: "Cologne",
    lat: 50.913193,
    lng: 6.969271,
  },
  {
    name: "Copenhagen",
    lat: 55.6699691,
    lng: 12.5834384,
  },
  {
    name: "Delhi",
    lat: 28.4272534,
    lng: 77.1521689,
  },
  {
    name: "Denver",
    lat: 39.7705758,
    lng: -104.9749556,
  },
  {
    name: "Dresden",
    lat: 51.0576493,
    lng: 13.7250339,
  },
  {
    name: "Dublin",
    lat: 53.3331478,
    lng: -6.2611958,
  },
  {
    name: "Hamburg",
    lat: 53.5566542,
    lng: 9.923953,
  },
  {
    name: "Jakarta",
    lat: -6.2716985,
    lng: 106.8240554,
  },
  {
    name: "Jena",
    lat: 50.9288887,
    lng: 11.5811934,
  },
  {
    name: "Leeds",
    lat: 53.7976424,
    lng: -1.5490637,
  },
  {
    name: "Leipzig",
    lat: 51.3379396,
    lng: 12.3767839,
  },
  {
    name: "London",
    lat: 51.527422,
    lng: -0.0905187,
  },
  {
    name: "Manchester",
    lat: 53.475157,
    lng: -2.2422037,
  },
  {
    name: "Manilla",
    lat: 14.5870188,
    lng: 121.0611884,
  },
  {
    name: "Mar del Plata",
    lat: -38.0123151,
    lng: -57.54827,
  },
  {
    name: "Melbourne",
    lat: -37.8067313,
    lng: 144.9822827,
  },
  {
    name: "Mexico City",
    lat: 19.4409116,
    lng: -99.1948925,
  },
  {
    name: "Mountain View",
    lat: 37.3924311,
    lng: -122.080923,
  },
  {
    name: "Namur",
    lat: 50.4632515,
    lng: 4.8579323,
  },
  {
    name: "New York City",
    lat: 40.740921,
    lng: -73.9948844,
  },
  {
    name: "Newburyport",
    lat: 42.8110165,
    lng: -70.8724886,
  },
  {
    name: "Paris",
    lat: 48.8587253,
    lng: 2.0603055,
  },
  {
    name: "Rotterdam",
    lat: 51.9250012,
    lng: 4.4705578,
  },
  {
    name: "San Diego",
    lat: 32.7141173,
    lng: -117.1524216,
  },
  {
    name: "San Francisco",
    lat: 37.7895452,
    lng: -122.396422,
  },
  {
    name: "Singapore",
    lat: 1.3079579,
    lng: 103.8305533,
  },
  {
    name: "Skopje",
    lat: 41.9957506,
    lng: 21.4269251,
  },
  {
    name: "Split",
    lat: 43.5146086,
    lng: 16.4737782,
  },
  {
    name: "Veenendaal",
    lat: 52.0431539,
    lng: 5.5576162,
  },
  {
    name: "Zagreb",
    lat: 45.7769513,
    lng: 15.9733784,
  },
  {
    name: "Zürich Noerd",
    lat: 47.4134136,
    lng: 8.5313023,
  },
  {
    name: "Zürich Schlotterbeck",
    lat: 47.379672,
    lng: 8.503839,
  },
];
