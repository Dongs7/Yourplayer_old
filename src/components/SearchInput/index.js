import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
    width:300
  },
  cssFocused: {},
  cssLabel: {
    color:'#fff',
    '&$cssFocused': {
      color: '#fff',
    },
  },
  cssUnderline: {
    '&:before': {
      borderBottomColor: '#fff',
    },
    '&:after': {
      borderBottomColor: '#fff',
    },
  },
  cssInput : {
    color:'#fff'
  }
})



const SearchInput = (props) => {
  const { classes, handleInput } = props
  return(

    <FormControl className={classes.margin}>
      <InputLabel
        FormLabelClasses={{
          root: classes.cssLabel,
          focused: classes.cssFocused,
        }}
        htmlFor="termInput"
      >
        Search Artists / Songs
      </InputLabel>
      <Input
        classes={{
          root : classes.cssInput,
          underline: classes.cssUnderline,
        }}
        id="termInput"
        onChange={handleInput}
      />
    </FormControl>

  )
}

export default withStyles(styles)(SearchInput)
