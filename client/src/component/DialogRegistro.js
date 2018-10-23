import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'

import { GET_PRESUPUESTO, GET_CLIENTE } from '../util/query'
import { POST_RENT } from '../util/mutation'
import TextNumber from './TextNumber'
import TextFecha from './TextFecha'
import TablePresupuesto from './TablePresupuesto'
import { withCheckFormat, plusOneDay } from '../util/date'
import { Mutation } from "react-apollo"
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { capitalize } from '../util/string'
import CircularProgress from '@material-ui/core/CircularProgress'
import EditIcon from '@material-ui/icons/Edit'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import Chip from '@material-ui/core/Chip'
import DialogRegistroCliente from './DialogRegistroCliente'
import Checkbox from '@material-ui/core/Checkbox'
import AlarmIcon from '@material-ui/icons/Alarm'
import AlarmOnIcon from '@material-ui/icons/AlarmOn'
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';


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

class DialogRegistro extends Component {

  constructor(props){
    super(props);

    this.state = {
      showDialogRegistroCliente: false,
      documentoNacional: "",
      enabledDocumentoNacional: true,
      nombreCliente: null,
      fechaFinal: withCheckFormat(plusOneDay(new Date()), this.props.checkOut),
      presupuesto : null,
      plus4Hours: false,
      enabledTextFechaFinal: true
    };

    this.fetchAndUpdatePresupuesto();
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      500
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.timerPlus4HoursID);
  }

  tick() {
    this.fetchAndUpdatePresupuesto();
  }

  handleDocumentoNacional = (event) => {
    if(event.target.value.length <= 8)
      this.setState({
        documentoNacional: event.target.value
      }, () => {
        if(this.state.documentoNacional.length === 8)
          this.setState({
            enabledDocumentoNacional: false
          }, () => {
            this.fetchNombre();
          });
      });

  }

  handlePlus4Hours = () => {
    this.setState({
      plus4Hours: !this.state.plus4Hours,
      enabledTextFechaFinal: !this.state.enabledTextFechaFinal
    }, async () => {
      if(this.state.enabledTextFechaFinal === false){
        this.timerPlus4HoursID = setInterval(
          async () => {
            let dateNow = new Date();
            let datePlus4 = new Date(dateNow.getTime() + 4*60*60*1000);
            await this.setState({
              fechaFinal: datePlus4
            });
          },
          500
        );
      }
      else {
        await this.setState({
          fechaFinal: withCheckFormat(plusOneDay(new Date()), this.props.checkOut)
        });
        clearInterval(this.timerPlus4HoursID);
      }
    });



  }

  handleFechaFinal = (event) => {
    this.setState({
      fechaFinal: new Date(event.target.value)
    }, () => {
      this.fetchAndUpdatePresupuesto();
    });
  }

  activeDocumentoNacional = () => {
    this.setState({
      enabledDocumentoNacional: true,
      nombreCliente: null
    });
  }

  openDialogRegistroCliente = () => {
    this.setState({
      showDialogRegistroCliente: true
    });
  }

  closeDialogRegistroCliente = () => {
    this.setState({
      showDialogRegistroCliente: false
    });
  }

  fetchAndUpdatePresupuesto = async () => {
    const { client } = this.props;
    const { data } = await client.query({
      query: GET_PRESUPUESTO,
      variables: {
        tarifa: this.props.habitacion.tarifa,
        fechaFinal: this.state.fechaFinal
      },
      fetchPolicy: 'no-cache'
    });
    this.setState({
      presupuesto: data.presupuesto
    });
  }

  fetchNombre = async () => {
    const { client } = this.props;
    const { data } = await client.query({
      query: GET_CLIENTE,
      variables: {
        documentoNacional: this.state.documentoNacional
      }
    });
    const { cliente } = data;
    if(cliente.nombre === "") this.setState({
      nombreCliente: ""
    });
    else this.setState({
      nombreCliente: capitalize(cliente.nombre + " " + cliente.apellidoPaterno + " " + cliente.apellidoMaterno)
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

  updateCliente = () => {
    this.fetchNombre();
  }

  render() {

    const {
      classes,
      showDialog,
      handleClose,
      habitacion
    } = this.props;

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

            </div>
            <div style={{textAlign: 'center'}}>
            {
              this.state.enabledDocumentoNacional === true && (
                <TextNumber
                  style={{width: 245, marginTop: 10, marginBottom: 10}}
                  label="Documento Nacional de Identidad"
                  autoFocus
                  number={this.state.documentoNacional}
                  handleChange={this.handleDocumentoNacional}
                />
              )
            }
            {
              this.state.enabledDocumentoNacional === false && this.state.nombreCliente === null && (
                <CircularProgress className={classes.progress} style={{
                  color: getColor(habitacion.tipo)
                }} />
              )
            }
            {
              this.state.enabledDocumentoNacional === false && this.state.nombreCliente !== null && this.state.nombreCliente !== "" && (
                <React.Fragment>
                  <Typography variant="display1" gutterBottom>
                    {this.state.nombreCliente}
                    <Button variant="fab" mini color="primary" className={classes.button} onClick={this.activeDocumentoNacional}>
                      <EditIcon />
                    </Button>
                  </Typography>
                </React.Fragment>
              )
            }
            {
              this.state.enabledDocumentoNacional === false && this.state.nombreCliente !== null && this.state.nombreCliente === "" &&
              (
                <Typography variant="display1" gutterBottom>
                  <Chip variant="outlined" color="secondary" label={"No se encuentra información del documento " + this.state.documentoNacional} />
                  <Button variant="fab" mini style={{
                    backgroundColor: '#00695f',
                    color: 'white'
                  }} className={classes.button} onClick={this.openDialogRegistroCliente}>
                    <PersonAddIcon />
                  </Button>
                  <Button variant="fab" mini color="primary" className={classes.button} onClick={this.activeDocumentoNacional}>
                    <EditIcon />
                  </Button>
                </Typography>

              )
            }
              <br />
              <TextFecha
                style={{width: 200, marginTop: 10, marginBottom: 10}}
                label="Fecha y Hora de Salida"
                fecha={this.state.fechaFinal}
                handleChange={this.handleFechaFinal}
                disabled={!this.state.enabledTextFechaFinal}
              />
              <Tooltip title="+ 4 horas" placement="right" TransitionComponent={Zoom}>
              <Checkbox
                checked={this.state.plus4Hours}
                onChange={this.handlePlus4Hours}
                icon={<AlarmIcon />}
                checkedIcon={<AlarmOnIcon />}
              />
              </Tooltip>
            </div>
            {
              this.state.presupuesto !== null && (
                <TablePresupuesto
                  presupuesto={this.state.presupuesto}
                  color={getColor(habitacion.tipo)}
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
              this.state.nombreCliente !== null && this.state.nombreCliente !== "" && this.rent()
            }
          </DialogActions>
        </Dialog>
        {
          this.state.showDialogRegistroCliente && (
            <DialogRegistroCliente
              showDialog={this.state.showDialogRegistroCliente}
              documentoNacional={this.state.documentoNacional}
              handleClose={this.closeDialogRegistroCliente}
              updateCliente={this.updateCliente}
            />
          )
        }
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DialogRegistro);
