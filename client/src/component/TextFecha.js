import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import { dateToPickerStringFormat } from '../util/date'

class TextFecha extends Component {
  render() {
    const {
      label,
      fecha,
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
          InputLabelProps={{
            shrink: true,
          }}
          value={dateToPickerStringFormat(fecha)}
          {...props}
        />
    );
  }
}

export default TextFecha
