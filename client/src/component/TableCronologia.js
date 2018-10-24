import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {toLocaleString, toDate} from '../util/date'
import {withTwoDecimal} from '../util/number'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PaymentIcon from '@material-ui/icons/Payment'
import DialogPay from './DialogPay'


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
    minWidth: 700
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
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class TableCronologia extends Component {

  constructor(props){
    super(props);

    this.state = {
      showNotNeedsToBeCashed: false,
      showDialogPay: false
    };
  }

  handleOpen = (habitacion) => {
    this.setState({
      showDialogPay: true
    });
  }

  handleClose = () => {
    this.setState({
      showDialogPay: false
    });
  }

  handleToggle = () => {
    this.setState({
      showNotNeedsToBeCashed: !this.state.showNotNeedsToBeCashed
    });
  }

  render(){
    const {
      classes,
      total,
      totalNeedsToBeCashed,
      pagoTotal,
      cronologia,
      habitacionNombre,
      color
    } = this.props;

    let pTotal = (this.state.showNotNeedsToBeCashed === true)?total:totalNeedsToBeCashed;
    let deuda = pTotal - pagoTotal;
    let showExpand = !(totalNeedsToBeCashed === total);
    if(deuda < 0)deuda = 0;

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
              cronologia.map((item, index, arr) => {
                if(item.needsToBeCashed === true || this.state.showNotNeedsToBeCashed === true){
                  if(
                    (index !== 0 && arr[index-1].needsToBeCashed !== item.needsToBeCashed) ||
                    (index === 0 && item.needsToBeCashed === false)
                  ){
                    return (
                      <TableRow key={index} className={classes.row}>
                        <TableCell component="th" scope="row" className={classes.cellDivider} style={{borderTopColor: color}}>{toLocaleString(toDate(item.fechaInicio))}</TableCell>
                        <TableCell className={classes.cellDivider} style={{borderTopColor: color}}>{toLocaleString(toDate(item.fechaFinal))}</TableCell>
                        <TableCell numeric className={classes.cellDivider} style={{borderTopColor: color}}>{'S/ ' + withTwoDecimal(item.precio)}</TableCell>
                      </TableRow>
                    );
                  }
                  else return (
                    <TableRow key={index} className={classes.row}>
                      <TableCell component="th" scope="row">{toLocaleString(toDate(item.fechaInicio))}</TableCell>
                      <TableCell>{toLocaleString(toDate(item.fechaFinal))}</TableCell>
                      <TableCell numeric>{'S/ ' + withTwoDecimal(item.precio)}</TableCell>
                    </TableRow>
                  );
                }
              })
            }
            <TableRow>
              <TableCell className={classes.cellExpand}></TableCell>
              <TableCell className={classes.cellExpand}>
                {
                  showExpand === true && (
                    <Checkbox
                      checked={this.state.showNotNeedsToBeCashed}
                      onChange={this.handleToggle}
                      icon={<ExpandMoreIcon />}
                      checkedIcon={<ExpandLessIcon />}
                    />
                  )
                }
              </TableCell>
              <TableCell className={classes.cellExpand}>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className={classes.cellTotal}></TableCell>
              <TableCellTotalText numeric className={classes.cellTotal}>
                Total
              </TableCellTotalText>
              <TableCellTotalMount numeric className={classes.cellTotal}>{'S/ ' + withTwoDecimal(pTotal)}</TableCellTotalMount>
            </TableRow>
            <TableRow>
              <TableCell className={classes.cellTotal}></TableCell>
              <TableCellTotalText numeric className={classes.cellTotal}>
                <Button variant="fab" mini color="primary" className={classes.button} onClick={this.handleOpen}>
                  <PaymentIcon />
                </Button>
                A Cuenta
              </TableCellTotalText>
              <TableCellTotalMount numeric className={classes.cellTotal}>{'S/ ' + withTwoDecimal(pagoTotal)}</TableCellTotalMount>
            </TableRow>
            <TableRow>
              <TableCell className={classes.cellTotal}></TableCell>
              <TableCellTotalText numeric className={classes.cellTotal}>Deuda</TableCellTotalText>
              <TableCellTotalMount numeric className={classes.cellTotal} style={(deuda > 0?{
                backgroundColor: '#fafafa',
                paddingBottom: 12,
                color: 'black',
                borderTop: '1px solid rgba(224, 224, 224, 1)',
                borderBottom: '1px solid rgba(224, 224, 224, 1)'
              }:{
                backgroundColor: '#fafafa',
                paddingBottom: 12,
                color: 'black',
                borderTop: '1px solid rgba(224, 224, 224, 1)',
                borderBottom: '1px solid rgba(224, 224, 224, 1)'
              })}>{'S/ ' + withTwoDecimal(deuda)}</TableCellTotalMount>
            </TableRow>
          </TableBody>
        </Table>
        {
          this.state.showDialogPay === true && (
            <DialogPay
              showDialog={this.state.showDialogPay}
              handleClose={this.handleClose}
              initAmount={deuda}
              habitacionNombre={habitacionNombre}
            />
          )
        }
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TableCronologia)
