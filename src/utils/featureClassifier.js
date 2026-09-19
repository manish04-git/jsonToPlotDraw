// src/utils/featureClassifier.js

/**
 * Detect the real-estate feature type.
 *
 * Supported types:
 * - plot
 * - road
 * - garden
 * - amenity
 * - boundary
 * - unknown
 */

export const detectFeatureType = feature => {
  if (!feature) {
    return 'unknown';
  }

  const properties = feature.properties || {};

  const sourceType = String(
    properties.sourceType || '',
  ).toLowerCase();

  const featureType = String(
    properties.featureType || '',
  ).toLowerCase();

  const name = String(
    properties.name ||
      properties.category ||
      properties.type ||
      '',
  ).toLowerCase();

  // ==========================================
  // PLOT
  // ==========================================

  if (
    sourceType === 'plot' ||
    featureType === 'plot' ||
    name === 'plot' ||
    name.includes('plot')
  ) {
    return 'plot';
  }

  // ==========================================
  // ROAD
  // ==========================================

  if (
    sourceType === 'road' ||
    featureType === 'road' ||
    name === 'road' ||
    name.includes('road') ||
    name.includes('street')
  ) {
    return 'road';
  }

  // ==========================================
  // GARDEN
  // ==========================================

  if (
    sourceType === 'garden' ||
    featureType === 'garden' ||
    name === 'garden' ||
    name.includes('garden') ||
    name.includes('park') ||
    name.includes('green')
  ) {
    return 'garden';
  }

  // ==========================================
  // AMENITY
  // ==========================================

  if (
    sourceType === 'amenity' ||
    featureType === 'amenity' ||
    name === 'amenity' ||
    name.includes('amenity') ||
    name.includes('clubhouse') ||
    name.includes('temple') ||
    name.includes('school') ||
    name.includes('shop') ||
    name.includes('commercial')
  ) {
    return 'amenity';
  }

  // ==========================================
  // BOUNDARY
  // ==========================================

  if (
    sourceType === 'boundary' ||
    featureType === 'boundary' ||
    name === 'boundary' ||
    name.includes('boundary')
  ) {
    return 'boundary';
  }

  // ==========================================
  // ROAD_OR_BOUNDARY
  // ==========================================

  /**
   * Your extracted layout currently contains
   * ROAD_OR_BOUNDARY.
   *
   * We classify this as boundary because we
   * cannot safely assume that every such line
   * represents an actual road.
   */

  if (
    sourceType === 'road_or_boundary' ||
    featureType === 'road_or_boundary'
  ) {
    return 'boundary';
  }

  // ==========================================
  // UNKNOWN
  // ==========================================

  return 'unknown';
};