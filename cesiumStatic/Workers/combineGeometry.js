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
  PrimitivePipeline_default
} from "./chunk-UPU755HO.js";
import {
  createTaskProcessorWorker_default
} from "./chunk-DPFAUGBE.js";
import "./chunk-4NRFVAG2.js";
import "./chunk-4QWLEG4L.js";
import "./chunk-K5VGMGFM.js";
import "./chunk-GVO3YIU2.js";
import "./chunk-25USKS4R.js";
import "./chunk-RZJA77TX.js";
import "./chunk-AZPKFL5X.js";
import "./chunk-ETCPCGKC.js";
import "./chunk-DNCRKMCI.js";
import "./chunk-GO3IRH6U.js";
import "./chunk-WUMTX3FI.js";
import "./chunk-FQNSMOZT.js";
import "./chunk-E6NMEKSS.js";
import "./chunk-Y3PM6G2V.js";
import "./chunk-DXYAD4ED.js";
import "./chunk-Q2QXUN33.js";
import "./chunk-SOYVF5RC.js";
import "./chunk-EV4PBU7O.js";

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
