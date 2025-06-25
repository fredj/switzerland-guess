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
  FrustumGeometry_default
} from "./chunk-AGEQBE2G.js";
import "./chunk-AJWIQQTX.js";
import "./chunk-PMNYUVMK.js";
import "./chunk-PHIB2ITA.js";
import "./chunk-MPNN7PNO.js";
import "./chunk-EG3P66JO.js";
import "./chunk-UGKOGDMZ.js";
import "./chunk-PLM7GGHT.js";
import "./chunk-Z43MDFLH.js";
import "./chunk-FPJWHB5J.js";
import "./chunk-7252BLXK.js";
import "./chunk-3JKMJ2DT.js";
import "./chunk-5N52XJIS.js";
import {
  defined_default
} from "./chunk-UOU6BW5C.js";

// packages/engine/Source/Workers/createFrustumGeometry.js
function createFrustumGeometry(frustumGeometry, offset) {
  if (defined_default(offset)) {
    frustumGeometry = FrustumGeometry_default.unpack(frustumGeometry, offset);
  }
  return FrustumGeometry_default.createGeometry(frustumGeometry);
}
var createFrustumGeometry_default = createFrustumGeometry;
export {
  createFrustumGeometry_default as default
};
