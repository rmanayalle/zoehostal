import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'


const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
  }
});

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      prefix="S/ "
    />
  );
}

class TextMoney extends Component {
  render() {
    const {
      classes,
      label,
      amount,
      handleChange,
      ...props
    } = this.props;

    return (
      <TextField
          className={classes.formControl}
          label={label}
          value={amount}
          onChange={handleChange}
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
          {...props}
        />
    );
  }
}

export default withStyles(styles)(TextMoney)
