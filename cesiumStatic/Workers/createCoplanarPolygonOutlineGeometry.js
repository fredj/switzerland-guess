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
  CoplanarPolygonGeometryLibrary_default
} from "./chunk-T7C73J6H.js";
import "./chunk-HHHBRTSW.js";
import {
  PolygonGeometryLibrary_default
} from "./chunk-ECWQXDZY.js";
import "./chunk-5YCDPN3O.js";
import {
  GeometryInstance_default
} from "./chunk-PAH73ETP.js";
import {
  GeometryPipeline_default
} from "./chunk-4QWLEG4L.js";
import "./chunk-K5VGMGFM.js";
import "./chunk-GVO3YIU2.js";
import "./chunk-DAHXCIOX.js";
import "./chunk-AABNX23Q.js";
import "./chunk-37IYBZDZ.js";
import {
  arrayRemoveDuplicates_default
} from "./chunk-RIQM3XY5.js";
import "./chunk-XUYCCEG6.js";
import "./chunk-25USKS4R.js";
import "./chunk-RZJA77TX.js";
import {
  IndexDatatype_default
} from "./chunk-AZPKFL5X.js";
import {
  GeometryAttributes_default
} from "./chunk-ETCPCGKC.js";
import {
  GeometryAttribute_default,
  Geometry_default,
  PrimitiveType_default
} from "./chunk-DNCRKMCI.js";
import {
  BoundingSphere_default
} from "./chunk-GO3IRH6U.js";
import "./chunk-WUMTX3FI.js";
import {
  ComponentDatatype_default
} from "./chunk-FQNSMOZT.js";
import {
  Cartesian3_default,
  Ellipsoid_default,
  Frozen_default
} from "./chunk-E6NMEKSS.js";
import "./chunk-Y3PM6G2V.js";
import "./chunk-DXYAD4ED.js";
import "./chunk-Q2QXUN33.js";
import {
  Check_default
} from "./chunk-SOYVF5RC.js";
import {
  defined_default
} from "./chunk-EV4PBU7O.js";

// packages/engine/Source/Core/CoplanarPolygonOutlineGeometry.js
function createGeometryFromPositions(positions) {
  const length = positions.length;
  const flatPositions = new Float64Array(length * 3);
  const indices = IndexDatatype_default.createTypedArray(length, length * 2);
  let positionIndex = 0;
  let index = 0;
  for (let i = 0; i < length; i++) {
    const position = positions[i];
    flatPositions[positionIndex++] = position.x;
    flatPositions[positionIndex++] = position.y;
    flatPositions[positionIndex++] = position.z;
    indices[index++] = i;
    indices[index++] = (i + 1) % length;
  }
  const attributes = new GeometryAttributes_default({
    position: new GeometryAttribute_default({
      componentDatatype: ComponentDatatype_default.DOUBLE,
      componentsPerAttribute: 3,
      values: flatPositions
    })
  });
  return new Geometry_default({
    attributes,
    indices,
    primitiveType: PrimitiveType_default.LINES
  });
}
function CoplanarPolygonOutlineGeometry(options) {
  options = options ?? Frozen_default.EMPTY_OBJECT;
  const polygonHierarchy = options.polygonHierarchy;
  Check_default.defined("options.polygonHierarchy", polygonHierarchy);
  this._polygonHierarchy = polygonHierarchy;
  this._workerName = "createCoplanarPolygonOutlineGeometry";
  this.packedLength = PolygonGeometryLibrary_default.computeHierarchyPackedLength(
    polygonHierarchy,
    Cartesian3_default
  ) + 1;
}
CoplanarPolygonOutlineGeometry.fromPositions = function(options) {
  options = options ?? Frozen_default.EMPTY_OBJECT;
  Check_default.defined("options.positions", options.positions);
  const newOptions = {
    polygonHierarchy: {
      positions: options.positions
    }
  };
  return new CoplanarPolygonOutlineGeometry(newOptions);
};
CoplanarPolygonOutlineGeometry.pack = function(value, array, startingIndex) {
  Check_default.typeOf.object("value", value);
  Check_default.defined("array", array);
  startingIndex = startingIndex ?? 0;
  startingIndex = PolygonGeometryLibrary_default.packPolygonHierarchy(
    value._polygonHierarchy,
    array,
    startingIndex,
    Cartesian3_default
  );
  array[startingIndex] = value.packedLength;
  return array;
};
var scratchOptions = {
  polygonHierarchy: {}
};
CoplanarPolygonOutlineGeometry.unpack = function(array, startingIndex, result) {
  Check_default.defined("array", array);
  startingIndex = startingIndex ?? 0;
  const polygonHierarchy = PolygonGeometryLibrary_default.unpackPolygonHierarchy(
    array,
    startingIndex,
    Cartesian3_default
  );
  startingIndex = polygonHierarchy.startingIndex;
  delete polygonHierarchy.startingIndex;
  const packedLength = array[startingIndex];
  if (!defined_default(result)) {
    result = new CoplanarPolygonOutlineGeometry(scratchOptions);
  }
  result._polygonHierarchy = polygonHierarchy;
  result.packedLength = packedLength;
  return result;
};
CoplanarPolygonOutlineGeometry.createGeometry = function(polygonGeometry) {
  const polygonHierarchy = polygonGeometry._polygonHierarchy;
  let outerPositions = polygonHierarchy.positions;
  outerPositions = arrayRemoveDuplicates_default(
    outerPositions,
    Cartesian3_default.equalsEpsilon,
    true
  );
  if (outerPositions.length < 3) {
    return;
  }
  const isValid = CoplanarPolygonGeometryLibrary_default.validOutline(outerPositions);
  if (!isValid) {
    return void 0;
  }
  const polygons = PolygonGeometryLibrary_default.polygonOutlinesFromHierarchy(
    polygonHierarchy,
    false
  );
  if (polygons.length === 0) {
    return void 0;
  }
  const geometries = [];
  for (let i = 0; i < polygons.length; i++) {
    const geometryInstance = new GeometryInstance_default({
      geometry: createGeometryFromPositions(polygons[i])
    });
    geometries.push(geometryInstance);
  }
  const geometry = GeometryPipeline_default.combineInstances(geometries)[0];
  const boundingSphere = BoundingSphere_default.fromPoints(polygonHierarchy.positions);
  return new Geometry_default({
    attributes: geometry.attributes,
    indices: geometry.indices,
    primitiveType: geometry.primitiveType,
    boundingSphere
  });
};
var CoplanarPolygonOutlineGeometry_default = CoplanarPolygonOutlineGeometry;

// packages/engine/Source/Workers/createCoplanarPolygonOutlineGeometry.js
function createCoplanarPolygonOutlineGeometry(polygonGeometry, offset) {
  if (defined_default(offset)) {
    polygonGeometry = CoplanarPolygonOutlineGeometry_default.unpack(
      polygonGeometry,
      offset
    );
  }
  polygonGeometry._ellipsoid = Ellipsoid_default.clone(polygonGeometry._ellipsoid);
  return CoplanarPolygonOutlineGeometry_default.createGeometry(polygonGeometry);
}
var createCoplanarPolygonOutlineGeometry_default = createCoplanarPolygonOutlineGeometry;
export {
  createCoplanarPolygonOutlineGeometry_default as default
};
