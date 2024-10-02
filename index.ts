import "@cesium/engine/Source/Widget/CesiumWidget.css";

import { createCesiumWidget } from "./cesium";
import { createOpenLayersMap } from "./openlayers";

import CesiumSphereCamera from "@geoblocks/cesium-sphere-camera";
import "@geoblocks/cesium-compass-bar";
import { Math as CesiumMath, Cartographic } from "@cesium/engine";
import { toLonLat } from "ol/proj";
import { getDistance } from "ol/sphere";

createCesiumWidget("cesium").then((viewer) => {
  const sphereMode = new CesiumSphereCamera(viewer);
  sphereMode.active = true;

  const compassBar = document.querySelector("cesium-compass-bar");
  compassBar.scene = viewer.scene;

  const map = createOpenLayersMap("openlayers");

  map.on("click", (event) => {
    const cartographicCameraPosition = Cartographic.fromCartesian(
      viewer.scene.camera.position
    );
    const cameraPosition = [
      CesiumMath.toDegrees(cartographicCameraPosition.longitude),
      CesiumMath.toDegrees(cartographicCameraPosition.latitude),
    ];
    const clickPosition = toLonLat(event.coordinate);

    const distance = getDistance(cameraPosition, clickPosition);

    console.log(`Distance: ${Math.round(distance)}[m]`);
  });
});
