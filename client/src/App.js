import React, { Component } from 'react'
import { Query } from "react-apollo";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import ListHabitacionDisponible from './component/ListHabitacionDisponible'
//import ListHabitacionOcupado from './Component/ListHabitacionOcupado'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { GET_HABITACION } from './util/query'

import DialogInformacion from './component/DialogInformacion'


const client = new ApolloClient({
  uri: "http://192.168.0.16:4000/"
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
            <Query
              query={GET_HABITACION}
              variables={{
                "habitacion": {
                  "estado":"disponible"
                }
              }}
              pollInterval={500}>
            {
              ({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error :(</p>;

                return <ListHabitacionDisponible habitacion={data.habitacion} />;
              }
            }
            </Query>
          </Paper>
        </ApolloProvider>
      </React.Fragment>
    );
  }
}

/*
<Paper className={classes.paper}>
  <Typography variant="headline" component="h3" style={{fontWeight: 200}}>
    Ocupado
  </Typography>
  <Query query={GET_HABITACION} variables={{"habitacion": {"estado":"ocupado"}}} pollInterval={500}>
  {
    ({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return <ListHabitacionOcupado habitacion={data.habitacion} />;
    }
  }
  </Query>

</Paper>
*/

export default withStyles(styles)(App);
