import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

import TableCronologia from './TableCronologia'
import { capitalize } from '../util/string'
import TextFecha from './TextFecha'
import { GET_PRESUPUESTO, GET_DATE } from '../util/query'
import SaveIcon from '@material-ui/icons/Save'
import CloseIcon from '@material-ui/icons/Close'
import { Query } from "react-apollo"
import { toLocaleString } from '../util/date'
import { POST_FECHA_FINAL } from '../util/mutation'
import { Mutation } from "react-apollo"


function getAvatarClass(habitacionTipo, classes){
  let firstLetter = habitacionTipo.charAt(0).toUpperCase();
  let classHabitacionTipo = classes.emptyAvatar;

  switch (firstLetter) {
    case "M":
      classHabitacionTipo = classes.blueAvatar;
      break;
    case "S":
      classHabitacionTipo = classes.purpleAvatar;
      break;
    case "D":
      classHabitacionTipo = classes.pinkAvatar;
      break;
  }

  return <Avatar className={classHabitacionTipo} style={{display: 'inline-grid'}}>{firstLetter}</Avatar>;
}

function getColor(habitacionTipo){
  let firstLetter = habitacionTipo.charAt(0).toUpperCase();
  let result = "#b3b3b3";
  switch (firstLetter) {
    case "M":
      result = "#3949ab";
      break;
    case "S":
      result = "#8e24aa";
      break;
    case "D":
      result = "#d81b60";
      break;
  }

  return result;
}

const styles = theme => ({
  paperWidthMd: {
    maxWidth: 750
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  blueAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#3949ab',
    width: 70,
    height: 70,
    fontSize: 35
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#8e24aa',
    width: 70,
    height: 70,
    fontSize: 35
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#d81b60',
    width: 70,
    height: 70,
    fontSize: 35
  },
  emptyAvatar: {
    margin: 10,
    width: 70,
    height: 70,
    fontSize: 35
  }
});

class DialogInformacion extends Component {
  constructor(props){
    super(props);

    this.state = {
      fechaFinal: new Date(this.props.habitacion.hospedaje.fechaFinal),
      presupuesto: null,
      showOptions: false,
      dateNow: null
    };

  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.fetchAndUpdateDateNow(),
      500
    );

    this.timerUpdateTextFechaFinalID = setInterval(
      () => this.tick(),
      500
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.timerUpdateTextFechaFinalID);
  }

  tick() {
    this.setState({
      fechaFinal: new Date(this.props.habitacion.hospedaje.fechaFinal)
    }, () => {
      this.fetchAndUpdatePresupuesto();
    });
  }

  handleFechaFinal = (event) => {
    clearInterval(this.timerUpdateTextFechaFinalID);
    let auxDate = new Date(event.target.value);
    this.setState({
      fechaFinal: new Date(
        auxDate.getFullYear(),
        auxDate.getMonth(),
        auxDate.getDate(),
        auxDate.getHours(),
        auxDate.getMinutes(),
        0
      ),
      showOptions: true
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
        fechaInicio: this.props.habitacion.hospedaje.fechaInicio,
        fechaFinal: this.state.fechaFinal
      }
    });
    this.setState({
      presupuesto: data.presupuesto
    });
  }

  fetchAndUpdateDateNow = async () => {
    const { client } = this.props;
    const { data } = await client.query({
      query: GET_DATE,
      fetchPolicy: 'no-cache'
    });
    let auxDate = new Date(data.date);
    this.setState({
      dateNow: new Date(
        auxDate.getFullYear(),
        auxDate.getMonth(),
        auxDate.getDate(),
        auxDate.getHours(),
        auxDate.getMinutes(),
        0
      )
    });
  }

  closeEdit = () => {
    this.setState({
      showOptions: false,
      presupuesto: null,
      fechaFinal: new Date(this.props.habitacion.hospedaje.fechaFinal)
    }, () => {
      this.fetchAndUpdatePresupuesto();
    });
    this.timerUpdateTextFechaFinalID = setInterval(
      () => this.tick(),
      500
    );
  }

  advancedCloseEdit = () => {
    this.setState({
      showOptions: false,
      presupuesto: null
    });
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  saveFechaFinal = () => {
    return (
      <Mutation
        mutation={POST_FECHA_FINAL}
      >
      {(funcSave, { data }) => (
        <Button
          variant="fab"
          mini
          color="primary"
          className={this.props.classes.button}
          onClick={e => {
            e.preventDefault();
            funcSave({ variables: {
              "habitacionNombre": this.props.habitacion.nombre,
              "fechaFinal": this.state.fechaFinal
            }});
            this.advancedCloseEdit();
          }}
        >
          <SaveIcon />
        </Button>
      )}
      </Mutation>
    );
  }

  render(){
    const {
      classes,
      showDialog,
      habitacion,
      handleClose,
      client
    } = this.props;

    let deuda = habitacion.hospedaje.cronologia.totalNeedsToBeCashed - habitacion.hospedaje.pago.total;

    const {
      cliente
    } = habitacion;

    return (
      <React.Fragment>
      <Dialog
        maxWidth="md"
        scroll="body"
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        classes={{
          paperWidthMd: classes.paperWidthMd
        }}
      >
        <DialogContent>
          <div style={{textAlign: 'center'}}>

            <br/>
            {
              getAvatarClass(habitacion.tipo, classes)
            }
            <Typography variant="headline" gutterBottom>
              {habitacion.nombre}
            </Typography>

            <br />

            <Typography variant="display1" gutterBottom>
              {capitalize(cliente.nombre + " " + cliente.apellidoPaterno + " " + cliente.apellidoMaterno)}
            </Typography>
            <TextFecha
              style={{width: 200, marginTop: 10, marginBottom: 10}}
              label="Fecha y Hora de Salida"
              handleChange={this.handleFechaFinal}
              fecha={this.state.fechaFinal}
            />

            {
              this.state.showOptions === true && (
                <React.Fragment>

                  {
                    this.state.dateNow !== null && this.state.fechaFinal > this.state.dateNow && this.saveFechaFinal()
                  }

                  <Button variant="fab" mini color="secondary" className={classes.button} onClick={this.closeEdit}>
                    <CloseIcon />
                  </Button>
                </React.Fragment>
              )
            }

          </div>
          <br />

          <TableCronologia
            total={this.state.presupuesto !== null?this.state.presupuesto.total:habitacion.hospedaje.cronologia.total}
            totalNeedsToBeCashed={this.state.presupuesto !== null?this.state.presupuesto.totalNeedsToBeCashed:habitacion.hospedaje.cronologia.totalNeedsToBeCashed}
            pagoTotal={habitacion.hospedaje.pago.total}
            cronologia={this.state.presupuesto !== null?this.state.presupuesto.detalle:habitacion.hospedaje.cronologia.detalle}
            habitacionNombre={habitacion.nombre}
            color={getColor(habitacion.tipo)}
          />

        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary">

            Salir

          </Button>
        </DialogActions>
      </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DialogInformacion);
