export interface GeoCoords {
  lat: number;
  lon: number;
  zip?: string;
  name?: string;
  country?: string;
}

export type GeoApiErrorBody = {
  cod?: string | number;
  message?: string;
};

export type GeocodingResult =
  | { response: GeoCoords; error?: undefined }
  | { error: GeoApiErrorBody; response?: undefined };

export function getData(): Promise<GeocodingResult>;
