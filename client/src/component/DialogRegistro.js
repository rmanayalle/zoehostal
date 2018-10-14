import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import { GET_PRESUPUESTO } from '../util/query'
import { POST_RENT } from '../util/mutation'
import TextNumber from './TextNumber'
import TextFecha from './TextFecha'
import TablePresupuesto from './TablePresupuesto'
import { withCheckFormat, plusOneDay } from '../util/date'
import { Mutation } from "react-apollo";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class DialogRegistro extends Component {

  constructor(props){
    super(props);

    this.state = {
      documentoNacional: "",
      fechaInicio: new Date(),
      fechaFinal: withCheckFormat(plusOneDay(new Date()), this.props.checkOut),
      presupuesto : null
    };

    this.fetchAndUpdatePresupuesto();
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000*30
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      fechaInicio: new Date()
    }, () => {
      this.fetchAndUpdatePresupuesto();
    });
  }

  handleDocumentoNacional = (event) => {
    this.setState({
      documentoNacional: event.target.value
    });
  }

  handleFechaFinal = (event) => {
    this.setState({
      fechaFinal: new Date(event.target.value)
    }, () => {
      this.fetchAndUpdatePresupuesto();
    });
  }

  fetchAndUpdatePresupuesto = async () => {
    const { client } = this.props;
    const { data } = await client.query({
      query: GET_PRESUPUESTO,
      variables: {
        tarifa: this.props.habitacion.tarifa,
        fechaInicio: this.state.fechaInicio,
        fechaFinal: this.state.fechaFinal
      }
    });
    this.setState({
      presupuesto: data.presupuesto
    });
  }

  rent = () => {
    return (
      <Mutation mutation={POST_RENT}>
      {(funcRent, { data }) => (
        <Button
          onClick={e => {
            e.preventDefault();
            funcRent({ variables: {
              "habitacionNombre": this.props.habitacion.nombre,
              "documentoNacional": this.state.documentoNacional,
              "fechaFinal": this.state.fechaFinal
            } });
            this.props.handleClose();
          }}
          color="primary">

          Registrar

        </Button>
      )}
      </Mutation>
    );
  }

  render() {

    const {
      classes,
      showDialog,
      handleClose
    } = this.props;

    return (
      <React.Fragment>
        <Dialog
          maxWidth="md"
          scroll="body"
          open={showDialog}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle
            id="form-dialog-title">
            Registro
          </DialogTitle>
          <DialogContent>
            <TextNumber
              style={{width: 245, marginTop: 10, marginBottom: 10}}
              label="Documento Nacional de Identidad"
              autoFocus
              number={this.state.documentoNacional}
              handleChange={this.handleDocumentoNacional}
            />
            <br />
            <TextFecha
              style={{width: 245, marginTop: 10, marginBottom: 10}}
              label="Fecha y Hora de Salida"
              fecha={this.state.fechaFinal}
              handleChange={this.handleFechaFinal}
            />
            {
              this.state.presupuesto !== null && (
                <TablePresupuesto
                  presupuesto={this.state.presupuesto}
                />
              )
            }
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="secondary">

              Cancelar

            </Button>
            {
              this.rent()
            }
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DialogRegistro);
