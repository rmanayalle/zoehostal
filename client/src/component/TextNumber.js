import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';

class TextNumber extends Component {
  render() {
    const {
      label,
      text,
      handleChange,
      ...props
    } = this.props;

    return (
      <TextField
        id="standard-number"
        label={label}
        value={text}
        onChange={handleChange}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
        {...props}
      />
    );
  }
}

export default TextNumber
