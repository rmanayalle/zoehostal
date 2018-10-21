import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import { ApolloConsumer } from 'react-apollo'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ViewModule from '@material-ui/icons/ViewModule';
import Avatar from '@material-ui/core/Avatar';

import { withTwoDecimal } from '../util/number'
import { GET_HABITACION } from '../util/query'
import DialogInformacion from './DialogInformacion'

function getAvatarClass(tipo, classes){
  let firstLetter = tipo.charAt(0).toUpperCase();
  let classTipoLetra = classes.emptyAvatar;

  switch (firstLetter) {
    case "M":
      classTipoLetra = classes.blueAvatar;
      break;
    case "S":
      classTipoLetra = classes.purpleAvatar;
      break;
    case "D":
      classTipoLetra = classes.pinkAvatar;
      break;
  }

  return <Avatar className={classTipoLetra}>{firstLetter}</Avatar>;
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

class ListHabitacionOcupado extends Component {
  constructor(props){
    super(props);

    this.state = {
      showDialog: false,
      habitacionNombre: null
    };
  }

  handleOpen = (habitacionNombre) => {
    this.setState({
      showDialog: true,
      habitacionNombre: habitacionNombre
    });
  }

  handleClose = () => {
    this.setState({
      showDialog: false,
      habitacionNombre: null
    });
  }

  render(){
    const {
      classes
    } = this.props;

    return (
      <React.Fragment>
        <Query query={GET_HABITACION} variables={{"habitacion":{"estado":"ocupado"}}} pollInterval={500}>
        {
          ({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <List>
              {
                data.habitacion.map(habitacion => {
                  let deuda = habitacion.hospedaje.cronologia.totalNeedsToBeCashed - habitacion.hospedaje.pago.total;
                  return (
                    <ListItem key={habitacion.nombre}>
                      {getAvatarClass(habitacion.tipo, classes)}
                      <ListItemText
                        primary={habitacion.nombre}
                        secondary={deuda > 0 && 'S/ ' + withTwoDecimal(deuda)}
                      />
                      <ListItemSecondaryAction onClick={() => this.handleOpen(habitacion.nombre)}>
                        <IconButton>
                          <ViewModule />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })
              }
              </List>
            );
          }
        }
        </Query>
        {
          this.state.habitacionNombre !== null && (
            <Query query={GET_HABITACION} variables={{"habitacion": {"nombre":this.state.habitacionNombre}}} pollInterval={500}>
            {
              ({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(</p>;

                let habitacion = data.habitacion[0];

                return (
                  <ApolloConsumer>
                  {client => (
                    <DialogInformacion
                      client={client}
                      showDialog={this.state.showDialog}
                      habitacion={habitacion}
                      handleClose={this.handleClose}
                    />
                  )}
                  </ApolloConsumer>
                );
              }
            }
            </Query>
          )
        }
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListHabitacionOcupado);
