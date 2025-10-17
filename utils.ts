import bbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { multiPolygon, point } from "@turf/helpers";
import { randomPosition } from "@turf/random";
import { distance as distanceBetweenPoints } from "@turf/distance";
import { fromExtent } from "ol/geom/Polygon";

import countries from "./data/countries.json" with { type: "json" };

export const countriesGeometry: { [key in CountryCode]: any } = {
  ch: multiPolygon(countries.features.find((f: any) => f.properties.code === "ch").geometry.coordinates),
  fr: multiPolygon(countries.features.find((f: any) => f.properties.code === "fr").geometry.coordinates),
  de: multiPolygon(countries.features.find((f: any) => f.properties.code === "de").geometry.coordinates),
};

export const countriesExtent: { [key in CountryCode]: number[] } = {
  ch: bbox(countriesGeometry["ch"]),
  fr: bbox(countriesGeometry["fr"]),
  de: bbox(countriesGeometry["de"]),
};

// export const countriesMaxDistance: { [key in CountryCode]: number } = {
//   ch: maxDistance(countriesGeometry["ch"]),  // 355620.06424896297
//   fr: maxDistance(countriesGeometry["fr"]),  // 1079440.1997255683
//   de: maxDistance(countriesGeometry["de"]),  // 879452.6028816501
// };
// Precomputed for performance
export const countriesMaxDistance: { [key in CountryCode]: number } = {
  ch: 355620,
  fr: 1079440,
  de: 879452,
};

export type CountryCode = "ch" | "fr" | "de";

export function scoreFromDistance(distance: number, country: CountryCode): number {
  // https://www.reddit.com/r/geoguessr/comments/zqwgnr/how_the_hell_does_this_game_calculate_damage/
  const size = countriesMaxDistance[country]; // approximate max distance in meters
  return 5000 * Math.exp((-10 * distance) / size);
}

export function randomPositionInCountry(country: CountryCode): [number, number] {
  const polygon = countriesGeometry[country];
  let position = randomPosition(bbox(polygon));
  while (true) {
    if (booleanPointInPolygon(position, polygon)) {
      return position as [number, number];
    }
    position = randomPosition(bbox(polygon));
  }
}

export function scaleExtent(extent: number[], factor: number): number[] {
  const geom = fromExtent(extent);
  geom.scale(factor);
  return geom.getExtent();
}

function maxDistance(geometry: any): number {
  let max = 0;
  // geometry is a multipolygon and the first polygon is the biggest
  const coords = geometry.geometry.coordinates[0][0];
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const distance = distanceBetweenPoints(point(coords[i]), point(coords[j]), { units: "meters" });
      if (distance > max) {
        max = distance;
      }
    }
  }
  return max;
}
