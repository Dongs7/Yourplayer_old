import React from 'react'


import { withStyles } from '@material-ui/core/styles'

// import Grid from '@material-ui/core/Grid'

import Search from 'containers/Search'
import ResultList from 'containers/ResultList'
import Player from 'containers/Player'

const styles = theme => ({
  root: {
    flexGrow: 1,
    // width:'100%',
    height: '100%',
    // backgroundColor : '#333',
    color:'#fff',
    padding:0,
    display:'flex',
    flexDirection:'column',

  },
  searchWrapper : {
    minHeight:64,
    paddingTop:64,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    flex:' 0 0 auto',
    // flexGrow:1,
    // border:'1px solid white',
    backgroundColor:'#333',
  },
  grid_root : {
    maxWidth:1200,
    margin: '0 5%'
  },
  resultWrapper : {
    // flexGrow:8,
    // marginBottom:120,
    // marginTop:0,
    // border:'1px solid red',
    // minHeight:'0',
    flex:'1 1 auto',
    overflowY:'auto'
  },
  playerWrapper: {
    flex:'0 0 auto',
    // flex:'none',
    flexGrow:1,
    // margin:0,
    // padding:0,
    width:'calc(100% - 350px)',
    [theme.breakpoints.down("sm")]:{
      width:'100%'
    },
    position:'fixed',
    bottom:0,
    zIndex:5,
    // width:'inherit',
    height:120,
    // border:'1px solid white',
    // width:'inherit',
    backgroundColor:'#333',
    // marginTop:'auto'
  }

});


const Main = (props) => {
  const { classes} = props
  return(
    <div  className={classes.root}>

        {/* Search Bar */}
        <div className={classes.searchWrapper}>
          <Search />
        </div>

        {/* Display Search List */}
        <div className={classes.resultWrapper}>
          {/* <Grid container>
            <Grid container className={classes.grid_root}>
              <Grid item xs={12}> */}
                <ResultList />
              {/* </Grid>
            </Grid>
          </Grid> */}

        </div>

      {/* Player */}
      <div className={classes.playerWrapper}>
        <Player />
      </div>

    </div>
  )
}



export default withStyles(styles)(Main)
