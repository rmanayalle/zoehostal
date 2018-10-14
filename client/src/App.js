import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ListHabitacionDisponible from './component/ListHabitacionDisponible'
import ListHabitacionOcupado from './component/ListHabitacionOcupado'

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    minWidth: 350,
    display: 'inline-grid',
    margin: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class App extends Component {
  render(){

    const {
      classes
    } = this.props;

    return (
      <React.Fragment>
        <ApolloProvider client={client}>
          <Paper className={classes.paper}>
            <Typography variant="headline" component="h3" style={{fontWeight: 200}}>
              Disponible
            </Typography>
            <ListHabitacionDisponible />
          </Paper>
          <Paper className={classes.paper}>
            <Typography variant="headline" component="h3" style={{fontWeight: 200}}>
              Ocupado
            </Typography>
            <ListHabitacionOcupado />
          </Paper>
        </ApolloProvider>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
