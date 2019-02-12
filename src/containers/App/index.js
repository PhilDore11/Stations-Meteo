import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import { CssBaseline } from '@material-ui/core';

import {
  LoginContainer,
  HeaderContainer,
  HomeContainer,
  DashboardContainer,
  MapContainer,
  ClientsContainer,
  ReportsContainer,
} from '../';

import { Alert, Sidebar } from '../../components';

import { fetchClientStations, resetAlerts } from '../actions';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

class App extends React.PureComponent {
  componentDidMount() {
    this.fetchClientStations();
  }
  componentDidUpdate(prevProps) {
    if (this.props.loggedInUser !== prevProps.loggedInUser) {
      this.fetchClientStations();
    }
  }
  
  fetchClientStations() {
    const { loggedInUser } = this.props;
    if (loggedInUser) {
      const clientId = loggedInUser.clients[0].id;
      this.props.fetchClientStations(clientId);
    }
  }


  privateRouteRender(loggedInUser, container) {
    return () => (loggedInUser ? container : <Redirect to="/login" />);
  }

  getAlertVariant() {
    if (this.props.success) return 'success';
    if (this.props.warning) return 'warning';
    if (this.props.error) return 'error';
    return 'info';
  }

  render() {
    const { classes, loggedInUser, message } = this.props;

    return (
      <React.Fragment>
        {message && <Alert variant={this.getAlertVariant()} message={message} resetAlerts={this.props.resetAlerts} />}
        <Router>
          <div className={classes.root}>
            <CssBaseline />
            <HeaderContainer />
            {loggedInUser && <Sidebar isAdmin={loggedInUser.admin ? true : false} />}
            <div className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() =>
                    loggedInUser ? (
                      <Redirect to={loggedInUser.admin ? '/clients' : '/home'} />
                    ) : (
                      <Redirect to="/login" />
                    )
                  }
                />
                <Route
                  path="/login"
                  render={() =>
                    loggedInUser ? <Redirect to={loggedInUser.admin ? '/clients' : '/home'} /> : <LoginContainer />
                  }
                />{' '}
                />
                <Route path="/home" render={this.privateRouteRender(loggedInUser, <HomeContainer />)} />
                <Route path="/dashboard" render={this.privateRouteRender(loggedInUser, <DashboardContainer />)} />
                <Route path="/reports" render={this.privateRouteRender(loggedInUser, <ReportsContainer />)} />
                <Route path="/map" render={this.privateRouteRender(loggedInUser, <MapContainer />)} />
                <Route path="/clients" render={this.privateRouteRender(loggedInUser, <ClientsContainer />)} />
              </Switch>
            </div>
          </div>
        </Router>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  loggedInUser: PropTypes.object,
  resetAlerts: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  ...state.app,
  ...state.login,
});

const mapDispatchToProps = {
  fetchClientStations,
  resetAlerts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(App));
