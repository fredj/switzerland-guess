import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromExtent } from "ol/geom/Polygon";

const EXTENT = [670433, 5744676, 1162476, 6078756];
const CENTER = [915000, 5910000];

function scaleExtent(extent: number[], factor: number): number[] {
  const geom = fromExtent(extent);
  geom.scale(factor);
  return geom.getExtent();
}

export function createOpenLayersMap(container: HTMLElement | string): Map {
  return new Map({
    target: container,
    controls: [],
    view: new View({
      projection: "EPSG:3857",
      extent: scaleExtent(EXTENT, 1.2),
      center: CENTER,
      zoom: 0,
    }),
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg",
          maxZoom: 18,
        }),
      }),
    ],
  });
}
