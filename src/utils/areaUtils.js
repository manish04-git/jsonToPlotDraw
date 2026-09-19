/**
 * Calculate area of GeoJSON geometry.
 *
 * For local layout coordinates:
 * [x, y] = [meters, meters]
 *
 * Result:
 * square meters (m²)
 */

export const calculateGeometryArea = geometry => {
  if (!geometry) return 0;

  switch (geometry.type) {
    case 'Polygon':
      return calculatePolygonArea(geometry.coordinates);

    case 'MultiPolygon':
      return (
        geometry.coordinates?.reduce(
          (total, polygon) =>
            total + calculatePolygonArea(polygon),
          0,
        ) || 0
      );

    case 'GeometryCollection':
      return (
        geometry.geometries?.reduce(
          (total, childGeometry) =>
            total + calculateGeometryArea(childGeometry),
          0,
        ) || 0
      );

    default:
      return 0;
  }
};

/**
 * Calculate Polygon area.
 *
 * GeoJSON:
 *
 * coordinates = [
 *   outerRing,
 *   hole1,
 *   hole2,
 *   ...
 * ]
 */
const calculatePolygonArea = rings => {
  if (!Array.isArray(rings) || rings.length === 0) {
    return 0;
  }

  // First ring = outer boundary
  const outerArea = calculateRingArea(rings[0]);

  // Remaining rings = holes
  const holesArea = rings
    .slice(1)
    .reduce(
      (total, ring) => total + calculateRingArea(ring),
      0,
    );

  return Math.max(0, outerArea - holesArea);
};

/**
 * Calculate area of one ring using
 * the Shoelace Formula.
 */
const calculateRingArea = coordinates => {
  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 3
  ) {
    return 0;
  }

  let area = 0;

  for (let i = 0; i < coordinates.length - 1; i += 1) {
    const current = coordinates[i];
    const next = coordinates[i + 1];

    if (
      !Array.isArray(current) ||
      !Array.isArray(next) ||
      current.length < 2 ||
      next.length < 2
    ) {
      continue;
    }

    const x1 = Number(current[0]);
    const y1 = Number(current[1]);

    const x2 = Number(next[0]);
    const y2 = Number(next[1]);

    if (
      !Number.isFinite(x1) ||
      !Number.isFinite(y1) ||
      !Number.isFinite(x2) ||
      !Number.isFinite(y2)
    ) {
      continue;
    }

    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area) / 2;
};