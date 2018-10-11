import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import { DateToPickerStringFormat } from '../util/date'

class TextFecha extends Component {
  render() {
    const {
      label,
      text,
      handleChange,
      ...props
    } = this.props;


    return (
      <TextField
          id="datetime-local"
          label={label}
          type="datetime-local"
          margin="dense"
          onChange={handleChange}
          defaultValue={DateToPickerStringFormat(text)}
          InputLabelProps={{
            shrink: true,
          }}
          {...props}
        />
    );
  }
}

export default TextFecha
