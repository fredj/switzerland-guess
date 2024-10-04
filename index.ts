import "@cesium/engine/Source/Widget/CesiumWidget.css";

import { createCesiumWidget } from "./cesium";
import { createOpenLayersMap } from "./openlayers";

import CesiumSphereCamera from "@geoblocks/cesium-sphere-camera";
import "@geoblocks/cesium-compass-bar";
import { Math as CesiumMath, Cartographic } from "@cesium/engine";
import { fromLonLat, toLonLat } from "ol/proj";
import { getDistance } from "ol/sphere";
import Feature from "ol/Feature";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import { LineString } from "ol/geom";

import type CesiumCompassBar from "@geoblocks/cesium-compass-bar";

createCesiumWidget("cesium").then((viewer) => {
  const sphereMode = new CesiumSphereCamera(viewer);
  sphereMode.active = true;

  const compassBar = document.querySelector<CesiumCompassBar>("cesium-compass-bar");
  compassBar.scene = viewer.scene;

  const map = createOpenLayersMap("openlayers");
  const clickFeature = new Feature({
    type: "click",
  });
  const cameraFeature = new Feature({
    type: "camera",
  });
  const lineFeature = new Feature({
    type: "line",
  });

  map.addLayer(
    new VectorLayer({
      source: new VectorSource({
        features: [clickFeature, cameraFeature, lineFeature],
      }),
      style: [
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
      ],
    })
  );

  map.on("click", (event) => {
    const clickGeometry = new Point(event.coordinate);
    clickFeature.setGeometry(clickGeometry);

    const cartographicCameraPosition = Cartographic.fromCartesian(
      viewer.scene.camera.position
    );
    const cameraPosition = [
      CesiumMath.toDegrees(cartographicCameraPosition.longitude),
      CesiumMath.toDegrees(cartographicCameraPosition.latitude),
    ];
    const cameraGeometry = new Point(fromLonLat(cameraPosition));
    cameraFeature.setGeometry(cameraGeometry);
    lineFeature.setGeometry(
      new LineString([
        clickGeometry.getCoordinates(),
        cameraGeometry.getCoordinates(),
      ])
    );

    const clickPosition = toLonLat(event.coordinate);
    const distance = getDistance(cameraPosition, clickPosition);
    console.log(`Distance: ${Math.round(distance)}[m]`);
  });
});
