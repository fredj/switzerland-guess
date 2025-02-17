import "@cesium/engine/Source/Widget/CesiumWidget.css";

import { createCesiumWidget, setRandomPositionInSwitzerland } from "./cesium";
import GameMap from "./openlayers";

import CesiumSphereCamera from "@geoblocks/cesium-sphere-camera";
import "@geoblocks/cesium-compass-bar";
import { Math as CesiumMath, Cartographic } from "@cesium/engine";
import { fromLonLat } from "ol/proj";

import type CesiumCompassBar from "@geoblocks/cesium-compass-bar";

createCesiumWidget("cesium").then((viewer) => {
  const sphereMode = new CesiumSphereCamera(viewer);
  sphereMode.active = true;

  const compassBar = document.querySelector<CesiumCompassBar>("cesium-compass-bar");
  compassBar.scene = viewer.scene;

  const gameMap = new GameMap("map");

  const guessButton = document.querySelector("#guess-button") as HTMLButtonElement;
  const guessCard = document.querySelector("#guess-card") as any;
  const resultDialog = document.querySelector('#result-dialog') as any;

  gameMap.map.on("click", (event) => {
    gameMap.setGuessedPosition(event.coordinate);
    guessButton.disabled = false;
  });

  guessButton.addEventListener("click", () => {
    guessCard.classList.add("hidden");
    gameMap.map.setTarget('result-map');

    const cartographicCameraPosition = Cartographic.fromCartesian(
      viewer.scene.camera.position
    );
    const cameraPosition = [
      CesiumMath.toDegrees(cartographicCameraPosition.longitude),
      CesiumMath.toDegrees(cartographicCameraPosition.latitude),
    ];
    gameMap.showResult(fromLonLat(cameraPosition));
    document.querySelector("#distance").value = gameMap.distance;

    resultDialog.open = true;
  });

  resultDialog.addEventListener('wa-hide', () => {
    setRandomPositionInSwitzerland(viewer);

    gameMap.map.setTarget('map');
    gameMap.reset();

    guessButton.disabled = true;
    guessCard.classList.remove("hidden");
  });

});
