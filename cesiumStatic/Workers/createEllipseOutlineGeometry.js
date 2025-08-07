/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.132
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
} from "./chunk-SXMHGVZ7.js";
import "./chunk-C36VNKTH.js";
import "./chunk-NKM2EV46.js";
import "./chunk-AZPKFL5X.js";
import "./chunk-ETCPCGKC.js";
import "./chunk-DNCRKMCI.js";
import "./chunk-GO3IRH6U.js";
import "./chunk-WUMTX3FI.js";
import "./chunk-FQNSMOZT.js";
import {
  Cartesian3_default,
  Ellipsoid_default
} from "./chunk-E6NMEKSS.js";
import "./chunk-Y3PM6G2V.js";
import "./chunk-DXYAD4ED.js";
import "./chunk-Q2QXUN33.js";
import "./chunk-SOYVF5RC.js";
import {
  defined_default
} from "./chunk-EV4PBU7O.js";

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
