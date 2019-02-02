import React from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  TextField
} from "@material-ui/core";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

const ClientForm = ({ classes, client, onChange }) => (
  <form noValidate autoComplete="off">
    <TextField
      className={classes.textField}
      autoFocus
      id="name"
      label="Nom"
      type="text"
      margin="normal"
      variant="outlined"
      value={client.name}
      onChange={(event) => onChange(event, client)}
      />
    <TextField
      className={classes.textField}
      id="email"
      label="Addresse courriel"
      type="email"
      margin="normal"
      variant="outlined"
      value={client.email}
      onChange={(event) => onChange(event, client)}
    />
  </form>
);

ClientForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  client: PropTypes.object,
};

export default React.memo(withStyles(styles)(ClientForm));