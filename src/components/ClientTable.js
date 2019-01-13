import React from "react";
import PropTypes from "prop-types";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";

const ClientTable = ({ clients }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Name</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {clients.map(client => (
        <TableRow key={client.id}>
          <TableCell>{client.id}</TableCell>
          <TableCell>{client.name}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

ClientTable.propTypes = {
  clients: PropTypes.array.isRequired
};

export default ClientTable;
