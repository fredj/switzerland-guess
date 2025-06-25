import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Feature from "ol/Feature";

import { fromExtent } from "ol/geom/Polygon";
import { getDistance } from "ol/sphere";
import { toLonLat } from "ol/proj";

const EXTENT = [670433, 5744676, 1162476, 6078756];
const CENTER = [915000, 5910000];

function scaleExtent(extent: number[], factor: number): number[] {
  const geom = fromExtent(extent);
  geom.scale(factor);
  return geom.getExtent();
}

const style = [
  {
    filter: ["==", ["get", "type"], "click"],
    style: {
      "circle-radius": 8,
      "circle-fill-color": "#fff",
      "circle-stroke-color": "#f00",
      "circle-stroke-width": 3,
    },
  },
  {
    filter: ["==", ["get", "type"], "camera"],
    style: {
      "circle-radius": 8,
      "circle-fill-color": "#fff",
      "circle-stroke-color": "#000",
      "circle-stroke-width": 3,
    },
  },
  {
    filter: ["==", ["get", "type"], "line"],
    style: {
      "stroke-width": 6,
      "stroke-color": "#000",
      "stroke-line-dash": [6, 12],
    },
  },
];

export default class GameMap {
  public map: Map;
  private clickFeature = new Feature({
    type: "click",
  });
  private cameraFeature = new Feature({
    type: "camera",
  });
  private lineFeature = new Feature({
    type: "line",
  });

  constructor(container: HTMLElement | string) {
    this.map = new Map({
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
        new VectorLayer({
          source: new VectorSource({
            features: [this.clickFeature, this.cameraFeature, this.lineFeature],
          }),
          style: style,
        })
      ],
    });
  }

  get distance(): number {
    const clickPosition = this.clickFeature.getGeometry()?.getCoordinates();
    const cameraPosition = this.cameraFeature.getGeometry()?.getCoordinates();

    return getDistance(
      toLonLat(clickPosition),
      toLonLat(cameraPosition)
    );
  }

  get score(): number {
    // https://www.reddit.com/r/geoguessr/comments/zqwgnr/how_the_hell_does_this_game_calculate_damage/
    const size = 350000; // approximate max distance in meters
    return 5000 * Math.exp(-10 * this.distance / size);
  }

  public setGuessedPosition(guess: number[]): void {
    this.clickFeature.setGeometry(new Point(guess));
  }

  public showResult(camera: number[]): void {
    this.cameraFeature.setGeometry(new Point(camera));
    this.lineFeature.setGeometry(
      new LineString([
        this.clickFeature.getGeometry().getCoordinates(),
        this.cameraFeature.getGeometry().getCoordinates()
      ])
    );
    this.map.getView().fit(this.lineFeature.getGeometry().getExtent());

    // Prevent interactions
  }

  public reset(): void {
    this.clickFeature.setGeometry(undefined);
    this.cameraFeature.setGeometry(undefined);
    this.lineFeature.setGeometry(undefined);

    this.map.getView().setCenter(CENTER);
    this.map.getView().setZoom(0);
  }
}
