import {
  RequestScheduler,
  CesiumWidget,
  CesiumTerrainProvider,
  Cartesian3,
  Math as CesiumMath,
  Ion,
  ImageryLayer,
  IonImageryProvider, Scene, Cartesian2, Color, SphereEmitter, Matrix4, ParticleSystem, Particle, Primitive,
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
    // skyBox: false,
    requestRenderMode: true,
    // see https://sandcastle.cesium.com/?id=imagery-assets-available-from-ion
    baseLayer: ImageryLayer.fromProviderAsync(
      IonImageryProvider.fromAssetId(3830182)
    ),
    // Swissimage:
    // baseLayer: new ImageryLayer(
    //   new UrlTemplateImageryProvider({
    //     url: "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg",
    //     rectangle: Rectangle.fromDegrees(5.140242, 45.398181, 11.47757, 48.230651),
    //   })
    // ),
    terrainProvider: await CesiumTerrainProvider.fromIonAssetId(1),
    shouldAnimate: true
  });

  // viewer.scene.highDynamicRange = true;
  viewer.scene.globe.showGroundAtmosphere = true;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.globe.preloadSiblings = true;
  viewer.scene.globe.maximumScreenSpaceError = 1 // lower value - better quality

  // for winter
  viewer.scene.skyAtmosphere!.hueShift = 0;
  viewer.scene.skyAtmosphere!.saturationShift = -0.3;
  viewer.scene.skyAtmosphere!.brightnessShift = -0.15;
  // viewer.scene.fog.density = 0.001;
  // viewer.scene.fog.minimumBrightness = 0.8;

  // viewer.scene.fog.density = 0.005;
  // viewer.scene.fog.minimumBrightness = 0.3;


  const controller = viewer.scene.screenSpaceCameraController;
  controller.enableTranslate = false;
  controller.enableZoom = false;
  controller.enableTilt = false;
  controller.enableRotate = false;

  return viewer;
}

export function setCameraPosition(viewer: CesiumWidget, position: Coordinate): void {
  // FIXME: don't use fixed altitude
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(position[0], position[1], 4000),
    orientation: {
      heading: CesiumMath.toRadians(Math.random() * 360),
      pitch: 0.0,
    },
    complete: () => {
      addSnow(viewer.scene)
    }
  });

}

let snow: Primitive | undefined = undefined;
// snow
const snowParticleSize = 12.0;
const snowRadius = 100000.0;
const minimumSnowImageSize = new Cartesian2(
    snowParticleSize,
    snowParticleSize,
);
const maximumSnowImageSize = new Cartesian2(
    snowParticleSize * 2.0,
    snowParticleSize * 2.0,
);
let snowGravityScratch = new Cartesian3();
const snowUpdate = (scene: Scene, particle: Particle) => {
  snowGravityScratch = Cartesian3.normalize(
      particle.position,
      snowGravityScratch,
  );
  Cartesian3.multiplyByScalar(
      snowGravityScratch,
      CesiumMath.randomBetween(-30.0, -300.0),
      snowGravityScratch,
  );
  particle.velocity = Cartesian3.add(
      particle.velocity,
      snowGravityScratch,
      particle.velocity,
  );
  const distance = Cartesian3.distance(
      scene.camera.position,
      particle.position,
  );
  if (distance > snowRadius) {
    particle.endColor.alpha = 0.0;
  } else {
    particle.endColor.alpha = 1.0 / (distance / snowRadius + 0.1);
  }
};
function addSnow(scene: Scene) {
  if (snow) {
    scene.primitives.remove(snow);
  }

  snow = scene.primitives.add(
      new ParticleSystem({
        modelMatrix: Matrix4.fromTranslation(scene.camera.position),
        minimumSpeed: 5000,
        maximumSpeed: 25000, // bigger value - slower falling
        lifetime: 60.0,
        particleLife: 10,
        emitter: new SphereEmitter(snowRadius),
        startScale: 0.2,
        endScale: 0.7,
        image: "./images/snowflake.png",
        emissionRate: 3000.0,
        startColor: Color.WHITE.withAlpha(0.0),
        endColor: Color.WHITE.withAlpha(1.0),
        minimumImageSize: minimumSnowImageSize,
        maximumImageSize: maximumSnowImageSize,
        mass: 2.9e-6,
        updateCallback: (particle: Particle) => snowUpdate(scene, particle),
      }),
  );
}
