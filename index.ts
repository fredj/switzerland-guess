import { createCesiumWidget } from "./cesium";
import CesiumSphereCamera from "@geoblocks/cesium-sphere-camera";

import "@cesium/engine/Source/Widget/CesiumWidget.css";

createCesiumWidget("cesiumContainer").then((viewer) => {
  const sphereMode = new CesiumSphereCamera(viewer);
  sphereMode.active = true;
});
