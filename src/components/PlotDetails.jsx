// src/components/PlotDetails.jsx

import styles from './PlotDetails.module.css';

const PlotDetails = ({
  plot,
  onClose,
}) => {
  console.log(
    'PlotDetails received:',
    plot,
  );

  if (!plot) {
    return null;
  }

  return (
    <div className={styles.plotDetails}>

      {/* =====================================
          HEADER
      ===================================== */}

      <div className={styles.plotDetailsHeader}>

        <div>
          <div
            className={
              styles.plotDetailsLabel
            }
          >
            PLOT DETAILS
          </div>

          <h2>
            Plot {plot.plotNumber || '—'}
          </h2>
        </div>

        <button
          type="button"
          className={
            styles.plotDetailsClose
          }
          onClick={onClose}
          aria-label="Close plot details"
        >
          ×
        </button>

      </div>


      {/* =====================================
          CONTENT
      ===================================== */}

      <div
        className={
          styles.plotDetailsContent
        }
      >

        <DetailRow
          label="Plot Number"
          value={plot.plotNumber}
        />

        <DetailRow
          label="Plot Type"
          value={plot.plotType}
        />

        <DetailRow
          label="Area"
          value={
            plot.areaSqM
              ? `${Number(
                  plot.areaSqM,
                ).toFixed(2)} sq.m`
              : '—'
          }
        />

        <DetailRow
          label="Calculated Area"
          value={
            plot.calculatedAreaSqM
              ? `${Number(
                  plot.calculatedAreaSqM,
                ).toFixed(2)} sq.m`
              : '—'
          }
        />

        <DetailRow
          label="Status"
          value={plot.status}
        />

        <DetailRow
          label="Price"
          value={plot.price}
        />

        <DetailRow
          label="Corner Plot"
          value={plot.cornerPlot}
        />

        <DetailRow
          label="Facing"
          value={plot.facing}
        />

        <DetailRow
          label="Road Width"
          value={
            plot.roadWidth
              ? `${plot.roadWidth} ft`
              : '—'
          }
        />

        <DetailRow
          label="Source"
          value={plot.sourceType}
        />

        <DetailRow
          label="Page"
          value={plot.page}
        />

      </div>
    </div>
  );
};


/* =========================================
   DETAIL ROW
========================================= */

const DetailRow = ({
  label,
  value,
}) => {
  return (
    <div className={styles.detailRow}>

      <span className={styles.detailLabel}>
        {label}
      </span>

      <span className={styles.detailValue}>
        {value !== undefined &&
        value !== null &&
        value !== ''
          ? String(value)
          : '—'}
      </span>

    </div>
  );
};


export default PlotDetails;