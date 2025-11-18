import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Feature from "ol/Feature";
import { useGeographic } from "ol/proj.js";
import GeoJSON from "ol/format/GeoJSON";
import OSM from "ol/source/OSM";
import { consume } from "@lit/context";
import { gameStateContext } from "../game-state";
import { countriesExtent, countriesGeometry, scaleExtent } from "../utils";
import { getCenter } from "ol/extent";
import {defaults as defaultsInteractions} from "ol/interaction/defaults";

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { hasArea } from "ol/size";
import type { GameState } from "../game-state";
import type RenderEvent from "ol/render/Event";

useGeographic();

const style = [
  {
    filter: ["==", ["get", "type"], "guessed"],
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

@customElement("element-map")
export default class ElementMap extends LitElement {
  @consume({ context: gameStateContext, subscribe: true })
  gameState!: GameState;

  @property({ attribute: 'show-result', type: Boolean }) showResult = false;

  private map: Map;
  @query(".map") mapElement!: HTMLDivElement

  private guessedFeature = new Feature({
    type: "guessed",
  });
  private cameraFeature = new Feature({
    type: "camera",
  });
  private lineFeature = new Feature({
    type: "line",
  });

  private maskSource = new VectorSource({
    features: [],
  });

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .map {
      width: 100%;
      height: 100%;
      cursor: crosshair;
    }
    .ol-layer.mask {
      filter: blur(5px);
      opacity: 0.5;
    }
  `;

  shouldUpdate() {
    return this.gameState.country !== null;
  }

  async updated() {
    if (this.showResult && this.gameState.cameraPosition && this.gameState.guessedPosition) {
      this.guessedFeature.setGeometry(
        new Point(this.gameState.guessedPosition)
      );
      this.cameraFeature.setGeometry(new Point(this.gameState.cameraPosition));
      this.lineFeature.setGeometry(
        new LineString([
          this.gameState.cameraPosition,
          this.gameState.guessedPosition,
        ])
      );
      await this.mapHasSize();
      this.map.getView().fit(this.lineFeature.getGeometry(), {
        padding: [40, 40, 40, 40],
      });
    } else {
      this.guessedFeature.setGeometry(undefined);
      this.cameraFeature.setGeometry(undefined);
      this.lineFeature.setGeometry(undefined);

      await this.mapHasSize();
      this.map.getView().fit(this.getCountryExtent());
    }

    if (this.gameState.country !== null) {
      // FIXME: avoid recreating the feature on each update
      const country = countriesGeometry[this.gameState.country];
      this.maskSource.clear();
      const format = new GeoJSON();
      this.maskSource.addFeature(format.readFeature(country));
    }
  }

  constructor() {
    super();
    this.map = new Map({
      interactions: defaultsInteractions({
        altShiftDragRotate: false,
        pinchRotate: false,
      }),
      controls: [],
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [
              this.guessedFeature,
              this.cameraFeature,
              this.lineFeature,
            ],
          }),
          style: style,
        }),
      ],
    });

    const mask = new VectorLayer({
      style: {
        "fill-color": "rgba(0, 0, 0, 1.0)",
      },
      className: "ol-layer mask",
      updateWhileInteracting: true,
      source: this.maskSource,
    });

    mask.on("prerender", maskOut);
    this.map.addLayer(mask);

    this.map.on("click", (event) => {
      const country = countriesGeometry[this.gameState.country];
      if (booleanPointInPolygon(event.coordinate, country) === false) {
        return;
      }
      this.guessedFeature.setGeometry(new Point(event.coordinate));
      this.dispatchEvent(
        new CustomEvent("map-click", { detail: event.coordinate })
      );
    });
  }

  render() {
    return html`<div class="map"></div>`;
  }

  firstUpdated() {
    this.map.setTarget(this.mapElement);

    const extent = this.getCountryExtent();
    this.map.setView(
      new View({
        extent: extent,
        center: getCenter(extent),
        zoom: 4,
      })
    );
  }

  getCountryExtent() {
    return scaleExtent(countriesExtent[this.gameState.country], 1.5);
  }

  mapHasSize(): Promise<void> {
    return new Promise((resolve) => {
      if (hasArea(this.map.getSize())) {
        resolve();
        return;
      }
      this.map.once("change:size", () => {
        if (hasArea(this.map.getSize())) {
          resolve();
        }
      });
    });
  }
}

function maskOut(event: RenderEvent) {
  const context = event.context as CanvasRenderingContext2D;
  context.globalCompositeOperation = "copy";
  context.fillStyle = "rgba(0, 0, 0, 1.0)";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.globalCompositeOperation = "destination-out";
}

declare global {
  interface HTMLElementTagNameMap {
    "element-map": ElementMap;
  }
}
