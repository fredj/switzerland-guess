import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { ref, createRef } from "lit/directives/ref.js";
import type { Ref } from "lit/directives/ref.js";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import Feature from "ol/Feature";
import { useGeographic } from "ol/proj.js";
import { OSM } from "ol/source";
import { consume } from "@lit/context";
import { GameState, gameStateContext } from "../game-state";
import { EXTENT_BY_COUNTRY, scaleExtent } from "../utils";
import { getCenter } from "ol/extent";

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

  private map: Map;
  private mapElement: Ref<HTMLDivElement> = createRef();

  private guessedFeature = new Feature({
    type: "guessed",
  });
  private cameraFeature = new Feature({
    type: "camera",
  });
  private lineFeature = new Feature({
    type: "line",
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
  `;

  shouldUpdate() {
    return this.gameState.country !== null;
  }

  willUpdate() {
    if (this.gameState.cameraPosition && this.gameState.guessedPosition) {
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
      // FIXME: fit view
    } else {
      this.guessedFeature.setGeometry(undefined);
      this.cameraFeature.setGeometry(undefined);
      this.lineFeature.setGeometry(undefined);

      // FIXME: reset view to country extent
    }
  }

  constructor() {
    super();
    this.map = new Map({
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

    this.map.on("click", (event) => {
      this.guessedFeature.setGeometry(new Point(event.coordinate));
      this.dispatchEvent(
        new CustomEvent("map-click", { detail: event.coordinate })
      );
    });
  }

  render() {
    return html` <div class="map" ${ref(this.mapElement)}></div> `;
  }

  firstUpdated() {
    this.map.setTarget(this.mapElement.value);

    const extent = EXTENT_BY_COUNTRY[this.gameState.country!];
    this.map.setView(
      new View({
        extent: scaleExtent(extent, 1.2),
        center: getCenter(extent),
        zoom: 4,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "element-map": ElementMap;
  }
}
