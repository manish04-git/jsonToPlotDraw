// import { normalizeGeoJson } from '../utils/geoJsonNormalizer';
// import styles from './GeoJsonUploader.module.css';

// const GeoJsonUploader = ({ onLoad }) => {
//   const handleChange = event => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = event => {
//       try {
//         const text = event.target.result;
//         const data = JSON.parse(text);

//         const geometryTypes = [
//           'Point',
//           'MultiPoint',
//           'LineString',
//           'MultiLineString',
//           'Polygon',
//           'MultiPolygon',
//           'GeometryCollection',
//         ];

//         // =========================================
//         // Validate GeoJSON
//         // =========================================

//         if (
//           data.type !== 'FeatureCollection' &&
//           data.type !== 'Feature' &&
//           !geometryTypes.includes(data.type)
//         ) {
//           throw new Error(
//             'The selected file is valid JSON, but it is not valid GeoJSON.',
//           );
//         }

//         let featureCollection;

//         // =========================================
//         // Single Feature
//         // =========================================

//         if (data.type === 'Feature') {
//           featureCollection = {
//             type: 'FeatureCollection',
//             features: [data],
//           };
//         }

//         // =========================================
//         // Single Geometry
//         // =========================================

//         else if (geometryTypes.includes(data.type)) {
//           featureCollection = {
//             type: 'FeatureCollection',
//             features: [
//               {
//                 type: 'Feature',
//                 properties: {},
//                 geometry: data,
//               },
//             ],
//           };
//         }

//         // =========================================
//         // FeatureCollection
//         // =========================================

//         else {
//           featureCollection = data;
//         }

//         // =========================================
//         // Remove Point features
//         // =========================================

//         const filteredGeoJson = {
//           ...featureCollection,

//           features: featureCollection.features.filter(
//             feature => {
//               const geometryType =
//                 feature.geometry?.type;

//               return (
//                 geometryType !== 'Point' &&
//                 geometryType !== 'MultiPoint'
//               );
//             },
//           ),
//         };

//         // =========================================
//         // Normalize coordinates
//         // =========================================

//         const normalizedGeoJson =
//           normalizeGeoJson(filteredGeoJson);

//         // =========================================
//         // Debug
//         // =========================================

//         console.log(
//           'Original features:',
//           featureCollection.features.length,
//         );

//         console.log(
//           'Filtered features:',
//           filteredGeoJson.features.length,
//         );

//         console.log(
//           'Removed features:',
//           featureCollection.features.length -
//             filteredGeoJson.features.length,
//         );

//         console.log(
//           'Normalized GeoJSON:',
//           normalizedGeoJson,
//         );

//         // =========================================
//         // Send to map
//         // =========================================

//         onLoad(normalizedGeoJson);
//       } catch (error) {
//         console.error(
//           'GeoJSON import error:',
//           error,
//         );

//         alert(
//           error.message ||
//             'Unable to read the selected file.',
//         );
//       }
//     };

//     reader.onerror = () => {
//       alert('Unable to read the selected file.');
//     };

//     reader.readAsText(file);

//     // Allow selecting the same file again
//     event.target.value = '';
//   };

//   return (
//     <label className={styles.importBtn}>
//       Import GeoJSON

//       <input
//         type="file"
//         accept=".geojson,.json,application/json,application/geo+json"
//         hidden
//         onChange={handleChange}
//       />
//     </label>
//   );
// };

// export default GeoJsonUploader;



import { normalizeGeoJson } from '../utils/geoJsonNormalizer';
import { attachPlotNumbers } from '../utils/plotNumberAssociator';

import styles from './GeoJsonUploader.module.css';

const GeoJsonUploader = ({ onLoad }) => {
  const handleChange = event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = event => {
      try {
        const text = event.target.result;
        const data = JSON.parse(text);

        const geometryTypes = [
          'Point',
          'MultiPoint',
          'LineString',
          'MultiLineString',
          'Polygon',
          'MultiPolygon',
          'GeometryCollection',
        ];

        // =========================================
        // VALIDATE GEOJSON
        // =========================================

        if (
          data.type !== 'FeatureCollection' &&
          data.type !== 'Feature' &&
          !geometryTypes.includes(data.type)
        ) {
          throw new Error(
            'The selected file is valid JSON, but it is not valid GeoJSON.',
          );
        }

        let featureCollection;

        // =========================================
        // SINGLE FEATURE
        // =========================================

        if (data.type === 'Feature') {
          featureCollection = {
            type: 'FeatureCollection',
            features: [data],
          };
        }

        // =========================================
        // SINGLE GEOMETRY
        // =========================================

        else if (geometryTypes.includes(data.type)) {
          featureCollection = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: data,
              },
            ],
          };
        }

        // =========================================
        // FEATURE COLLECTION
        // =========================================

        else {
          featureCollection = data;
        }

        // =========================================
        // BASIC VALIDATION
        // =========================================

        if (
          !Array.isArray(
            featureCollection.features,
          )
        ) {
          throw new Error(
            'Invalid GeoJSON: features must be an array.',
          );
        }

        // =========================================
        // ORIGINAL FEATURE COUNT
        // =========================================

        console.log(
          'Original features:',
          featureCollection.features.length,
        );

        // =========================================
        // NORMALIZE COORDINATES
        // =========================================

        /*
         * Important:
         *
         * We DO NOT remove Point features here.
         *
         * The PDF extractor stores plot numbers
         * as separate TEXT Point features.
         *
         * Those points are required by
         * attachPlotNumbers().
         */

        const normalizedGeoJson =
          normalizeGeoJson(featureCollection);

        // =========================================
        // ATTACH PLOT NUMBERS
        // =========================================

        const geoJsonWithPlotNumbers =
          attachPlotNumbers(
            normalizedGeoJson,
          );

        // =========================================
        // DEBUG
        // =========================================

        const plotFeatures =
          geoJsonWithPlotNumbers.features.filter(
            feature =>
              feature.properties
                ?.featureType === 'plot',
          );

        const plotsWithNumbers =
          plotFeatures.filter(feature => {
            const plotNumber =
              feature.properties?.plotNumber;

            return (
              plotNumber !== undefined &&
              plotNumber !== null &&
              String(plotNumber).trim() !== ''
            );
          });

        const textFeatures =
          geoJsonWithPlotNumbers.features.filter(
            feature =>
              feature.properties
                ?.sourceType === 'TEXT',
          );

        console.log(
          'Normalized GeoJSON:',
          geoJsonWithPlotNumbers,
        );

        console.log(
          'Total features:',
          geoJsonWithPlotNumbers.features.length,
        );

        console.log(
          'Plot features:',
          plotFeatures.length,
        );

        console.log(
          'TEXT features:',
          textFeatures.length,
        );

        console.log(
          'Plots with plot numbers:',
          plotsWithNumbers.length,
        );

        console.log(
          'Plots without plot numbers:',
          plotFeatures.length -
            plotsWithNumbers.length,
        );

        // =========================================
        // SEND TO MAP
        // =========================================

        onLoad(
          geoJsonWithPlotNumbers,
        );
      } catch (error) {
        console.error(
          'GeoJSON import error:',
          error,
        );

        alert(
          error.message ||
            'Unable to read the selected file.',
        );
      }
    };

    reader.onerror = () => {
      alert(
        'Unable to read the selected file.',
      );
    };

    reader.readAsText(file);

    // =========================================
    // ALLOW SAME FILE TO BE SELECTED AGAIN
    // =========================================

    event.target.value = '';
  };

  return (
    <label className={styles.importBtn}>
      Import GeoJSON

      <input
        type="file"
        accept=".geojson,.json,application/json,application/geo+json"
        hidden
        onChange={handleChange}
      />
    </label>
  );
};

export default GeoJsonUploader;