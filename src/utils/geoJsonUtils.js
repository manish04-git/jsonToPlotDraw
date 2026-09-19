// src/utils/geoJsonUtils.js

/**
 * Calculate the center of a GeoJSON geometry.
 *
 * This is a visual center based on the
 * coordinates, not a mathematically exact
 * polygon centroid.
 */

export const getGeometryCenter = geometry => {
  if (!geometry) {
    return null;
  }

  // ==========================================
  // GeometryCollection
  // ==========================================

  if (
    geometry.type ===
    'GeometryCollection'
  ) {
    const geometries =
      geometry.geometries || [];

    if (!geometries.length) {
      return null;
    }

    const centers =
      geometries
        .map(getGeometryCenter)
        .filter(Boolean);

    if (!centers.length) {
      return null;
    }

    const total = centers.reduce(
      (result, center) => {
        result.lng += center.lng;
        result.lat += center.lat;

        return result;
      },
      {
        lng: 0,
        lat: 0,
      },
    );

    return {
      lng:
        total.lng /
        centers.length,

      lat:
        total.lat /
        centers.length,
    };
  }

  // ==========================================
  // Polygon
  // ==========================================

  if (
    geometry.type === 'Polygon'
  ) {
    const outerRing =
      geometry.coordinates?.[0];

    if (
      !outerRing ||
      !outerRing.length
    ) {
      return null;
    }

    return calculateRingCenter(
      outerRing,
    );
  }

  // ==========================================
  // MultiPolygon
  // ==========================================

  if (
    geometry.type ===
    'MultiPolygon'
  ) {
    const polygons =
      geometry.coordinates || [];

    if (!polygons.length) {
      return null;
    }

    const centers =
      polygons
        .map(polygon => {
          const outerRing =
            polygon?.[0];

          if (
            !outerRing ||
            !outerRing.length
          ) {
            return null;
          }

          return calculateRingCenter(
            outerRing,
          );
        })
        .filter(Boolean);

    if (!centers.length) {
      return null;
    }

    const total = centers.reduce(
      (result, center) => {
        result.lng += center.lng;
        result.lat += center.lat;

        return result;
      },
      {
        lng: 0,
        lat: 0,
      },
    );

    return {
      lng:
        total.lng /
        centers.length,

      lat:
        total.lat /
        centers.length,
    };
  }

  // ==========================================
  // LineString
  // ==========================================

  if (
    geometry.type ===
    'LineString'
  ) {
    return calculateRingCenter(
      geometry.coordinates || [],
    );
  }

  return null;
};

/**
 * Calculate average coordinate of a ring.
 */
const calculateRingCenter =
  coordinates => {
    if (!coordinates.length) {
      return null;
    }

    let totalLng = 0;
    let totalLat = 0;
    let count = 0;

    coordinates.forEach(
      coordinate => {
        if (
          !Array.isArray(
            coordinate,
          ) ||
          coordinate.length < 2
        ) {
          return;
        }

        const lng =
          coordinate[0];

        const lat =
          coordinate[1];

        if (
          typeof lng !== 'number' ||
          typeof lat !== 'number'
        ) {
          return;
        }

        totalLng += lng;
        totalLat += lat;
        count += 1;
      },
    );

    if (count === 0) {
      return null;
    }

    return {
      lng: totalLng / count,
      lat: totalLat / count,
    };
  };