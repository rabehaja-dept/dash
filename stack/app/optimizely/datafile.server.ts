import { getEnv } from "~/config";
import fetch from "node-fetch";

let datafile: string | object | undefined;

const fetchDatafile = async () => {
  const SDK_KEY = getEnv("OPTIMIZELY_SDK_KEY");
  if (!SDK_KEY) {
    console.info("[Optimizely] Optimizely SDK key has not been set.");
    return {};
  }

  const response: any = await fetch(
    `https://cdn.optimizely.com/datafiles/${SDK_KEY}.json`
  );

  if (response.ok) {
    datafile = await response.json();
  }

  if (!datafile) {
    return {};
  }

  return datafile;
};

/**
 * @returns {Promise<Object>}
 */
export const getDatafile = async () => {
  if (datafile) {
    fetchDatafile();
    return datafile;
  }

  return fetchDatafile();
};
