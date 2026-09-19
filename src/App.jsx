// // import {useState} from 'react';
// // import PlotMap from './components/PlotMap';
// // import GeoJsonUploader from './components/GeoJsonUploader';
// // import PlotDetails from './components/PlotDetails';

// // import './App.css';

// // function App() {
// //   const [geoJsonData, setGeoJsonData] = useState(null);
// //   const [selectedPlot, setSelectedPlot] = useState(null);

// //   return (
// //     <div className="app">
// //       <div className="topbar">
// //         <h2>Plot Layout Editor</h2>

// //         <GeoJsonUploader onLoad={setGeoJsonData} />
// //       </div>

// //       <PlotMap
// //         geoJsonData={geoJsonData}
// //         onPlotSelect={setSelectedPlot}
// //       />

// //       <PlotDetails
// //         plot={selectedPlot}
// //         onClose={() => setSelectedPlot(null)}
// //       />
// //     </div>
// //   );
// // }

// // export default App;

// import { useState } from 'react';

// import GeoJsonUploader from './components/GeoJsonUploader';
// import PlotMap from './components/PlotMap';
// import PlotDetails from './components/PlotDetails';

// import './App.css';

// const App = () => {
//   const [geoJsonData, setGeoJsonData] = useState(null);
//   const [selectedPlot, setSelectedPlot] = useState(null);

//   return (
//     <div className="app">
//       <div className="map-container">

//         <div className="map-toolbar">
//           <GeoJsonUploader
//             onLoad={setGeoJsonData}
//           />
//         </div>

//         <PlotMap
//           geoJsonData={geoJsonData}
//           onPlotSelect={setSelectedPlot}
//         />

//         <PlotDetails
//           plot={selectedPlot}
//           onClose={() => setSelectedPlot(null)}
//         />

//       </div>
//     </div>
//   );
// };

// export default App;

// src/App.jsx

import { useState } from 'react';

import GeoJsonUploader from './components/GeoJsonUploader';
import PlotMap from './components/PlotMap';
import PlotDetails from './components/PlotDetails';

import './App.css';

const App = () => {
  const [geoJsonData, setGeoJsonData] =
    useState(null);

  const [selectedPlot, setSelectedPlot] =
    useState(null);

  const handlePlotSelect = plot => {
    console.log(
      'APP - Selected Plot:',
      plot,
    );

    setSelectedPlot(plot);
  };

  const handleCloseDetails = () => {
    console.log(
      'APP - Closing plot details',
    );

    setSelectedPlot(null);
  };

  return (
    <div className="app">
      <div className="map-container">

        {/* =====================================
            GEOJSON IMPORT
        ===================================== */}

        <div className="map-toolbar">
          <GeoJsonUploader
            onLoad={setGeoJsonData}
          />
        </div>

        {/* =====================================
            MAP
        ===================================== */}

        <PlotMap
          geoJsonData={geoJsonData}
          onPlotSelect={handlePlotSelect}
        />

        {/* =====================================
            PLOT DETAILS
        ===================================== */}

        <PlotDetails
          plot={selectedPlot}
          onClose={handleCloseDetails}
        />

      </div>
    </div>
  );
};

export default App;