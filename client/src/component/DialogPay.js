import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextMoney from './TextMoney'
import { Mutation } from "react-apollo";
import { POST_PAY } from '../util/mutation'
import { ApolloConsumer } from 'react-apollo';
import Slide from '@material-ui/core/Slide';
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class DialogPay extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      amount: this.props.initAmount
    };
  }

  handleChange = (event) => {
    this.setState({
      amount: event.target.value
    });
  }

  pay = () => {
    return (
        <Mutation
          mutation={POST_PAY}
          >
        {(funcPay, { data }) => (

            <Button
              onClick={e => {
                e.preventDefault();
                funcPay({ variables: {
                  "habitacionNombre": this.props.habitacionNombre,
                  "monto": parseFloat(this.state.amount)
                } });

                this.props.handleClose();
              }}
              color="primary">

              Pagar

            </Button>

        )}
        </Mutation>
    );
  }

  render() {
    const {
      showDialog,
      handleClose
    } = this.props;

    return (
      <div>
        <Dialog
          TransitionComponent={Transition}
          open={showDialog}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >

          <DialogContent>
            <TextMoney
              label="Monto"
              amount={this.state.amount}
              handleChange={this.handleChange}
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancelar
            </Button>
            {
              this.pay()
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DialogPay;
