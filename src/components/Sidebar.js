import React from "react";
import PropTypes from "prop-types";

import { Link, withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';

import {
  HomeOutlined as HomeIcon,
  DashboardOutlined as DashboardIcon,
  MapOutlined as MapIcon,
  PeopleOutlined as PeopleIcon,
} from '@material-ui/icons';

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  menuLink: {
    textDecoration: 'none'
  },
  sidebarTitle: {
    backgroundColor: theme.palette.background.default
  }
});

const clientSidebarItems = [
  { 
    icon: <HomeIcon />,
    label: 'Acceuil',
    location: '/home' },
  {
    icon: <DashboardIcon />,
    label: 'Analyse',
    location: '/dashboard'
  },
  { 
    icon: <MapIcon />,
    label: 'Map',
    location: '/map'
  },
];

const adminSidebarItems = [
  { 
    icon: <PeopleIcon />,
    label: 'Clients',
    location: '/clients',
  },
];

const Sidebar = ({ classes, isAdmin, sidebarItems = isAdmin ? adminSidebarItems : clientSidebarItems, location }) => (
  <Drawer
    className={classes.drawer}
    variant='permanent'
    classes={{
      paper: classes.drawerPaper
    }}
    anchor='left'
  >
    <div className={classes.toolbar} />
    <Divider />
    <List>
      {sidebarItems.map((item, index) => (
        <Link key={index} to={item.location} className={classes.menuLink}>
          <ListItem button selected={item.location === location.pathname}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        </Link>
      ))}
    </List>
  </Drawer>
);

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default React.memo(withStyles(styles)(withRouter(Sidebar)));
