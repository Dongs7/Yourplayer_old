import React, { Component } from 'react'

import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import { fetchData } from 'actions'

import debounce from 'lodash/debounce'
import SearchInput from 'components/SearchInput'

const styles = ({

})

class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchTerm : ''
    }

    this._handleInput = this._handleInput.bind(this)
  }

  // Send term data after 500ms for better results
  _updateTerm = debounce((term) => {
    this.props.fetchData(term)
  },500)

  _handleInput = term => {
    this._updateTerm(term)
  }

  render(){
    return(
      <div>
        <SearchInput
          handleInput={(e)=>this._handleInput(e.target.value)}/>
      </div>
    )
  }
}

const mapDispatchToProps = { fetchData }

export default withStyles(styles)(connect(null,mapDispatchToProps)(Search))
