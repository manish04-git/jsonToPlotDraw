// // src/components/PlotLabel.jsx

// import {
//   useEffect,
//   useRef,
// } from 'react';

// import {
//   useMap,
//   useMapsLibrary,
// } from '@vis.gl/react-google-maps';

// const PlotLabel = ({
//   position,
//   text,
// }) => {
//   const map = useMap();

//   const markerLibrary =
//     useMapsLibrary('marker');

//   const markerRef =
//     useRef(null);

//   useEffect(() => {
//     if (
//       !map ||
//       !markerLibrary ||
//       !position ||
//       !text
//     ) {
//       return;
//     }

//     const {
//       AdvancedMarkerElement,
//     } = markerLibrary;

//     // ==========================================
//     // CREATE LABEL ELEMENT
//     // ==========================================

//     const label =
//       document.createElement('div');

//     label.textContent = text;

//     label.style.cssText = `
//       background: rgba(255, 255, 255, 0.92);
//       color: #111827;
//       border: 1px solid #d1d5db;
//       border-radius: 5px;
//       padding: 3px 7px;
//       font-size: 12px;
//       font-weight: 700;
//       line-height: 1.2;
//       white-space: nowrap;
//       box-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
//       pointer-events: none;
//       transform: translateY(-50%);
//     `;

//     // ==========================================
//     // CREATE MARKER
//     // ==========================================

//     const marker =
//       new AdvancedMarkerElement({
//         map,
//         position,
//         content: label,
//         zIndex: 10,
//       });

//     markerRef.current = marker;

//     // ==========================================
//     // CLEANUP
//     // ==========================================

//     return () => {
//       marker.map = null;
//       markerRef.current = null;
//     };
//   }, [
//     map,
//     markerLibrary,
//     position,
//     text,
//   ]);

//   return null;
// };

// export default PlotLabel;


// src/components/PlotLabel.jsx

import {
  useEffect,
  useRef,
} from 'react';

import {
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

const PlotLabel = ({
  position,
  text,
}) => {
  const map = useMap();

  const markerLibrary =
    useMapsLibrary('marker');

  const markerRef =
    useRef(null);

  useEffect(() => {
    if (
      !map ||
      !markerLibrary ||
      !position ||
      !text
    ) {
      return;
    }

    const {
      AdvancedMarkerElement,
    } = markerLibrary;

    // ==========================================
    // CREATE LABEL
    // ==========================================

    const label =
      document.createElement('div');

    label.textContent = text;

    label.style.cssText = `
      background: rgba(255, 255, 255, 0.92);
      color: #111827;
      border: 1px solid #d1d5db;
      border-radius: 5px;
      padding: 3px 7px;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
      white-space: nowrap;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
      pointer-events: none;
      transform: translateY(-50%);
    `;

    // ==========================================
    // CREATE MARKER
    // ==========================================

    const marker =
      new AdvancedMarkerElement({
        map,
        position,
        content: label,
        zIndex: 10,
      });

    markerRef.current = marker;

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      marker.map = null;
      markerRef.current = null;
    };
  }, [
    map,
    markerLibrary,
    position,
    text,
  ]);

  return null;
};

export default PlotLabel;