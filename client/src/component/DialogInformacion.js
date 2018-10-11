import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import { GET_HABITACION } from '../util/query'
import { Query } from "react-apollo";
import Typography from '@material-ui/core/Typography';

const styles = theme => ({

});

class DialogInformacion extends Component {
  render(){
    const {
      classes,
      isOpen,
      habitacionNombre,
      handleClose
    } = this.props;

    return (
      <React.Fragment>
      <Dialog
        maxWidth="md"
        scroll="body"
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <Query query={GET_HABITACION} variables={{
            "habitacion": {
              "nombre": habitacionNombre
            }
          }}>
          {
            ({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              return (
                <React.Fragment>
                  <Typography variant="title" gutterBottom>
                    {data.habitacion[0].nombre}
                  </Typography>
                  <Typography variant="subheading" gutterBottom>
                    {data.habitacion[0].cliente.nombre}
                  </Typography>
                </React.Fragment>
              );
            }
          }
          </Query>
        </DialogContent>
        <DialogActions>

          <Button
            onClick={handleClose}
            color="primary">

            Aceptar

          </Button>
        </DialogActions>
      </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DialogInformacion);
