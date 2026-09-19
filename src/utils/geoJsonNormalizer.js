// src/utils/geoJsonNormalizer.js

import { detectFeatureType } from './featureClassifier';

const DEFAULT_CENTER = {
  lat: 21.1459,
  lng: 79.0885,
};

const DEFAULT_LAYOUT_SIZE_METERS = 500;

const METERS_PER_DEGREE_LAT = 111320;

/**
 * Convert local/PDF coordinates into
 * approximate Google Maps coordinates.
 *
 * IMPORTANT:
 * This is a demo transformation.
 *
 * The input coordinates are not actual
 * latitude/longitude coordinates.
 */
const createCoordinateTransformer = (
  features,
  center = DEFAULT_CENTER,
  layoutSizeMeters = DEFAULT_LAYOUT_SIZE_METERS,
) => {
  let minX = Infinity;
  let maxX = -Infinity;

  let minY = Infinity;
  let maxY = -Infinity;

  const processCoordinates = coordinates => {
    if (!Array.isArray(coordinates)) {
      return;
    }

    // GeoJSON coordinate:
    // [longitude, latitude]
    //
    // In our source file these are actually
    // local/PDF coordinates:
    // [x, y]

    if (
      coordinates.length >= 2 &&
      typeof coordinates[0] === 'number' &&
      typeof coordinates[1] === 'number'
    ) {
      const x = coordinates[0];
      const y = coordinates[1];

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);

      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      return;
    }

    coordinates.forEach(processCoordinates);
  };

  const processGeometry = geometry => {
    if (!geometry) {
      return;
    }

    if (geometry.type === 'GeometryCollection') {
      geometry.geometries?.forEach(
        processGeometry,
      );

      return;
    }

    processCoordinates(
      geometry.coordinates,
    );
  };

  features.forEach(feature => {
    processGeometry(feature.geometry);
  });

  // No usable coordinates
  if (
    minX === Infinity ||
    maxX === -Infinity ||
    minY === Infinity ||
    maxY === -Infinity
  ) {
    return null;
  }

  const sourceWidth = maxX - minX;
  const sourceHeight = maxY - minY;

  const largestDimension = Math.max(
    sourceWidth,
    sourceHeight,
  );

  if (largestDimension === 0) {
    return null;
  }

  // Preserve original aspect ratio
  const scale =
    layoutSizeMeters / largestDimension;

  const layoutWidthMeters =
    sourceWidth * scale;

  const layoutHeightMeters =
    sourceHeight * scale;

  const metersPerDegreeLng =
    111320 *
    Math.cos(
      (center.lat * Math.PI) / 180,
    );

  const transformCoordinate = coordinate => {
    if (
      !Array.isArray(coordinate) ||
      coordinate.length < 2
    ) {
      return coordinate;
    }

    const x = coordinate[0];
    const y = coordinate[1];

    if (
      typeof x !== 'number' ||
      typeof y !== 'number'
    ) {
      return coordinate;
    }

    // Convert source X into meters
    const xMeters =
      (x - minX) * scale;

    // Invert Y because PDF/local coordinates
    // usually grow downward while map latitude
    // grows upward.
    const yMeters =
      (maxY - y) * scale;

    // Center layout around DEFAULT_CENTER
    const lng =
      center.lng +
      (
        xMeters -
        layoutWidthMeters / 2
      ) /
        metersPerDegreeLng;

    const lat =
      center.lat +
      (
        yMeters -
        layoutHeightMeters / 2
      ) /
        METERS_PER_DEGREE_LAT;

    return [lng, lat];
  };

  return {
    transformCoordinate,
    bounds: {
      minX,
      maxX,
      minY,
      maxY,
      sourceWidth,
      sourceHeight,
      layoutWidthMeters,
      layoutHeightMeters,
    },
  };
};

/**
 * Recursively transform geometry coordinates.
 */
const transformGeometry = (
  geometry,
  transformCoordinate,
) => {
  if (!geometry) {
    return geometry;
  }

  if (geometry.type === 'GeometryCollection') {
    return {
      ...geometry,
      geometries:
        geometry.geometries?.map(
          childGeometry =>
            transformGeometry(
              childGeometry,
              transformCoordinate,
            ),
        ) || [],
    };
  }

  const transformCoordinates = coordinates => {
    if (!Array.isArray(coordinates)) {
      return coordinates;
    }

    if (
      coordinates.length >= 2 &&
      typeof coordinates[0] === 'number' &&
      typeof coordinates[1] === 'number'
    ) {
      return transformCoordinate(
        coordinates,
      );
    }

    return coordinates.map(
      transformCoordinates,
    );
  };

  return {
    ...geometry,
    coordinates:
      transformCoordinates(
        geometry.coordinates,
      ),
  };
};

/**
 * Normalize feature properties.
 */
const normalizeProperties = (
  properties,
  feature,
) => {
  const props = properties || {};

  return {
    ...props,

    // Detected real-estate feature type
    featureType: detectFeatureType({
      ...feature,
      properties: props,
    }),

    // Standard area property
    area:
      props.area ??
      props.areaSqM ??
      null,

    // Standard fill color
    fillColor:
      props.fillColor ||
      props.fill ||
      '#22c55e',

    // Standard fill opacity
    fillOpacity:
      props.fillOpacity ??
      props['fill-opacity'] ??
      0.4,

    // Standard stroke color
    strokeColor:
      props.strokeColor ||
      props.stroke ||
      '#15803d',

    // Standard stroke width
    strokeWeight:
      props.strokeWeight ??
      props['stroke-width'] ??
      2,
  };
};

/**
 * Normalize GeoJSON into a structure that
 * our application can work with.
 */
export const normalizeGeoJson = (
  geoJson,
) => {
  if (!geoJson) {
    return null;
  }

  let featureCollection;

  // ==========================================
  // FeatureCollection
  // ==========================================

  if (
    geoJson.type ===
    'FeatureCollection'
  ) {
    featureCollection = geoJson;
  }

  // ==========================================
  // Single Feature
  // ==========================================

  else if (
    geoJson.type === 'Feature'
  ) {
    featureCollection = {
      type: 'FeatureCollection',
      features: [geoJson],
    };
  }

  // ==========================================
  // Geometry
  // ==========================================

  else {
    const geometryTypes = [
      'Point',
      'MultiPoint',
      'LineString',
      'MultiLineString',
      'Polygon',
      'MultiPolygon',
      'GeometryCollection',
    ];

    if (
      geometryTypes.includes(
        geoJson.type,
      )
    ) {
      featureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: geoJson,
          },
        ],
      };
    } else {
      return null;
    }
  }

  const features =
    featureCollection.features || [];

  // ==========================================
  // Create coordinate transformer
  // ==========================================

  const transformer =
    createCoordinateTransformer(
      features,
      DEFAULT_CENTER,
      DEFAULT_LAYOUT_SIZE_METERS,
    );

  if (!transformer) {
    return {
      ...featureCollection,
      features: [],
    };
  }

  // ==========================================
  // Transform every feature
  // ==========================================

  const normalizedFeatures =
    features.map(feature => {
      return {
        ...feature,

        geometry:
          transformGeometry(
            feature.geometry,
            transformer.transformCoordinate,
          ),

        properties:
          normalizeProperties(
            feature.properties,
            feature,
          ),
      };
    });

  return {
    ...featureCollection,

    type: 'FeatureCollection',

    features: normalizedFeatures,

    // Useful metadata
    metadata: {
      coordinateSystem:
        'local-to-google-demo-transform',

      center: DEFAULT_CENTER,

      layoutSizeMeters:
        DEFAULT_LAYOUT_SIZE_METERS,

      bounds:
        transformer.bounds,
    },
  };
};