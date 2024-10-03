/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.121
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
  EllipseOutlineGeometry_default
} from "./chunk-6PJIHPQB.js";
import "./chunk-QGT2GMOK.js";
import "./chunk-BUOFSNFW.js";
import "./chunk-SIZXFNJY.js";
import "./chunk-KKAEXHDY.js";
import "./chunk-6ZREIBKS.js";
import "./chunk-HZPMWR4H.js";
import "./chunk-6FFGOENI.js";
import "./chunk-VSFFJGTA.js";
import {
  Cartesian3_default,
  Ellipsoid_default
} from "./chunk-DJXXI7UF.js";
import "./chunk-HA6TZ3XT.js";
import "./chunk-HFPMX5L2.js";
import "./chunk-T4MB73MC.js";
import "./chunk-HFMJM3SX.js";
import "./chunk-OC4MYPVW.js";
import {
  defined_default
} from "./chunk-2EDC3QGH.js";

// packages/engine/Source/Workers/createEllipseOutlineGeometry.js
function createEllipseOutlineGeometry(ellipseGeometry, offset) {
  if (defined_default(offset)) {
    ellipseGeometry = EllipseOutlineGeometry_default.unpack(ellipseGeometry, offset);
  }
  ellipseGeometry._center = Cartesian3_default.clone(ellipseGeometry._center);
  ellipseGeometry._ellipsoid = Ellipsoid_default.clone(ellipseGeometry._ellipsoid);
  return EllipseOutlineGeometry_default.createGeometry(ellipseGeometry);
}
var createEllipseOutlineGeometry_default = createEllipseOutlineGeometry;
export {
  createEllipseOutlineGeometry_default as default
};
