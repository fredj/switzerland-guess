/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.126
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  EllipseGeometry_default
} from "./chunk-XK4OP6VA.js";
import "./chunk-3PIZQT3I.js";
import "./chunk-Q4ZVWJXX.js";
import "./chunk-YJX7X577.js";
import "./chunk-JHBPC4LK.js";
import "./chunk-HKHQ3EDR.js";
import "./chunk-5S5OOA6U.js";
import "./chunk-4CHMVQTQ.js";
import "./chunk-EWDGNOJE.js";
import "./chunk-LJBJM6VI.js";
import "./chunk-D7ZBZPHV.js";
import "./chunk-TY4DKOWR.js";
import "./chunk-HUFQVUMY.js";
import "./chunk-FYGLNDKG.js";
import "./chunk-WEHZP4SE.js";
import "./chunk-KSYBJA4M.js";
import {
  Cartesian3_default,
  Ellipsoid_default
} from "./chunk-KM6MITPF.js";
import "./chunk-F4CUH4MR.js";
import "./chunk-ED6GLQTK.js";
import "./chunk-5KWRW7YL.js";
import "./chunk-TVL3F7IU.js";
import "./chunk-OMXHEJTK.js";
import {
  defined_default
} from "./chunk-KHWLAQVA.js";

// packages/engine/Source/Workers/createEllipseGeometry.js
function createEllipseGeometry(ellipseGeometry, offset) {
  if (defined_default(offset)) {
    ellipseGeometry = EllipseGeometry_default.unpack(ellipseGeometry, offset);
  }
  ellipseGeometry._center = Cartesian3_default.clone(ellipseGeometry._center);
  ellipseGeometry._ellipsoid = Ellipsoid_default.clone(ellipseGeometry._ellipsoid);
  return EllipseGeometry_default.createGeometry(ellipseGeometry);
}
var createEllipseGeometry_default = createEllipseGeometry;
export {
  createEllipseGeometry_default as default
};
