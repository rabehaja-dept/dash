## GeoLocation

### Google Maps API

We've integrated with Google Maps using the `google-map-react` plugin (docs [here](https://github.com/google-map-react/google-map-react)).

With DEPT DASH™, you'll get our Google Maps API key in the config file. You may only use this in your development environment -- **it will not work in production**. If you want to use Google Maps in production, you'll need to create your own API key. You can find instructions on how to do that [here](https://developers.google.com/maps/documentation/javascript/get-api-key).

Once you have a key in hand, add it to the `~/config.ts` file.

### Geolocation API

The Geolocation API is a simple way to get the user's location. It's supported by all modern browsers and it's very easy to use.

Use the `useGeoLocation()` hook in `hooks/useGeoLocation.ts` to get the user's location.

```tsx
import { useGeoLocation } from "~/hooks/useGeoLocation";

const { latitude, longitude, loading, error } = useGeoLocation();

// do stuff
```
