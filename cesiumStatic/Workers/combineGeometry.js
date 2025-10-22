/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.134.1
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
  PrimitivePipeline_default
} from "./chunk-3YNW5K6O.js";
import {
  createTaskProcessorWorker_default
} from "./chunk-TGJQMEL4.js";
import "./chunk-KEPPNSBL.js";
import "./chunk-MXOGBWMP.js";
import "./chunk-PZUZCAX3.js";
import "./chunk-RR3NCT4R.js";
import "./chunk-W6KMV4F5.js";
import "./chunk-PJAA7QSC.js";
import "./chunk-KVB73ECP.js";
import "./chunk-DTKSVIH5.js";
import "./chunk-2QPH5QDK.js";
import "./chunk-ASVODZNK.js";
import "./chunk-UKA7OISV.js";
import "./chunk-UFSYRVC5.js";
import "./chunk-LV3G32QE.js";
import "./chunk-LU7DLY2L.js";
import "./chunk-XJVRYJVZ.js";
import "./chunk-FE565QHX.js";
import "./chunk-DBHL2UVG.js";
import "./chunk-3RKX3UFI.js";

// packages/engine/Source/Workers/combineGeometry.js
function combineGeometry(packedParameters, transferableObjects) {
  const parameters = PrimitivePipeline_default.unpackCombineGeometryParameters(packedParameters);
  const results = PrimitivePipeline_default.combineGeometry(parameters);
  return PrimitivePipeline_default.packCombineGeometryResults(
    results,
    transferableObjects
  );
}
var combineGeometry_default = createTaskProcessorWorker_default(combineGeometry);
export {
  combineGeometry_default as default
};
