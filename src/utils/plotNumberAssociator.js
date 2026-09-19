// src/utils/plotNumberAssociator.js

/**
 * Attach plot numbers to plot polygon features.
 *
 * The PDF extractor stores plot numbers as separate
 * TEXT point features instead of putting them directly
 * inside the plot polygon properties.
 */

export const attachPlotNumbers = geoJson => {
  if (!geoJson?.features) {
    return geoJson;
  }

  const textFeatures = geoJson.features.filter(
    feature =>
      feature.properties?.sourceType === 'TEXT',
  );

  const candidates = textFeatures
    .map((feature, index) => {
      const text = String(
        feature.properties?.text ?? '',
      ).trim();

      // Plot numbers should be integer values.
      if (!/^\d{1,3}$/.test(text)) {
        return null;
      }

      const value = Number(text);

      // Ignore obviously unrelated large numbers.
      if (value < 1 || value > 300) {
        return null;
      }

      const coordinates =
        feature.geometry?.coordinates;

      if (
        !Array.isArray(coordinates) ||
        coordinates.length < 2
      ) {
        return null;
      }

      return {
        id: `text-${index}`,
        value: String(value),
        position: {
          lng: coordinates[0],
          lat: coordinates[1],
        },
        fontSize:
          Number(
            feature.properties?.fontSize,
          ) || 8,
      };
    })
    .filter(Boolean);

  const usedCandidates = new Set();

  const features = geoJson.features.map(
    feature => {
      if (
        feature.properties?.sourceType !== 'PLOT'
      ) {
        return feature;
      }

      const center = getFeatureCenter(
        feature.geometry,
      );

      if (!center) {
        return feature;
      }

      const rankedCandidates = candidates
        .filter(
          candidate =>
            !usedCandidates.has(candidate.id),
        )
        .map(candidate => {
          const distance = getDistance(
            center,
            candidate.position,
          );

          const fontBonus =
            candidate.fontSize >= 10
              ? 2
              : 0;

          return {
            ...candidate,
            distance,
            score: distance - fontBonus,
          };
        })
        .sort(
          (a, b) => a.score - b.score,
        );

      const bestCandidate =
        rankedCandidates[0];

      if (!bestCandidate) {
        return feature;
      }

      /*
       * Prevent extremely distant text from being
       * assigned to a plot.
       *
       * Coordinates are already normalized, so this
       * threshold works for our current demo layout.
       */
      if (bestCandidate.distance > 0.0005) {
        return feature;
      }

      usedCandidates.add(bestCandidate.id);

      return {
        ...feature,
        properties: {
          ...feature.properties,
          plotNumber:
            bestCandidate.value,
        },
      };
    },
  );

  return {
    ...geoJson,
    features,
  };
};


/**
 * Calculate a simple center from polygon coordinates.
 */
const getFeatureCenter = geometry => {
  if (!geometry) {
    return null;
  }

  if (geometry.type === 'Polygon') {
    return getRingCenter(
      geometry.coordinates?.[0],
    );
  }

  if (geometry.type === 'MultiPolygon') {
    const polygons =
      geometry.coordinates || [];

    const centers = polygons
      .map(polygon =>
        getRingCenter(polygon?.[0]),
      )
      .filter(Boolean);

    if (!centers.length) {
      return null;
    }

    return {
      lng:
        centers.reduce(
          (sum, center) =>
            sum + center.lng,
          0,
        ) / centers.length,

      lat:
        centers.reduce(
          (sum, center) =>
            sum + center.lat,
          0,
        ) / centers.length,
    };
  }

  return null;
};


const getRingCenter = ring => {
  if (!ring?.length) {
    return null;
  }

  let lng = 0;
  let lat = 0;
  let count = 0;

  ring.forEach(coordinate => {
    if (
      !Array.isArray(coordinate) ||
      coordinate.length < 2
    ) {
      return;
    }

    if (
      typeof coordinate[0] !== 'number' ||
      typeof coordinate[1] !== 'number'
    ) {
      return;
    }

    lng += coordinate[0];
    lat += coordinate[1];
    count += 1;
  });

  if (!count) {
    return null;
  }

  return {
    lng: lng / count,
    lat: lat / count,
  };
};


/**
 * Approximate distance between two map coordinates.
 *
 * For our local demo layout this is sufficient because
 * we only compare nearby features.
 */
const getDistance = (a, b) => {
  const dx = a.lng - b.lng;
  const dy = a.lat - b.lat;

  return Math.sqrt(
    dx * dx + dy * dy,
  );
};