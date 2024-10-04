import {
  Rectangle,
  RequestScheduler,
  CesiumWidget,
  ImageryLayer,
  UrlTemplateImageryProvider,
  CesiumTerrainProvider,
  Cartesian3,
  Math as CesiumMath,
} from "@cesium/engine";

const SWITZERLAND_RECTANGLE = Rectangle.fromDegrees(4, 45, 12, 48);

Object.assign(RequestScheduler.requestsByServer, {
  "wmts.geo.admin.ch:443": 28,
  "3d.geo.admin.ch:443": 28,
});

export async function createCesiumWidget(
  container: HTMLElement | string
): Promise<CesiumWidget> {
  const viewer = new CesiumWidget(container, {
    scene3DOnly: true,
    baseLayer: new ImageryLayer(
      new UrlTemplateImageryProvider({
        url: "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg",
        rectangle: SWITZERLAND_RECTANGLE,
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

  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(7.863775, 46.686447, 1200),
    orientation: {
      heading: CesiumMath.toRadians(25.0),
      pitch: 0.0,
    },
    duration: 0,
  });
  return viewer;
}

// export function randomPositionInSwitzerland(): Cartesian3 {
//   const rectangle = SWITZERLAND_RECTANGLE;
//   const west = CesiumMath.toDegrees(rectangle.west);
//   const south = CesiumMath.toDegrees(rectangle.south);
//   const east = CesiumMath.toDegrees(rectangle.east);
//   const north = CesiumMath.toDegrees(rectangle.north);
//   return Cartesian3.fromDegrees(
//     Math.random() * (east - west) + west,
//     Math.random() * (north - south) + south,
//     4000
//   );
// }
