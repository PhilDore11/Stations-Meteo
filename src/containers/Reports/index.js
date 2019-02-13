import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import moment from 'moment';
import { isEmpty, chain } from 'lodash';

import { Grid } from '@material-ui/core';
import { MultilineChartOutlined as IdfIcon, ListOutlined as TableIcon } from '@material-ui/icons';

import { grey, blue } from '@material-ui/core/colors';

import { fetchIdfData, fetchIdfStationData, setStation, setYear, setMonth } from '../actions';
import { ChartCard, ReportHeader, ReportTableCard } from '../../components';
import { StationContainer } from '..';

const chartColors = [grey[400], grey[500], grey[600]];

class ReportsContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleStationChange = this.handleStationChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
  }

  componentDidMount() {
    this.fetchIdfData();
  }
  componentDidUpdate(prevProps) {
    const { stationId, stationData } = this.props;

    if (stationId !== prevProps.stationId) {
      this.fetchIdfData();
    }

    if (stationData && stationData !== prevProps.stationData) {
      this.props.fetchIdfStationData(stationData);
    }
  }

  fetchIdfData() {
    const { stationId } = this.props;
    this.props.fetchIdfData(stationId);
  }

  handleStationChange(event) {
    this.props.setStation(event.target.value);
  }

  handleMonthChange(event) {
    this.props.setMonth(event.target.value);
  }

  handleYearChange(event) {
    this.props.setYear(event.target.value);
  }

  render() {
    const {
      clientStations,
      stationId,
      idfData,
      idfStationData,
      year,
      month,
      reportsError,
      clientStationsLoading,
      idfDataLoading,
      idfStationDataLoading,
    } = this.props;

    const idfChartData = {
      labels: ['5 mins', '10 mins', '15 mins', '30 mins', '1 hr', '2 hrs', '6 hrs', '12 hrs', '24hrs'],
      datasets:
        idfData &&
        chain(idfData)
          .map((data, index) => ({
            label: `${data.interval} ans`,
            fill: false,
            backgroundColor: chartColors[index % 3],
            borderColor: chartColors[index % 3],
            data: [
              data['5mins'] * 12,
              data['10mins'] * 6,
              data['15mins'] * 4,
              data['30mins'] * 2,
              data['1hr'],
              data['2hrs'] / 2,
              data['6hrs'] / 6,
              data['12hrs'] / 12,
              data['24hrs'] / 24,
            ],
          }))
          .unshift({
            label: 'Donnees mensuelles',
            fill: false,
            backgroundColor: blue[200],
            borderColor: blue[400],
            data: idfStationData.map(stationData => stationData.intensity * (60 / stationData.increment)),
          })
          .value(),
    };

    const idfChartOptions = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            type: 'logarithmic',
            ticks: {
              min: 0,
              max: 250,
              callback: value => Number(value.toString()),
            },
          },
        ],
      },
    };

    const currentYear = moment().year();
    const reportYears = [];
    [0, 1, 2, 3, 4, 5].forEach(index => reportYears.push(currentYear - index));

    const reportDate = moment()
      .year(year)
      .month(month);
    const start = moment(reportDate).startOf('month').toISOString();
    const end = moment(reportDate).endOf('month').toISOString();

    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <ReportHeader
            stations={clientStations}
            stationId={stationId}
            onStationChange={this.handleStationChange}
            years={reportYears}
            year={year}
            month={month}
            onYearChange={this.handleYearChange}
            onMonthChange={this.handleMonthChange}
          />
        </Grid>
        <Grid item xs={12}>
          <ChartCard
            type="line"
            title="IDF"
            icon={<IdfIcon />}
            hasData={!isEmpty(idfStationData)}
            data={idfChartData}
            options={idfChartOptions}
            error={reportsError}
            loading={clientStationsLoading || idfDataLoading || idfStationDataLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <ReportTableCard
            title="Tableau de donnees"
            icon={<TableIcon />}
            hasData={!isEmpty(idfStationData)}
            data={idfStationData}
            error={reportsError}
            loading={clientStationsLoading || idfDataLoading || idfStationDataLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <StationContainer stationId={stationId} start={start} end={end} />
        </Grid>
      </Grid>
    );
  }
}

ReportsContainer.propTypes = {
  fetchIdfData: PropTypes.func.isRequired,
  fetchIdfStationData: PropTypes.func.isRequired,
  fetchStationData: PropTypes.func.isRequired,
  idfData: PropTypes.array,
  idfStationData: PropTypes.array,
  clientStations: PropTypes.array,
  setStation: PropTypes.func.isRequired,
  stationId: PropTypes.string,
  stationData: PropTypes.array,
  setYear: PropTypes.func.isRequired,
  year: PropTypes.number,
  setMonth: PropTypes.func.isRequired,
  month: PropTypes.number,
  reportsError: PropTypes.bool,
  reportsLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  ...state.reports,
});

const mapDispatchToProps = {
  fetchIdfData,
  fetchIdfStationData,
  setStation,
  setYear,
  setMonth,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportsContainer);
