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
  BoxGeometry_default
} from "./chunk-LOZ4NKY3.js";
import "./chunk-5S5OOA6U.js";
import "./chunk-4CHMVQTQ.js";
import "./chunk-TY4DKOWR.js";
import "./chunk-HUFQVUMY.js";
import "./chunk-FYGLNDKG.js";
import "./chunk-WEHZP4SE.js";
import "./chunk-KSYBJA4M.js";
import "./chunk-KM6MITPF.js";
import "./chunk-F4CUH4MR.js";
import "./chunk-ED6GLQTK.js";
import "./chunk-5KWRW7YL.js";
import "./chunk-TVL3F7IU.js";
import "./chunk-OMXHEJTK.js";
import {
  defined_default
} from "./chunk-KHWLAQVA.js";

// packages/engine/Source/Workers/createBoxGeometry.js
function createBoxGeometry(boxGeometry, offset) {
  if (defined_default(offset)) {
    boxGeometry = BoxGeometry_default.unpack(boxGeometry, offset);
  }
  return BoxGeometry_default.createGeometry(boxGeometry);
}
var createBoxGeometry_default = createBoxGeometry;
export {
  createBoxGeometry_default as default
};
