import React, { Component } from 'react'
import DialogRegistro from './DialogRegistro'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Avatar from '@material-ui/core/Avatar'
import { WithTwoDecimal } from '../util/number'
import { POST_ALQUILAR } from '../util/mutation'
import { Mutation } from "react-apollo"
import { ApolloConsumer } from 'react-apollo'
import { GET_PRESUPUESTO } from '../util/query'

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

  return <Avatar className={classHabitacionTipo}>{firstLetter}</Avatar>;
}

const styles = theme => ({
  blueAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#3949ab',
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#8e24aa',
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#d81b60',
  },
  emptyAvatar: {
    margin: 10,
  }
});

class ListHabitacionDisponible extends Component {
  constructor(props){
    super(props);

    let date = new Date();

    this.state = {
      isOpen: false,
      habitacionNombre: "",
      fechaInicio: new Date(),
      fechaFinal: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12, 0,0 ),
      documentoNacional: "",
      presupuesto: null
    };

  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      fechaInicio: new Date()
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
    });
  }

  handleOpen = (client, habitacionNombre) => {
    let date = new Date();

    this.setState({
      isOpen: true,
      habitacionNombre: habitacionNombre,
      fechaFinal: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12, 0,0 ),
      documentoNacional: "",
      presupuesto: null
    });

    this.fetchAndUpdatePresupuesto(client, habitacionNombre);

  }

  fetchAndUpdatePresupuesto = async (client, habitacionNombre) => {
    let date = new Date();
    const { data } = await client.query({
      query: GET_PRESUPUESTO,
      variables: {
        "habitacion": {
          "nombre": habitacionNombre
        },
        "fechaInicio": date,
        "fechaFinal": new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12, 0,0 )
      }
    });
    this.updatePresupuesto(data.presupuestar);
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    });
  }

  updatePresupuesto = (presupuesto) => {
    this.setState({
      presupuesto: presupuesto
    });
  }

  render(){
    const {
      habitacion,
      classes
    } = this.props;

    return (
      <React.Fragment>
        <List>
        {
          habitacion.map(item => (
            <ListItem key={item.nombre}>
              {getAvatarClass(item.tipo, classes)}
              <ListItemText
                primary={item.nombre}
                secondary={'S/ ' + WithTwoDecimal(item.tarifa)}
              />
              <ListItemSecondaryAction>
              <ApolloConsumer>
              {client => (
                <IconButton onClick={() => this.handleOpen(client, item.nombre)}>
                  <PersonAdd />
                </IconButton>
              )}
              </ApolloConsumer>

              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
        </List>
        <Mutation mutation={POST_ALQUILAR} variables={{
          "habitacion": {
            "nombre": this.state.habitacionNombre
          },
          "cliente": {
            "documentoNacional": this.state.documentoNacional,
            "nombre": "",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "fechaFinal": this.state.fechaFinal.getTime()
        }} ignoreResults >
        {
          (mutationAddAlquiler) => (
            <DialogRegistro
              isOpen={this.state.isOpen}
              habitacionNombre={this.state.habitacionNombre}
              documentoNacional={this.state.documentoNacional}
              fechaInicio={this.state.fechaInicio}
              fechaFinal={this.state.fechaFinal}
              presupuesto={this.state.presupuesto}
              handleDocumentoNacional={this.handleDocumentoNacional}
              handleFechaFinal={this.handleFechaFinal}
              handleSubmit={() => {
                mutationAddAlquiler();
                this.handleClose();
              }}
              handleClose={this.handleClose}
              updatePresupuesto={this.updatePresupuesto}
            />
          )
        }
        </Mutation>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListHabitacionDisponible);
/*import React, { Component } from 'react'
import DialogRegistro from './DialogRegistro'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Avatar from '@material-ui/core/Avatar'
import { WithTwoDecimal } from '../util/number'
import { POST_ALQUILAR } from '../util/mutation'
import { Mutation } from "react-apollo"
import { ApolloConsumer } from 'react-apollo'
import { GET_PRESUPUESTO } from '../util/query'

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

  return <Avatar className={classHabitacionTipo}>{firstLetter}</Avatar>;
}

const styles = theme => ({
  blueAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#3949ab',
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#8e24aa',
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#d81b60',
  },
  emptyAvatar: {
    margin: 10,
  }
});

class ListHabitacionDisponible extends Component {
  constructor(props){
    super(props);

    let date = new Date();

    this.state = {
      isOpen: false,
      habitacionNombre: "",
      fechaInicio: new Date(),
      fechaFinal: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12, 0,0 ),
      documentoNacional: "",
      presupuesto: null
    };

  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      fechaInicio: new Date()
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
    });
  }

  handleOpen = (client, habitacionNombre) => {
    let date = new Date();

    this.setState({
      isOpen: true,
      habitacionNombre: habitacionNombre,
      fechaFinal: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12, 0,0 ),
      documentoNacional: "",
      presupuesto: null
    });

    this.fetchAndUpdatePresupuesto(client, habitacionNombre);

  }

  fetchAndUpdatePresupuesto = async (client, habitacionNombre) => {
    let date = new Date();
    const { data } = await client.query({
      query: GET_PRESUPUESTO,
      variables: {
        "habitacion": {
          "nombre": habitacionNombre
        },
        "fechaInicio": date,
        "fechaFinal": new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 12, 0,0 )
      }
    });
    this.updatePresupuesto(data.presupuestar);
  }

  handleClose = () => {
    this.setState({
      isOpen: false
    });
  }

  updatePresupuesto = (presupuesto) => {
    this.setState({
      presupuesto: presupuesto
    });
  }

  render(){
    const {
      habitacion,
      classes
    } = this.props;

    return (
      <React.Fragment>
        <List>
        {
          habitacion.map(item => (
            <ListItem key={item.nombre}>
              {getAvatarClass(item.tipo, classes)}
              <ListItemText
                primary={item.nombre}
                secondary={'S/ ' + WithTwoDecimal(item.tarifa)}
              />
              <ListItemSecondaryAction>
              <ApolloConsumer>
              {client => (
                <IconButton onClick={() => this.handleOpen(client, item.nombre)}>
                  <PersonAdd />
                </IconButton>
              )}
              </ApolloConsumer>

              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
        </List>
        <Mutation mutation={POST_ALQUILAR} variables={{
          "habitacion": {
            "nombre": this.state.habitacionNombre
          },
          "cliente": {
            "documentoNacional": this.state.documentoNacional,
            "nombre": "",
            "apellidoPaterno": "",
            "apellidoMaterno": ""
          },
          "fechaFinal": this.state.fechaFinal.getTime()
        }} ignoreResults >
        {
          (mutationAddAlquiler) => (
            <DialogRegistro
              isOpen={this.state.isOpen}
              habitacionNombre={this.state.habitacionNombre}
              documentoNacional={this.state.documentoNacional}
              fechaInicio={this.state.fechaInicio}
              fechaFinal={this.state.fechaFinal}
              presupuesto={this.state.presupuesto}
              handleDocumentoNacional={this.handleDocumentoNacional}
              handleFechaFinal={this.handleFechaFinal}
              handleSubmit={() => {
                mutationAddAlquiler();
                this.handleClose();
              }}
              handleClose={this.handleClose}
              updatePresupuesto={this.updatePresupuesto}
            />
          )
        }
        </Mutation>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListHabitacionDisponible);*/
