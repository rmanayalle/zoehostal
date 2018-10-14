import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ViewModule from '@material-ui/icons/ViewModule';
import Avatar from '@material-ui/core/Avatar';

import { withTwoDecimal } from '../util/number'
import { GET_HABITACION } from '../util/query'

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
        <Query query={GET_HABITACION} variables={{"habitacion":{"estado":"ocupado"}}} pollInterval={500}>
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
                      secondary={habitacion.deuda > 0 && 'S/ ' + withTwoDecimal(habitacion.deuda)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton>
                        <ViewModule />
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListHabitacionOcupado);
