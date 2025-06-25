/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.130.1
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
} from "./chunk-EJGJUZST.js";
import "./chunk-K65RSNI5.js";
import "./chunk-MV5UVSOZ.js";
import "./chunk-VKMJSSOD.js";
import "./chunk-PHIB2ITA.js";
import "./chunk-MPNN7PNO.js";
import "./chunk-EG3P66JO.js";
import "./chunk-UGKOGDMZ.js";
import "./chunk-PLM7GGHT.js";
import {
  Cartesian3_default,
  Ellipsoid_default
} from "./chunk-Z43MDFLH.js";
import "./chunk-FPJWHB5J.js";
import "./chunk-7252BLXK.js";
import "./chunk-3JKMJ2DT.js";
import "./chunk-5N52XJIS.js";
import {
  defined_default
} from "./chunk-UOU6BW5C.js";

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
