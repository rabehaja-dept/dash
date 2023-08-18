import json from "country-region-data/data.json";

interface Region {
  name: string;
  shortCode: string;
}

export interface Country {
  countryName: string;
  countryShortCode: string;
  regions: Region[];
}

type CountriesData = {
  allCountries: { label: string; value: string }[];
  allCountriesWithRegions: Country[];
  getCountryRegions: (countryName: {
    label: string;
    value: string;
  }) => { label: string; value: string }[] | undefined;
};

/**
 * Returns all countries including the regions / province for each country
 */
const allCountriesWithRegions: Country[] = json as Country[];

/**
 * This returns all the countries in the format of {label: "Country name", value: "Country code"}
 */
const allCountries: { label: string; value: string }[] = (() => {
  const allCountriesWithRegions: Country[] = json as Country[];
  return allCountriesWithRegions.map((country: Country) => {
    return {
      label: country.countryName,
      value: country.countryShortCode,
    };
  });
})();

const getCountryRegions = (countryName: { label: string; value: string }) => {
  const country = allCountriesWithRegions.find(
    (country) => country.countryShortCode === countryName.value
  );
  return country?.regions.map((region) => {
    return {
      label: region.name,
      value: region.shortCode,
    };
  });
};

export function useCountries(): CountriesData {
  return {
    allCountries: allCountries,
    allCountriesWithRegions: allCountriesWithRegions,
    getCountryRegions: getCountryRegions,
  };
}
