import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Query } from "react-apollo";

import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Avatar from '@material-ui/core/Avatar'

import { withTwoDecimal } from '../util/number'
import { GET_HABITACION } from '../util/query'
import DialogRegistro from './DialogRegistro'

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

    this.state = {
      showDialog: false,
      habitacion: null
    };
  }

  handleOpen = (habitacion) => {
    this.setState({
      showDialog: true,
      habitacion: habitacion
    });
  }

  handleClose = () => {
    this.setState({
      showDialog: false,
      habitacion: null
    });
  }

  render(){
    const {
      classes
    } = this.props;

    return (
      <React.Fragment>
        <Query query={GET_HABITACION} variables={{"habitacion":{"estado":"disponible"}}} pollInterval={500}>
          {
            ({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;
              return (
                <List>
                  {
                    data.habitacion.map(habitacion => (
                      <ListItem key={habitacion.nombre}>
                        {getAvatarClass(habitacion.tipo, classes)}
                        <ListItemText
                          primary={habitacion.nombre}
                          secondary={'S/ ' + withTwoDecimal(habitacion.tarifa)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton onClick={() => this.handleOpen(habitacion)}>
                            <PersonAdd />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))
                  }
                </List>
              );
            }
          }
        </Query>
        <ApolloConsumer>
        {client => (
            this.state.habitacion !== null && (
              <DialogRegistro
                habitacion={this.state.habitacion}
                showDialog={this.state.showDialog}
                handleClose={this.handleClose}
                checkOut={new Date(2018,12,12,12,0,0)}
                client={client}
              />
            )
        )}
        </ApolloConsumer>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListHabitacionDisponible);
