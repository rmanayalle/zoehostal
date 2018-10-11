import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {ToLocaleString, ToDate} from '../util/date'
import {WithTwoDecimal} from '../util/number'

const TableCellTotalMount = withStyles(theme => ({
  body: {
    fontSize: 26,
    fontWeight: 300
  },
}))(TableCell);

const TableCellTotalText = withStyles(theme => ({
  body: {
    fontSize: 20,
    fontWeight: 500
  },
}))(TableCell);

const TableCellHeadText = withStyles(theme => ({
  head: {
    fontSize: 20,
    fontWeight: 300
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 800,
  },
  cellTotal: {
    borderBottomStyle: 'none',
    paddingTop: 15
  },
});

class TablePresupuesto extends Component {

  render(){
    const {
      classes,
      presupuesto
    } = this.props;

    return (
      <React.Fragment>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCellHeadText>Inicio</TableCellHeadText>
              <TableCellHeadText>Final</TableCellHeadText>
              <TableCellHeadText numeric>Precio</TableCellHeadText>
            </TableRow>
          </TableHead>
        <TableBody>
            {
              presupuesto.detalle.map(item => (
                <TableRow>
                  <TableCell component="th" scope="row">{ToLocaleString(ToDate(item.fechaInicio))}</TableCell>
                  <TableCell>{ToLocaleString(ToDate(item.fechaFinal))}</TableCell>
                  <TableCell numeric>{'S/ ' + WithTwoDecimal(item.precio)}</TableCell>
                </TableRow>
              ))
            }
            <TableRow>
              <TableCell className={classes.cellTotal}></TableCell>
              <TableCellTotalText numeric className={classes.cellTotal}>Total</TableCellTotalText>
              <TableCellTotalMount numeric className={classes.cellTotal}>{'S/ ' + WithTwoDecimal(presupuesto.total)}</TableCellTotalMount>
            </TableRow>
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TablePresupuesto)
