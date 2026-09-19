// src/utils/featureStyles.js

export const getPlotStyle = feature => {
  const status = feature.getProperty('status');

  // Default plot
  let fillColor = '#22c55e';
  let strokeColor = '#166534';

  // Available
  if (status === 'available') {
    fillColor = '#22c55e';
    strokeColor = '#166534';
  }

  // Hold
  else if (status === 'hold') {
    fillColor = '#f59e0b';
    strokeColor = '#92400e';
  }

  // Sold
  else if (status === 'sold') {
    fillColor = '#ef4444';
    strokeColor = '#991b1b';
  }

  // Reserved
  else if (status === 'reserved') {
    fillColor = '#8b5cf6';
    strokeColor = '#6d28d9';
  }

  return {
    fillColor,
    fillOpacity: 0.35,
    strokeColor,
    strokeOpacity: 0.9,
    strokeWeight: 1.5,
    clickable: true,
  };
};

export const getRoadStyle = () => {
  return {
    strokeColor: '#475569',
    strokeOpacity: 0.9,
    strokeWeight: 4,
    clickable: false,
  };
};

export const getGardenStyle = () => {
  return {
    fillColor: '#16a34a',
    fillOpacity: 0.35,
    strokeColor: '#15803d',
    strokeOpacity: 0.9,
    strokeWeight: 2,
    clickable: false,
  };
};

export const getAmenityStyle = () => {
  return {
    fillColor: '#6366f1',
    fillOpacity: 0.35,
    strokeColor: '#4338ca',
    strokeOpacity: 0.9,
    strokeWeight: 2,
    clickable: false,
  };
};

export const getBoundaryStyle = () => {
  return {
    strokeColor: '#374151',
    strokeOpacity: 0.55,
    strokeWeight: 1,
    clickable: false,
  };
};