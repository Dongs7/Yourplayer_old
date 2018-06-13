import 'rc-slider/assets/index.css'

import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Slider from 'rc-slider'

const getTimer = (total) => {
  if(total >= 3600){
    return "hour"
  }else{
    let MM = Math.floor(total / 60)
    let SS = Math.floor(total - (MM * 60) + 1)
    return MM.toString() + ':' + SS.toString()
  }
}

const timer = setInterval(()=>{

})

const updatePosition = (startPos, endPos) => {
  if(startPos < endPos){

  }
}

const styles = ({
  time_text : {
    fontSize: 13,
    paddingLeft : 10,
    paddingRight : 10
  },
  slider_root : {
    padding:0
  }
})

const Sliders = (props) => {

  const { total, classes, currentPosition } = props
  const maxValue = getTimer(total)
  // console.log((currentPosition))
  // console.log((total))
  return (
      <div style={{ display : 'flex', flexDirection:'row', alignItems:'center'}}>
        <span className={classes.time_text}>
          {
            currentPosition ?
            Math.floor(currentPosition)
            :
            0
          }

        </span>
        <Slider
          className={classes.slider_root}
          min={0}
          max={total}
          trackStyle={{ backgroundColor: '#bbb', height: 10 }}
          railStyle={{ backgroundColor: '#555', height: 10 }}
          handleStyle={{
            padding:0,
            borderColor: '#fff',
            height: 10,
            width: 10,
            // marginLeft: -14,
            marginTop: -0,
            backgroundColor: '#fff',
          }}
          value={currentPosition > 0 ? Math.floor(currentPosition) : 0}
          />
        <span className={classes.time_text}>{maxValue}</span>
      </div>

  )
}

export default withStyles(styles)(Sliders)
