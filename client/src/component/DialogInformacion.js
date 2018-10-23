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
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import { Query } from "react-apollo"
import { toLocaleString } from '../util/date'
import { POST_FECHA_FINAL, POST_FREE } from '../util/mutation'
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
      date: null,
      isLiberar: false
    };

  }

  componentDidMount() {
    this.timerUpdateDate = setInterval(
      async () => await this.fetchAndUpdateDate(),
      500
    );

    this.timerUpdateTextFechaFinalID = setInterval(
      async () => await this.tick(),
      500
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerUpdateDate);
    clearInterval(this.timerUpdateTextFechaFinalID);
    clearInterval(this.timerLiberarID);
  }

  async tick() {
    await this.setState({
      fechaFinal: new Date(this.props.habitacion.hospedaje.fechaFinal)
    }, async () => {
      await this.fetchAndUpdatePresupuesto();
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
    }, async () => {
      await this.fetchAndUpdatePresupuesto();
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
      },
      fetchPolicy: 'no-cache'
    });
    this.setState({
      presupuesto: data.presupuesto
    });
  }

  fetchAndUpdateDate = async () => {
    const { client } = this.props;
    const { data } = await client.query({
      query: GET_DATE,
      fetchPolicy: 'no-cache'
    });
    let auxDate = new Date(data.date);
    this.setState({
      date: new Date(
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
    }, async () => {
      await this.fetchAndUpdatePresupuesto();
    });
    this.timerUpdateTextFechaFinalID = setInterval(
      async () => await this.tick(),
      500
    );
  }

  advancedCloseEdit = () => {
    this.setState({
      showOptions: false,
      presupuesto: null
    });
    this.timerUpdateTextFechaFinalID = setInterval(
      async () => await this.tick(),
      500
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

  free = () => {
    return (
      <Mutation
        mutation={POST_FREE}
      >
      {(funcFree, { data }) => (
        <Button
          onClick={null}
          color="primary"
          onClick={e => {
            e.preventDefault();
            funcFree({ variables: {
              "habitacionNombre": this.props.habitacion.nombre
            }});
            this.props.handleClose();
          }}
        >

          Finalizar
        </Button>
      )}
      </Mutation>
    );
  }

  handleLiberar = async () => {
    clearInterval(this.timerUpdateTextFechaFinalID);
    const { client } = this.props;
    const { data } = await client.query({
      query: GET_PRESUPUESTO,
      variables: {
        tarifa: this.props.habitacion.tarifa,
        fechaInicio: this.props.habitacion.hospedaje.fechaInicio,
        fechaFinal: this.state.date
      },
      fetchPolicy: 'no-cache'
    });
    await this.setState({
      presupuesto: data.presupuesto
    });

    await this.setState({
      isLiberar: true,
      showOptions: false
    }, () => {
      this.timerLiberarID = setInterval(
        async () => {
          const { client } = this.props;
          const { data } = await client.query({
            query: GET_PRESUPUESTO,
            variables: {
              tarifa: this.props.habitacion.tarifa,
              fechaInicio: this.props.habitacion.hospedaje.fechaInicio,
              fechaFinal: this.state.date
            },
            fetchPolicy: 'no-cache'
          });
          await this.setState({
            presupuesto: data.presupuesto
          });
        },
        500
      );
    });

  }

  handleLiberarClose = async () => {
    clearInterval(this.timerLiberarID);
    await this.setState({
      isLiberar: false,
      presupuesto: null,
      fechaFinal: new Date(this.props.habitacion.hospedaje.fechaFinal)
    }, async () => {
      await this.fetchAndUpdatePresupuesto();
    });
    this.timerUpdateTextFechaFinalID = setInterval(
      async () => await this.tick(),
      500
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

            {
              this.state.isLiberar === false && (
                <TextFecha
                  style={{width: 200, marginTop: 10, marginBottom: 10}}
                  label="Fecha y Hora de Salida"
                  handleChange={this.handleFechaFinal}
                  fecha={this.state.fechaFinal}
                />
              )
            }

            {
              this.state.isLiberar === false && this.state.showOptions === true && (
                <React.Fragment>

                  {
                    this.state.date !== null && this.state.fechaFinal > this.state.date && this.saveFechaFinal()
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
        {
          this.state.isLiberar === false && (
            <Button
              onClick={handleClose}
              color="secondary">

              Salir

            </Button>
          )
        }
        {
          this.state.isLiberar === true && (
            <Button
              onClick={this.handleLiberarClose}
              color="secondary">
              <NavigateBeforeIcon />
              Atrás
            </Button>
          )
        }
        {
          this.state.isLiberar === false && (
            <Button
              onClick={this.handleLiberar}
              color="primary">

              Liberar
              <NavigateNextIcon />
            </Button>
          )
        }
        {
          this.state.isLiberar === true && this.free()
        }
        </DialogActions>
      </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DialogInformacion);
