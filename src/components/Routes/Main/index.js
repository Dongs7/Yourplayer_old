import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ResultList from 'containers/ResultList'

const styles = theme => ({
  root: {
    width:'calc(100% - 350px)',
    [theme.breakpoints.down("sm")]:{
      width:'100%'
    },
    height:'calc(100% - 240px)',
    overflow:'auto',
    color:'#fff',
    padding:0,
    position:'absolute' // set the position as absolute to enable ellipsis
  },
  searchWrapper : {
    minHeight:64,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    flex:' 0 0 auto',
    backgroundColor:'#333',
  },
  grid_root : {
    maxWidth:1200,
    margin: '0 5%'
  },
  resultWrapper : {
    flex:'1 1 auto',
    overflowY:'auto'
  }
});


const Main = (props) => {
  const { classes} = props
  return(
    <div id="main_page" className={classes.root}>
        {/* Display Search List */}
        <div className={classes.resultWrapper}>
                <ResultList />
        </div>
    </div>
  )
}



export default withStyles(styles)(Main)
