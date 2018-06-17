import 'rc-slider/assets/index.css'

import moment from 'moment'
import momentDuration from 'moment-duration-format' // duration wont work if remove this line

import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Slider from 'rc-slider'


const styles = ({
  time_text : {
    fontSize: 13,
    paddingLeft : 10,
    paddingRight : 10,
    color:'#ddd'
  },
  slider_root : {
    padding:0
  }
})

const Sliders = (props) => {

  const { total,
          classes,
          currentPosition,
          seekSong,
          sliderChangeStart,
          sliderChangeEnd,
          sliderState,
          sliderValueWhileChanging
        } = props
  // console.log((currentPosition))
  // console.log((total))

  return (
      <div style={{ display : 'flex', flexDirection:'row', alignItems:'center'}}>
        <span className={classes.time_text}>
          {
            currentPosition ?
            moment.duration(currentPosition, "seconds").format(total >= 3600 ? "h:mm:ss" : "mm:ss" ,{trim:false})
            :
            0
          }

        </span>
        <Slider
          className={classes.slider_root}
          min={0}
          max={total}
          onBeforeChange={ sliderChangeStart }
          onChange={seekSong}
          onAfterChange={ sliderChangeEnd }
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
          // value={currentPosition > 0 ? Math.floor(currentPosition) : 0 }
          value = {sliderState ?
                   sliderValueWhileChanging
                   :
                   currentPosition > 0 ?
                     Math.floor(currentPosition)
                     :
                     0}
          />
        <span className={classes.time_text}>{moment.duration(total, "seconds").format("h:mm:ss")}</span>
      </div>

  )
}

export default withStyles(styles)(Sliders)
