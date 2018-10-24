import React from 'react';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextMoney from './TextMoney'
import { Mutation } from "react-apollo";
import { POST_ADD_CAJA_OTRO } from '../util/mutation'
import { ApolloConsumer } from 'react-apollo';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  paperWidthSm: {
    maxWidth: 300
  },
});

class DialogAsunto extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      amount: "",
      asunto: "blablabla"
    };
  }

  handleChange = (event) => {
    this.setState({
      amount: event.target.value
    });
  }

  handleAsunto = (event) => {
    this.setState({
      asunto: event.target.value
    });
  }

  pay = () => {
    return (
        <Mutation
          mutation={POST_ADD_CAJA_OTRO}
        >
          {(funcAdd, { data }) => (

            <Button
              onClick={e => {
                e.preventDefault();
                funcAdd({ variables: {
                  "asunto": this.state.asunto,
                  "monto": parseFloat(this.state.amount)
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
      handleClose,
      classes
    } = this.props;

    return (
      <div>
        <Dialog
          scroll="body"
          maxWidth="sm"
          TransitionComponent={Transition}
          open={showDialog}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          classes={{
            paperWidthSm: classes.paperWidthSm
          }}
        >

          <DialogContent>
            <TextField
              id="outlined-full-width"
              label="Asunto"
              style={{ marginLeft: 8}}
              placeholder="Escribe aquí el asunto"
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.handleAsunto}
              autoFocus

            />
            <br/>
            <TextMoney
              label="Monto"
              amount={this.state.amount}
              handleChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancelar
            </Button>
            {
              this.state.asunto !== "" && this.state.amount !== "" && this.state.amount !== "-" && this.pay()
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(DialogAsunto);
