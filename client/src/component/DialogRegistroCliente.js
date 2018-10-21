import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { POST_CLIENTE } from '../util/mutation'
import { Mutation } from "react-apollo"
import { GET_CLIENTE } from '../util/query'

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class DialogRegistroCliente extends Component{
  constructor(props){
    super(props);

    this.state = {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: ""
    };
  }

  handleInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  buttonRegistrarCliente = () => {
    return (
      <Mutation
        mutation={POST_CLIENTE}
        update={
          (cache, { data: { cliente } }) => {
            cache.writeQuery({
              query: GET_CLIENTE,
              variables: {
                "documentoNacional": this.props.documentoNacional
              },
              data: {
                cliente: cliente
              }
            });
            this.props.updateCliente();
          }
        }
      >
      {(funcCliente, { data }) => (
        <Button
          onClick={e => {
            e.preventDefault();
            funcCliente({ variables: {
              "cliente":{
                "documentoNacional": this.props.documentoNacional,
                "nombre": this.state.nombre,
                "apellidoPaterno": this.state.apellidoPaterno,
                "apellidoMaterno": this.state.apellidoMaterno
              }
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

  render() {
    const {
      showDialog,
      documentoNacional,
      handleClose,
      classes
    } = this.props;
    return (
      <Dialog
        TransitionComponent={Transition}
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <Typography variant="display1" gutterBottom style={{textAlign: 'center'}}>
            {documentoNacional}
          </Typography>
          <TextField
            id="standard-with-placeholder"
            label="Nombres"
            placeholder="Juan Ronaldo"
            className={classes.textField}
            margin="normal"
            value={this.state.nombre}
            autoFocus
            name="nombre"
            onChange={this.handleInput}
          />
          <br />
          <TextField
            id="standard-with-placeholder"
            label="Apellido Paterno"
            placeholder="Pérez"
            className={classes.textField}
            margin="normal"
            value={this.state.apellidoPaterno}
            name="apellidoPaterno"
            onChange={this.handleInput}
          /><br />
          <TextField
            id="standard-with-placeholder"
            label="Apellido Materno"
            placeholder="García"
            className={classes.textField}
            margin="normal"
            value={this.state.apellidoMaterno}
            name="apellidoMaterno"
            onChange={this.handleInput}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          {
            this.state.nombre !== "" && this.state.apellidoPaterno !== "" && this.state.apellidoMaterno !== "" && this.buttonRegistrarCliente()
          }
        </DialogActions>
      </Dialog>
    );
  }
}


export default withStyles(styles)(DialogRegistroCliente);
