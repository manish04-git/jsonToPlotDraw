// // src/components/PlotMap.jsx

// import { useEffect } from 'react';

// import {
//   APIProvider,
//   Map,
//   useMap,
//   useMapsLibrary,
// } from '@vis.gl/react-google-maps';

// import PlotLabel from './PlotLabel';

// import {
//   getGeometryCenter,
// } from '../utils/geoJsonUtils';

// import {
//   getPlotStyle,
//   getRoadStyle,
//   getGardenStyle,
//   getAmenityStyle,
//   getBoundaryStyle,
// } from '../utils/featureStyles';

// const API_KEY =
//   import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const DEFAULT_CENTER = {
//   lat: 21.1459,
//   lng: 79.0885,
// };

// const PlotMap = ({
//   geoJsonData,
//   onPlotSelect,
// }) => {
//   return (
//     <APIProvider apiKey={API_KEY}>
//       <Map
//         defaultCenter={DEFAULT_CENTER}
//         defaultZoom={18}
//         mapId="DEMO_MAP"
//         style={{
//           width: '100%',
//           height: '100%',
//         }}
//       >
//         <GeoJsonLayer
//           geoJsonData={geoJsonData}
//           onPlotSelect={onPlotSelect}
//         />
//       </Map>
//     </APIProvider>
//   );
// };

// const GeoJsonLayer = ({
//   geoJsonData,
//   onPlotSelect,
// }) => {
//   const map = useMap();
//   const maps = useMapsLibrary('maps');

//   // ============================================
//   // PLOT LABELS
//   // ============================================

//   // plotLabels are derived from geoJsonData.
//   // They do NOT need React state.
//   const plotLabels = geoJsonData
//     ? (geoJsonData.features || [])
//         .map((feature, index) => {
//           const featureType =
//             feature.properties
//               ?.featureType;

//           // Only plots
//           if (
//             featureType !== 'plot'
//           ) {
//             return null;
//           }

//           const plotNumber =
//             feature.properties
//               ?.plotNumber;

//           // Plot has no number
//           if (
//             plotNumber === undefined ||
//             plotNumber === null ||
//             String(plotNumber).trim() === ''
//           ) {
//             return null;
//           }

//           const position =
//             getGeometryCenter(
//               feature.geometry,
//             );

//           // Could not calculate center
//           if (!position) {
//             return null;
//           }

//           return {
//             id:
//               feature.id ||
//               `plot-${index}`,

//             text: String(
//               plotNumber,
//             ),

//             position,
//           };
//         })
//         .filter(Boolean)
//     : [];

//   // ============================================
//   // GOOGLE MAP DATA LAYERS
//   // ============================================

//   useEffect(() => {
//     if (
//       !map ||
//       !maps ||
//       !geoJsonData
//     ) {
//       return;
//     }

//     console.log(
//       'Imported normalized GeoJSON:',
//       geoJsonData,
//     );

//     // ==========================================
//     // GET FEATURES
//     // ==========================================

//     const features =
//       geoJsonData.features || [];

//     // ==========================================
//     // FEATURE STATISTICS
//     // ==========================================

//     const featureStats =
//       features.reduce(
//         (stats, feature) => {
//           const type =
//             feature.properties
//               ?.featureType ||
//             'unknown';

//           stats[type] =
//             (stats[type] || 0) + 1;

//           return stats;
//         },
//         {},
//       );

//     console.log(
//       'Detected feature types:',
//       featureStats,
//     );

//     // ==========================================
//     // DRAWABLE GEOMETRY
//     // ==========================================

//     const isDrawableGeometry =
//       feature => {
//         const geometryType =
//           feature.geometry?.type;

//         return (
//           geometryType !== 'Point' &&
//           geometryType !==
//             'MultiPoint'
//         );
//       };

//     // ==========================================
//     // PLOTS
//     // ==========================================

//     const plotFeatures =
//       features.filter(
//         feature =>
//           feature.properties
//             ?.featureType ===
//             'plot' &&
//           isDrawableGeometry(
//             feature,
//           ),
//       );

//     // ==========================================
//     // ROADS
//     // ==========================================

//     const roadFeatures =
//       features.filter(
//         feature =>
//           feature.properties
//             ?.featureType ===
//             'road' &&
//           isDrawableGeometry(
//             feature,
//           ),
//       );

//     // ==========================================
//     // GARDENS
//     // ==========================================

//     const gardenFeatures =
//       features.filter(
//         feature =>
//           feature.properties
//             ?.featureType ===
//             'garden' &&
//           isDrawableGeometry(
//             feature,
//           ),
//       );

//     // ==========================================
//     // AMENITIES
//     // ==========================================

//     const amenityFeatures =
//       features.filter(
//         feature =>
//           feature.properties
//             ?.featureType ===
//             'amenity' &&
//           isDrawableGeometry(
//             feature,
//           ),
//       );

//     // ==========================================
//     // BOUNDARIES
//     // ==========================================

//     const boundaryFeatures =
//       features.filter(
//         feature =>
//           feature.properties
//             ?.featureType ===
//             'boundary' &&
//           isDrawableGeometry(
//             feature,
//           ),
//       );

//     // ==========================================
//     // CREATE PLOT LAYER
//     // ==========================================

//     const plotLayer =
//       new maps.Data();

//     plotLayer.addGeoJson({
//       type: 'FeatureCollection',
//       features: plotFeatures,
//     });

//     plotLayer.setStyle(
//       getPlotStyle,
//     );

//     // ==========================================
//     // CREATE ROAD LAYER
//     // ==========================================

//     const roadLayer =
//       new maps.Data();

//     roadLayer.addGeoJson({
//       type: 'FeatureCollection',
//       features: roadFeatures,
//     });

//     roadLayer.setStyle(
//       getRoadStyle(),
//     );

//     // ==========================================
//     // CREATE GARDEN LAYER
//     // ==========================================

//     const gardenLayer =
//       new maps.Data();

//     gardenLayer.addGeoJson({
//       type: 'FeatureCollection',
//       features:
//         gardenFeatures,
//     });

//     gardenLayer.setStyle(
//       getGardenStyle(),
//     );

//     // ==========================================
//     // CREATE AMENITY LAYER
//     // ==========================================

//     const amenityLayer =
//       new maps.Data();

//     amenityLayer.addGeoJson({
//       type: 'FeatureCollection',
//       features:
//         amenityFeatures,
//     });

//     amenityLayer.setStyle(
//       getAmenityStyle(),
//     );

//     // ==========================================
//     // CREATE BOUNDARY LAYER
//     // ==========================================

//     const boundaryLayer =
//       new maps.Data();

//     boundaryLayer.addGeoJson({
//       type: 'FeatureCollection',
//       features:
//         boundaryFeatures,
//     });

//     boundaryLayer.setStyle(
//       getBoundaryStyle(),
//     );

//     // ==========================================
//     // SHOW LAYERS
//     // ==========================================

//     boundaryLayer.setMap(map);
//     gardenLayer.setMap(map);
//     amenityLayer.setMap(map);
//     roadLayer.setMap(map);
//     plotLayer.setMap(map);

//     // ==========================================
//     // SELECTED PLOT
//     // ==========================================

//     let selectedFeature = null;

//     // ==========================================
//     // CALCULATE MAP BOUNDS
//     // ==========================================

//     let minLat = Infinity;
//     let maxLat = -Infinity;

//     let minLng = Infinity;
//     let maxLng = -Infinity;

//     const processCoordinates =
//       coordinates => {
//         if (
//           !Array.isArray(
//             coordinates,
//           )
//         ) {
//           return;
//         }

//         // GeoJSON:
//         // [longitude, latitude]

//         if (
//           coordinates.length >= 2 &&
//           typeof coordinates[0] ===
//             'number' &&
//           typeof coordinates[1] ===
//             'number'
//         ) {
//           const longitude =
//             coordinates[0];

//           const latitude =
//             coordinates[1];

//           if (
//             longitude < -180 ||
//             longitude > 180 ||
//             latitude < -90 ||
//             latitude > 90
//           ) {
//             return;
//           }

//           minLng = Math.min(
//             minLng,
//             longitude,
//           );

//           maxLng = Math.max(
//             maxLng,
//             longitude,
//           );

//           minLat = Math.min(
//             minLat,
//             latitude,
//           );

//           maxLat = Math.max(
//             maxLat,
//             latitude,
//           );

//           return;
//         }

//         coordinates.forEach(
//           processCoordinates,
//         );
//       };

//     // ==========================================
//     // PROCESS PLOT GEOMETRY
//     // ==========================================

//     plotFeatures.forEach(
//       feature => {
//         const geometry =
//           feature.geometry;

//         if (!geometry) {
//           return;
//         }

//         if (
//           geometry.type ===
//           'GeometryCollection'
//         ) {
//           geometry.geometries?.forEach(
//             childGeometry => {
//               processCoordinates(
//                 childGeometry.coordinates,
//               );
//             },
//           );

//           return;
//         }

//         processCoordinates(
//           geometry.coordinates,
//         );
//       },
//     );

//     // ==========================================
//     // CENTER MAP
//     // ==========================================

//     if (
//       minLat !== Infinity &&
//       maxLat !== -Infinity &&
//       minLng !== Infinity &&
//       maxLng !== -Infinity
//     ) {
//       const centerLat =
//         (minLat + maxLat) / 2;

//       const centerLng =
//         (minLng + maxLng) / 2;

//       map.setCenter({
//         lat: centerLat,
//         lng: centerLng,
//       });

//       const latDiff =
//         maxLat - minLat;

//       const lngDiff =
//         maxLng - minLng;

//       const maxDiff =
//         Math.max(
//           latDiff,
//           lngDiff,
//         );

//       const zoom =
//         maxDiff > 0.1
//           ? 12
//           : maxDiff > 0.05
//             ? 13
//             : maxDiff > 0.02
//               ? 14
//               : maxDiff > 0.01
//                 ? 15
//                 : maxDiff > 0.005
//                   ? 16
//                   : maxDiff > 0.002
//                     ? 17
//                     : 18;

//       map.setZoom(zoom);
//     }

//     // ==========================================
//     // PLOT CLICK
//     // ==========================================

//     const clickListener =
//       plotLayer.addListener(
//         'click',
//         event => {
//           const featureType =
//             event.feature.getProperty(
//               'featureType',
//             );

//           if (
//             featureType !== 'plot'
//           ) {
//             return;
//           }

//           // Restore previous selection
//           if (
//             selectedFeature &&
//             selectedFeature !==
//               event.feature
//           ) {
//             plotLayer.revertStyle(
//               selectedFeature,
//             );
//           }

//           selectedFeature =
//             event.feature;

//           // Highlight selected plot
//           plotLayer.overrideStyle(
//             event.feature,
//             {
//               fillColor: '#2563eb',
//               fillOpacity: 0.55,
//               strokeColor:
//                 '#1d4ed8',
//               strokeWeight: 3,
//             },
//           );

//           // ======================================
//           // GET PLOT DATA
//           // ======================================

//           const plot = {
//             plotNumber:
//               event.feature.getProperty(
//                 'plotNumber',
//               ),

//             plotType:
//               event.feature.getProperty(
//                 'plotType',
//               ),

//             area:
//               event.feature.getProperty(
//                 'area',
//               ),

//             areaSqM:
//               event.feature.getProperty(
//                 'areaSqM',
//               ),

//             price:
//               event.feature.getProperty(
//                 'price',
//               ),

//             status:
//               event.feature.getProperty(
//                 'status',
//               ),

//             cornerPlot:
//               event.feature.getProperty(
//                 'cornerPlot',
//               ),

//             facing:
//               event.feature.getProperty(
//                 'facing',
//               ),

//             roadWidth:
//               event.feature.getProperty(
//                 'roadWidth',
//               ),

//             sourceType:
//               event.feature.getProperty(
//                 'sourceType',
//               ),

//             featureType:
//               event.feature.getProperty(
//                 'featureType',
//               ),

//             page:
//               event.feature.getProperty(
//                 'page',
//               ),

//             fill:
//               event.feature.getProperty(
//                 'fill',
//               ),

//             stroke:
//               event.feature.getProperty(
//                 'stroke',
//               ),
//           };

//           console.log(
//             'Selected plot:',
//             plot,
//           );

//           if (onPlotSelect) {
//             onPlotSelect(plot);
//           }
//         },
//       );

//     // ==========================================
//     // CLEANUP
//     // ==========================================

//     return () => {
//       clickListener.remove();

//       plotLayer.setMap(null);
//       roadLayer.setMap(null);
//       gardenLayer.setMap(null);
//       amenityLayer.setMap(null);
//       boundaryLayer.setMap(null);
//     };
//   }, [
//     map,
//     maps,
//     geoJsonData,
//     onPlotSelect,
//   ]);

//   // ============================================
//   // RENDER PLOT LABELS
//   // ============================================

//   return (
//     <>
//       {plotLabels.map(label => (
//         <PlotLabel
//           key={label.id}
//           position={label.position}
//           text={label.text}
//         />
//       ))}
//     </>
//   );
// };

// export default PlotMap;


// src/components/PlotMap.jsx

import { useEffect } from 'react';

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

import PlotLabel from './PlotLabel';

import {
  getGeometryCenter,
} from '../utils/geoJsonUtils';

import {
  calculateGeometryArea,
} from '../utils/areaUtils';

import {
  getPlotStyle,
  getRoadStyle,
  getGardenStyle,
  getAmenityStyle,
  getBoundaryStyle,
} from '../utils/featureStyles';


const API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const DEFAULT_CENTER = {
  lat: 21.1459,
  lng: 79.0885,
};


const PlotMap = ({
  geoJsonData,
  onPlotSelect,
}) => {
  return (
    <APIProvider
      apiKey={API_KEY}
      libraries={['marker']}
    >
      <Map
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={18}
        mapId="DEMO_MAP"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <GeoJsonLayer
          geoJsonData={geoJsonData}
          onPlotSelect={onPlotSelect}
        />
      </Map>
    </APIProvider>
  );
};


/* =================================================
   GEOJSON LAYER
================================================= */

const GeoJsonLayer = ({
  geoJsonData,
  onPlotSelect,
}) => {
  const map = useMap();

  const maps =
    useMapsLibrary('maps');


  /* =================================================
     PLOT LABELS
  ================================================= */

  const plotLabels = geoJsonData
    ? (geoJsonData.features || [])
        .map((feature, index) => {
          const featureType =
            feature.properties
              ?.featureType;

          if (
            featureType !== 'plot'
          ) {
            return null;
          }

          const plotNumber =
            feature.properties
              ?.plotNumber;

          if (
            plotNumber === undefined ||
            plotNumber === null ||
            String(plotNumber).trim() === ''
          ) {
            return null;
          }

          const position =
            getGeometryCenter(
              feature.geometry,
            );

          if (!position) {
            return null;
          }

          return {
            id:
              feature.id ||
              `plot-${index}`,

            text: String(
              plotNumber,
            ),

            position,
          };
        })
        .filter(Boolean)
    : [];


  /* =================================================
     LOAD GEOJSON
  ================================================= */

  useEffect(() => {
    if (
      !map ||
      !maps ||
      !geoJsonData
    ) {
      return;
    }


    console.log(
      'Imported normalized GeoJSON:',
      geoJsonData,
    );


    /* ===============================================
       FEATURES
    =============================================== */

    const features =
      geoJsonData.features || [];


    /* ===============================================
       FEATURE STATISTICS
    =============================================== */

    const featureStats =
      features.reduce(
        (stats, feature) => {
          const type =
            feature.properties
              ?.featureType ||
            'unknown';

          stats[type] =
            (stats[type] || 0) + 1;

          return stats;
        },
        {},
      );


    console.log(
      'Detected feature types:',
      featureStats,
    );


    /* ===============================================
       DRAWABLE GEOMETRY
    =============================================== */

    const isDrawableGeometry =
      feature => {
        const geometryType =
          feature.geometry?.type;

        return (
          geometryType !== 'Point' &&
          geometryType !== 'MultiPoint'
        );
      };


    /* ===============================================
       PLOTS
    =============================================== */

    const plotFeatures =
      features
        .filter(
          feature =>
            feature.properties
              ?.featureType ===
              'plot' &&
            isDrawableGeometry(
              feature,
            ),
        )
        .map(feature => {
          /*
           * Calculate area directly from
           * the polygon geometry.
           */

          const calculatedAreaSqM =
            calculateGeometryArea(
              feature.geometry,
            );


          console.log(
            'Plot area:',
            {
              plotNumber:
                feature.properties
                  ?.plotNumber,

              extractedArea:
                feature.properties
                  ?.areaSqM,

              calculatedArea:
                calculatedAreaSqM,
            },
          );


          return {
            ...feature,

            properties: {
              ...feature.properties,

              calculatedAreaSqM,
            },
          };
        });


    /* ===============================================
       ROADS
    =============================================== */

    const roadFeatures =
      features.filter(
        feature =>
          feature.properties
            ?.featureType ===
            'road' &&
          isDrawableGeometry(
            feature,
          ),
      );


    /* ===============================================
       GARDENS
    =============================================== */

    const gardenFeatures =
      features.filter(
        feature =>
          feature.properties
            ?.featureType ===
            'garden' &&
          isDrawableGeometry(
            feature,
          ),
      );


    /* ===============================================
       AMENITIES
    =============================================== */

    const amenityFeatures =
      features.filter(
        feature =>
          feature.properties
            ?.featureType ===
            'amenity' &&
          isDrawableGeometry(
            feature,
          ),
      );


    /* ===============================================
       BOUNDARIES
    =============================================== */

    const boundaryFeatures =
      features.filter(
        feature =>
          feature.properties
            ?.featureType ===
            'boundary' &&
          isDrawableGeometry(
            feature,
          ),
      );


    /* ===============================================
       PLOT LAYER
    =============================================== */

    const plotLayer =
      new maps.Data();


    plotLayer.addGeoJson({
      type: 'FeatureCollection',
      features: plotFeatures,
    });


    plotLayer.setStyle(
      getPlotStyle,
    );


    /* ===============================================
       ROAD LAYER
    =============================================== */

    const roadLayer =
      new maps.Data();


    roadLayer.addGeoJson({
      type: 'FeatureCollection',
      features: roadFeatures,
    });


    roadLayer.setStyle(
      getRoadStyle(),
    );


    /* ===============================================
       GARDEN LAYER
    =============================================== */

    const gardenLayer =
      new maps.Data();


    gardenLayer.addGeoJson({
      type: 'FeatureCollection',
      features:
        gardenFeatures,
    });


    gardenLayer.setStyle(
      getGardenStyle(),
    );


    /* ===============================================
       AMENITY LAYER
    =============================================== */

    const amenityLayer =
      new maps.Data();


    amenityLayer.addGeoJson({
      type: 'FeatureCollection',
      features:
        amenityFeatures,
    });


    amenityLayer.setStyle(
      getAmenityStyle(),
    );


    /* ===============================================
       BOUNDARY LAYER
    =============================================== */

    const boundaryLayer =
      new maps.Data();


    boundaryLayer.addGeoJson({
      type: 'FeatureCollection',
      features:
        boundaryFeatures,
    });


    boundaryLayer.setStyle(
      getBoundaryStyle(),
    );


    /* ===============================================
       SHOW LAYERS
    =============================================== */

    boundaryLayer.setMap(map);
    gardenLayer.setMap(map);
    amenityLayer.setMap(map);
    roadLayer.setMap(map);
    plotLayer.setMap(map);


    /* ===============================================
       SELECTED PLOT
    =============================================== */

    let selectedFeature = null;


    /* ===============================================
       MAP BOUNDS
    =============================================== */

    let minLat = Infinity;
    let maxLat = -Infinity;

    let minLng = Infinity;
    let maxLng = -Infinity;


    const processCoordinates =
      coordinates => {
        if (
          !Array.isArray(
            coordinates,
          )
        ) {
          return;
        }


        /*
         * GeoJSON:
         *
         * [longitude, latitude]
         */

        if (
          coordinates.length >= 2 &&
          typeof coordinates[0] ===
            'number' &&
          typeof coordinates[1] ===
            'number'
        ) {
          const longitude =
            coordinates[0];

          const latitude =
            coordinates[1];


          /*
           * Ignore invalid coordinates.
           */

          if (
            longitude < -180 ||
            longitude > 180 ||
            latitude < -90 ||
            latitude > 90
          ) {
            return;
          }


          minLng = Math.min(
            minLng,
            longitude,
          );

          maxLng = Math.max(
            maxLng,
            longitude,
          );

          minLat = Math.min(
            minLat,
            latitude,
          );

          maxLat = Math.max(
            maxLat,
            latitude,
          );

          return;
        }


        coordinates.forEach(
          processCoordinates,
        );
      };


    /* ===============================================
       PROCESS PLOT GEOMETRY
    =============================================== */

    plotFeatures.forEach(
      feature => {
        const geometry =
          feature.geometry;

        if (!geometry) {
          return;
        }


        if (
          geometry.type ===
          'GeometryCollection'
        ) {
          geometry.geometries?.forEach(
            childGeometry => {
              processCoordinates(
                childGeometry.coordinates,
              );
            },
          );

          return;
        }


        processCoordinates(
          geometry.coordinates,
        );
      },
    );


    /* ===============================================
       CENTER MAP
    =============================================== */

    if (
      minLat !== Infinity &&
      maxLat !== -Infinity &&
      minLng !== Infinity &&
      maxLng !== -Infinity
    ) {
      const centerLat =
        (minLat + maxLat) / 2;

      const centerLng =
        (minLng + maxLng) / 2;


      map.setCenter({
        lat: centerLat,
        lng: centerLng,
      });


      const latDiff =
        maxLat - minLat;

      const lngDiff =
        maxLng - minLng;

      const maxDiff =
        Math.max(
          latDiff,
          lngDiff,
        );


      const zoom =
        maxDiff > 0.1
          ? 12
          : maxDiff > 0.05
            ? 13
            : maxDiff > 0.02
              ? 14
              : maxDiff > 0.01
                ? 15
                : maxDiff > 0.005
                  ? 16
                  : maxDiff > 0.002
                    ? 17
                    : 18;


      map.setZoom(zoom);
    }


    /* ===============================================
       PLOT CLICK
    =============================================== */

    const clickListener =
      plotLayer.addListener(
        'click',
        event => {
          console.log(
            'MAP CLICKED',
          );


          const featureType =
            event.feature.getProperty(
              'featureType',
            );


          console.log(
            'Feature type:',
            featureType,
          );


          if (
            featureType !== 'plot'
          ) {
            return;
          }


          /* ========================================
             RESTORE PREVIOUS SELECTION
          ======================================== */

          if (
            selectedFeature &&
            selectedFeature !==
              event.feature
          ) {
            plotLayer.revertStyle(
              selectedFeature,
            );
          }


          selectedFeature =
            event.feature;


          /* ========================================
             HIGHLIGHT SELECTED PLOT
          ======================================== */

          plotLayer.overrideStyle(
            event.feature,
            {
              fillColor:
                '#2563eb',

              fillOpacity:
                0.55,

              strokeColor:
                '#1d4ed8',

              strokeWeight:
                3,
            },
          );


          /* ========================================
             GET PLOT DATA
          ======================================== */

          const plot = {
            plotNumber:
              event.feature.getProperty(
                'plotNumber',
              ),

            plotType:
              event.feature.getProperty(
                'plotType',
              ),

            area:
              event.feature.getProperty(
                'area',
              ),

            areaSqM:
              event.feature.getProperty(
                'areaSqM',
              ),

            calculatedAreaSqM:
              event.feature.getProperty(
                'calculatedAreaSqM',
              ),

            price:
              event.feature.getProperty(
                'price',
              ),

            status:
              event.feature.getProperty(
                'status',
              ),

            cornerPlot:
              event.feature.getProperty(
                'cornerPlot',
              ),

            facing:
              event.feature.getProperty(
                'facing',
              ),

            roadWidth:
              event.feature.getProperty(
                'roadWidth',
              ),

            sourceType:
              event.feature.getProperty(
                'sourceType',
              ),

            featureType:
              event.feature.getProperty(
                'featureType',
              ),

            page:
              event.feature.getProperty(
                'page',
              ),
          };


          /* ========================================
             DEBUG
          ======================================== */

          console.log(
            'Selected plot:',
            plot,
          );


          console.log(
            'Area comparison:',
            {
              plotNumber:
                plot.plotNumber,

              extractedArea:
                plot.areaSqM,

              calculatedArea:
                plot.calculatedAreaSqM,

              difference:
                plot.calculatedAreaSqM !==
                  undefined &&
                plot.areaSqM !==
                  undefined
                  ? plot.calculatedAreaSqM -
                    plot.areaSqM
                  : null,
            },
          );


          /* ========================================
             SEND TO APP
          ======================================== */

          if (onPlotSelect) {
            onPlotSelect(plot);
          }
        },
      );


    /* ===============================================
       CLEANUP
    =============================================== */

    return () => {
      clickListener.remove();

      plotLayer.setMap(null);

      roadLayer.setMap(null);

      gardenLayer.setMap(null);

      amenityLayer.setMap(null);

      boundaryLayer.setMap(null);
    };
  }, [
    map,
    maps,
    geoJsonData,
    onPlotSelect,
  ]);


  /* ===============================================
     RENDER
  =============================================== */

  return (
    <>
      {plotLabels.map(
        label => (
          <PlotLabel
            key={label.id}
            position={
              label.position
            }
            text={label.text}
          />
        ),
      )}
    </>
  );
};


export default PlotMap;