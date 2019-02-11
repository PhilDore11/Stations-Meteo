import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { Grid, TextField, MenuItem, Typography } from '@material-ui/core';

const ReportHeader = ({ stations, stationId, onStationChange, years, year, month, onYearChange, onMonthChange }) => (
  <Grid container spacing={24} alignItems="center">
    <Grid item xs={2}>
      <TextField select value={stationId} onChange={onStationChange} fullWidth margin="normal" variant="outlined">
        {stations && stations.map(station => (
          <MenuItem key={station.stationId} value={station.stationId}>
            {station.name}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
    <Grid item xs={2}></Grid>
    <Grid item xs>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h6">Rapport Mensuel</Typography>
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={2}>
      <TextField select value={month} onChange={onMonthChange} fullWidth margin="normal" variant="outlined">
        {moment.months().map((month, index) => (
          <MenuItem key={index} value={index}>
            {month}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
    <Grid item xs={2}>
      <TextField select value={year} onChange={onYearChange} fullWidth margin="normal" variant="outlined">
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  </Grid>
);

ReportHeader.propTypes = {
  stations: PropTypes.array.isRequired,
  stationId: PropTypes.string,
  onStationChange: PropTypes.func.isRequired,
  years: PropTypes.array,
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func.isRequired,
};

export default ReportHeader;
