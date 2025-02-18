import {
  Rectangle,
  RequestScheduler,
  CesiumWidget,
  ImageryLayer,
  UrlTemplateImageryProvider,
  CesiumTerrainProvider,
  Cartesian3,
  Math as CesiumMath,
  Ion,
} from "@cesium/engine";

import { randomPosition } from "@turf/random";
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { polygon } from "@turf/helpers";
import bbox from "@turf/bbox";

Object.assign(RequestScheduler.requestsByServer, {
  "wmts.geo.admin.ch:443": 28,
  "3d.geo.admin.ch:443": 28,
});

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NDYzNDViMS01OGZjLTRkMDMtOWQzYi00YTI2NDBmOWNjYzYiLCJpZCI6MjE3NTQsImlhdCI6MTcyODMwMTczM30.JlQVQBkpUc1LW65CyWbH_2ZLz-3u6WDkjR9nBI25VYI";

export async function createCesiumWidget(
  container: HTMLElement | string
): Promise<CesiumWidget> {
  const viewer = new CesiumWidget(container, {
    scene3DOnly: true,
    requestRenderMode: true,
    baseLayer: new ImageryLayer(
      new UrlTemplateImageryProvider({
        url: "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg",
        rectangle: Rectangle.fromDegrees(5.140242, 45.398181, 11.47757, 48.230651),
      })
    ),
    terrainProvider: await CesiumTerrainProvider.fromIonAssetId(1),
  });

  viewer.scene.highDynamicRange = true;
  viewer.scene.globe.showGroundAtmosphere = true;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.globe.preloadSiblings = true;

  viewer.scene.fog.density = 2.0e-4 * 2;
  viewer.scene.fog.minimumBrightness = 0.03 * 10;

  setRandomPositionInSwitzerland(viewer);

  return viewer;
}

const SWITZERLAND_POLYGON = polygon([
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
]);

export function setRandomPositionInSwitzerland(viewer: CesiumWidget): void {
  viewer.camera.flyTo({
    destination: randomPositionInSwitzerland(),
    orientation: {
      heading: CesiumMath.toRadians(Math.random() * 360),
      pitch: 0.0,
    },
    duration: 0,
  });
}

// FIXME: don't use fixed altitude
function randomPositionInSwitzerland(): Cartesian3 {
  let position = randomPosition(bbox(SWITZERLAND_POLYGON));
  while (true) {
    if (booleanPointInPolygon(position, SWITZERLAND_POLYGON)) {
      return Cartesian3.fromDegrees(position[0], position[1], 4000);
    }
    position = randomPosition(bbox(SWITZERLAND_POLYGON));
  }
}
