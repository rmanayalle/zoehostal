import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Query } from "react-apollo";

import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { withTwoDecimal } from '../util/number'
import { GET_CAJA } from '../util/query'

import Button from '@material-ui/core/Button'
import MessageIcon from '@material-ui/icons/Message'

import DialogAsunto from './DialogAsunto'

const TableCellTotalMount = withStyles(theme => ({
  body: {
    fontSize: 26,
    fontWeight: 300,
    minWidth: 150
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
  table: {
    maxWidth: 500
  },
  cellTotal: {
    borderBottomStyle: 'none',
    paddingTop: 15
  },
  cellDivider: {
    borderTop: '2px inset #b3b3b3'
  },
  cellExpand: {
    borderBottomStyle: 'none',
    textAlign: 'center'
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  }
});

class ListCaja extends Component {
  constructor(props){
    super(props);
    this.state = {
      showDialogAsunto: false
    };
  }

  handleOpen = () => {
    this.setState({
      showDialogAsunto: true
    });
  }

  handleClose = () => {
    this.setState({
      showDialogAsunto: false
    })
  }

  render(){
    const {
      classes
    } = this.props;

    return (
      <React.Fragment>
        <Query query={GET_CAJA} variables={{
          "isClosed": false
        }} pollInterval={500}>
          {
            ({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              var filas = [];
              data.caja[0].historia.hospedaje.map(hospedaje => {
                filas.push({
                  fecha: hospedaje.fecha,
                  asunto: 'Pago de la habitación ' + hospedaje.habitacion.nombre,
                  monto: hospedaje.monto
                });
              });

              data.caja[0].historia.otro.map(otro => {
                filas.push({
                  fecha: otro.fecha,
                  asunto: otro.asunto,
                  monto: otro.monto
                });
              });

              filas.sort((a, b) => a.fecha - b.fecha);

              return (
                <React.Fragment>
                  <br />
                  <div style={{
                    textAlign: 'center'
                  }}>
                    <Button variant="fab" mini color="primary" className={classes.button} onClick={this.handleOpen}>
                      <MessageIcon />
                    </Button>
                  </div>

                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCellHeadText>Descripción</TableCellHeadText>
                        <TableCellHeadText numeric>Monto</TableCellHeadText>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        filas.map((fila, index) => (
                          <TableRow key={index} className={classes.row}>
                            <TableCell component="th" scope="row">
                              {fila.asunto}
                            </TableCell>
                            <TableCell numeric style={{
                              color: fila.monto < 0 && '#f44336'
                            }}>{(fila.monto > 0)?'S/ ' +  withTwoDecimal(fila.monto):'- S/ ' + withTwoDecimal(fila.monto*-1)}</TableCell>
                          </TableRow>
                        ))
                      }
                      <TableRow>
                        <TableCellTotalText numeric className={classes.cellTotal}>
                          Movimiento
                        </TableCellTotalText>
                        <TableCellTotalMount numeric className={classes.cellTotal}>{'S/ ' +  withTwoDecimal(data.caja[0].historia.total)}</TableCellTotalMount>
                      </TableRow>
                      <TableRow>
                        <TableCellTotalText numeric className={classes.cellTotal}>
                          Inicial
                        </TableCellTotalText>
                        <TableCellTotalMount numeric className={classes.cellTotal}>{'S/ ' +  withTwoDecimal(data.caja[0].inicial)}</TableCellTotalMount>
                      </TableRow>
                      <TableRow>
                        <TableCellTotalText numeric className={classes.cellTotal}>
                          Total
                        </TableCellTotalText>
                        <TableCellTotalMount numeric className={classes.cellTotal} style={{
                          backgroundColor: '#fafafa',
                          paddingBottom: 12,
                          color: 'black',
                          borderTop: '1px solid rgba(224, 224, 224, 1)',
                          borderBottom: '1px solid rgba(224, 224, 224, 1)'
                        }}>{'S/ ' +  withTwoDecimal(data.caja[0].historia.total + data.caja[0].inicial)}</TableCellTotalMount>
                      </TableRow>
                    </TableBody>
                  </Table>
                  {
                    this.state.showDialogAsunto === true && (
                      <DialogAsunto
                        showDialog={this.state.showDialogAsunto}
                        handleClose={this.handleClose}
                      />
                    )
                  }

                </React.Fragment>
              );
            }
          }
        </Query>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListCaja);
