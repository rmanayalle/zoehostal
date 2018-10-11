import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { ApolloConsumer } from 'react-apollo'
import TextNumber from './TextNumber'
import TextFecha from './TextFecha'
import TablePresupuesto from './TablePresupuesto'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import { GET_PRESUPUESTO } from '../util/query'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class DialogRegistro extends Component {

  render() {

    const {
      classes,
      isOpen,
      habitacionNombre,
      documentoNacional,
      fechaInicio,
      fechaFinal,
      presupuesto,
      handleDocumentoNacional,
      handleFechaFinal,
      handleSubmit,
      handleClose,
      updatePresupuesto
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
          <DialogTitle
            id="form-dialog-title">
            Registro
          </DialogTitle>
          <DialogContent>
            <TextNumber
              style={{width: 245, marginTop: 10, marginBottom: 10}}
              label="Documento Nacional de Identidad"
              autoFocus
              text={documentoNacional}
              handleChange={handleDocumentoNacional}
            />
            <br />
            <TextFecha
              style={{width: 245, marginTop: 10, marginBottom: 10}}
              label="Fecha y Hora de Salida"
              text={fechaFinal}
              handleChange={handleFechaFinal}
            />

            <ApolloConsumer>
            {client => (
              <IconButton
                className={classes.button}
                aria-label="Refresh"
                onClick={async () => {
                  const { data } = await client.query({
                    query: GET_PRESUPUESTO,
                    variables: {
                      "habitacion": {
                        "nombre": habitacionNombre
                      },
                      "fechaInicio": fechaInicio,
                      "fechaFinal": fechaFinal
                    }
                  });
                  updatePresupuesto(data.presupuestar);
                }}
                >
                <LocalOfferIcon />
              </IconButton>
            )}
            </ApolloConsumer>

            {
              presupuesto !== null && (
                <TablePresupuesto
                  presupuesto={presupuesto}
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
            <Button
              onClick={handleSubmit}
              color="primary">

              Registrar

            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DialogRegistro);
