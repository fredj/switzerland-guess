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

import { type Coordinate } from "ol/coordinate";

Object.assign(RequestScheduler.requestsByServer, {
  "assets.ion.cesium.com:443": 28,
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

  viewer.scene.fog.density = 0.005;
  viewer.scene.fog.minimumBrightness = 0.3;

  return viewer;
}

export function setCameraPosition(viewer: CesiumWidget, position: Coordinate): void {
  // FIXME: don't use fixed altitude
  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(position[0], position[1], 4000),
    orientation: {
      heading: CesiumMath.toRadians(Math.random() * 360),
      pitch: 0.0,
    },
  });
}
