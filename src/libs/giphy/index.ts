import { GiphyFetch } from "@giphy/js-fetch-api";

const GiphyApi = new GiphyFetch(process.env.EXPO_PUBLIC_GIPHY || "");

export default GiphyApi;
