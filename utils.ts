import bbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { polygon } from "@turf/helpers";
import { randomPosition } from "@turf/random";
import { fromExtent } from "ol/geom/Polygon";

export type CountryCode = "ch" | "fr" | "de";

export function scoreFromDistance(distance: number, country: CountryCode): number {
  // https://www.reddit.com/r/geoguessr/comments/zqwgnr/how_the_hell_does_this_game_calculate_damage/
  // FIXME: depends on the country
  const size = 350000; // approximate max distance in meters
  return 5000 * Math.exp((-10 * distance) / size);
}

export const EXTENT_BY_COUNTRY: { [key in CountryCode]: number[] } = {
  ch: [6.02, 45.77, 10.44, 47.83],
  fr: [-4.8, 42.33, 8.23, 51.09],
  de: [5.87, 47.27, 15.04, 55.06],
};

const POLYGON_BY_COUNTRY: { [key in CountryCode]: any } = {
  ch: polygon([
    [
      [5.9866, 46.1497],
      [6.8217, 46.4276],
      [7.0155, 45.8756],
      [7.8603, 45.9232],
      [8.4084, 46.4542],
      [9.0282, 45.8269],
      [9.3461, 46.4791],
      [10.115, 46.2167],
      [10.455, 46.9649],
      [10.204, 46.8463],
      [9.4773, 47.0406],
      [9.6525, 47.4923],
      [8.7577, 47.7302],
      [7.0441, 47.4657],
      [6.1388, 46.6105],
      [5.9866, 46.1497],
    ],
  ]),
  fr: polygon([
    [
      [2.4703, 51.1765],
      [1.5165, 51.0401],
      [1.1904, 50.1072],
      [0.1007, 49.8599],
      [0.0457, 49.4032],
      [-0.8883, 49.4984],
      [-0.9795, 49.747],
      [-2.06, 49.8297],
      [-1.7395, 48.785],
      [-2.9941, 48.9175],
      [-4.8987, 48.7306],
      [-4.9445, 47.8288],
      [-2.8571, 47.2975],
      [-1.3547, 45.7083],
      [-1.6019, 43.6974],
      [-1.9865, 43.4453],
      [-1.574, 43.0251],
      [1.3374, 42.2709],
      [3.3513, 42.2776],
      [3.2597, 42.9983],
      [4.0472, 43.3989],
      [5.4025, 43.0184],
      [6.4976, 42.9672],
      [7.9454, 43.76],
      [7.2764, 45.1271],
      [7.203, 45.7311],
      [7.0486, 46.4134],
      [6.4261, 46.6024],
      [7.7081, 47.4511],
      [7.9553, 48.4872],
      [8.4224, 48.9765],
      [5.5836, 49.6714],
      [5.0068, 50.1901],
      [4.5215, 50.1901],
      [2.4703, 51.1765],
    ],
  ]),
  de: polygon([
    [
      [8.5727, 55.0195],
      [8.2549, 54.5321],
      [8.4494, 53.8176],
      [7.1256, 53.7454],
      [6.9109, 53.3952],
      [7.1213, 53.2696],
      [6.9772, 52.7148],
      [6.721, 52.7675],
      [6.5655, 52.4898],
      [6.8079, 52.3922],
      [6.6183, 51.967],
      [6.2569, 51.9868],
      [5.8543, 51.8429],
      [6.1351, 51.4145],
      [5.8193, 51.1195],
      [5.8744, 50.7792],
      [6.2608, 50.3989],
      [5.9951, 50.2292],
      [6.2797, 49.6981],
      [6.3556, 49.1238],
      [7.9407, 48.9184],
      [7.6584, 48.6362],
      [7.3736, 47.4814],
      [8.4938, 47.5071],
      [9.1999, 47.5667],
      [10.2069, 47.1355],
      [10.6431, 47.4382],
      [11.1365, 47.2904],
      [12.4558, 47.5537],
      [13.1296, 47.4061],
      [13.1296, 48.0964],
      [13.8391, 48.4042],
      [14.0434, 48.7952],
      [12.6459, 49.7212],
      [12.5089, 50.1518],
      [14.1643, 50.7745],
      [14.7126, 50.7133],
      [15.2071, 50.9713],
      [14.8958, 52.5076],
      [14.3476, 52.8854],
      [14.6378, 53.0925],
      [14.3906, 53.9983],
      [12.7673, 54.6005],
      [11.2946, 54.1371],
      [11.3806, 54.5507],
      [10.8326, 54.488],
      [10.2868, 54.5029],
      [10.1077, 54.8087],
      [8.5727, 55.0195],
    ],
  ]),
};

export function randomPositionInCountry(country: CountryCode): [number, number] {
  let position = randomPosition(bbox(POLYGON_BY_COUNTRY[country]));
  while (true) {
    if (booleanPointInPolygon(position, POLYGON_BY_COUNTRY[country])) {
      return position as [number, number];
    }
    position = randomPosition(bbox(POLYGON_BY_COUNTRY[country]));
  }
}

export function scaleExtent(extent: number[], factor: number): number[] {
  const geom = fromExtent(extent);
  geom.scale(factor);
  return geom.getExtent();
}
