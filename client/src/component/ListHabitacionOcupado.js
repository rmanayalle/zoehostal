/*import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ViewModule from '@material-ui/icons/ViewModule';
import Avatar from '@material-ui/core/Avatar';

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

function withTwoDecimal(number){
  return parseFloat(Math.round(number * 100) / 100).toFixed(2);
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

  render(){
    const {
      classes,
      habitacion
    } = this.props;

    return (
      <React.Fragment>
        <List>
          {
            habitacion.map(iHabitacion => (
              <ListItem key={iHabitacion.nombre}>
                {getAvatarClass(iHabitacion.tipo, classes)}
                <ListItemText
                  primary={iHabitacion.nombre}
                  secondary={iHabitacion.deuda > 0 && 'S/ ' + withTwoDecimal(iHabitacion.deuda)}
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ListHabitacionOcupado);*/
