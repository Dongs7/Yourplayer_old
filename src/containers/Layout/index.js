import React, { Component } from 'react'

import G_logo from 'assets/images/google.png'
import { auth,  g_config, db } from 'config'

import { getUserInfo,
         userLogout,
         getUserToken,
         initPlaylistForUser,
         fetchPlaylistID,
         fetchItemsFromPlaylist,
         dataReset,
         dataLoading,
         createChannel,
         dataError } from 'actions'
import { connect } from 'react-redux'
import classNames from 'classnames'


import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

import PlaylistIcon from '@material-ui/icons/QueueMusic'
import BackIcon from '@material-ui/icons/ArrowBack'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'

import ExpansionPlaylist from 'components/ExpansionPlaylist'

import { Manager, Target, Popper } from 'react-popper'

import Search from 'containers/Search'
import Player from 'containers/Player'

const drawerWidth = 350;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#333',
    color:'#fff',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#333',
    minHeight:'100vh'
  },
  flex : {
    flex: 1
  },
  playlist_toolbar : {
    flexDirection : 'row-reverse'
  },
  avatar: {
    width:20,
    height:20,
    marginLeft:10,
  },
  popperClose: {
    pointerEvents: 'none',
  },

  searchWrapper : {
    minHeight:64,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    flex:' 0 0 auto',
    backgroundColor:'#333',
  },

  playerWrapper: {
    flex:'0 0 auto',
    flexGrow:1,
    width:'calc(100% - 350px)',
    [theme.breakpoints.down("sm")]:{
      width:'100%'
    },
    position:'fixed',
    bottom:0,
    zIndex:5,
    height:120,
    backgroundColor:'#333',
  },


});

class Layout extends Component {
  constructor(props){
    super(props)
    this.state = {
      mobileOpen : false,
      popperOpen : false,
      user : {},
      createButtonClicked : false
    }

    this._handleSignIn = this._handleSignIn.bind(this)
    this._handleSignOut = this._handleSignOut.bind(this)
    this._handleClosePopper = this._handleClosePopper.bind(this)
    this._initScript = this._initScript.bind(this)
    this._createPlaylist = this._createPlaylist.bind(this)
    this._updateSignInStatus = this._updateSignInStatus.bind(this)
    this._updateDBwithUserPlaylistId = this._updateDBwithUserPlaylistId.bind(this)
    this._createChannel = this._createChannel.bind(this)

  }

  // initiallize playlist
  _createPlaylist = () => {
    this.props.initPlaylistForUser()
  }

  // Drawer State
  _handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }

  // Popper state for Logout button
  _handlePopper = () => {
    this.setState({ popperOpen: !this.state.popperOpen });
  };

  _handleClosePopper = () => {
    this.setState({ popperOpen: false });
  }


  /*
    In order to manage access token easily, users are going to log in through
    google api auth first, then log in with credentials obtained from google auth
    through firebase.
  */

  // If the user is not signed in, then sign in through google auth then firebase
  _handleSignIn(){
    if (window.gapi.auth2.getAuthInstance().isSignedIn.get() !== true) {
      window.gapi.auth2.getAuthInstance().signIn()
    }
  }

  // Google API JS initializes when starting the app
  _initScript(){
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://apis.google.com/js/api.js';

    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          apiKey: g_config.apiKey,
          clientId: g_config.clientId,
          discoveryDocs: g_config.discoveryDocs,
          scope: g_config.scopes.join(' '),
        }).then(()=>{
          const GoogleAuth = window.gapi.auth2.getAuthInstance();
          GoogleAuth.isSignedIn.listen(this._updateSignInStatus)
          this._setSigninStatus()
        })
      })
    }
    document.getElementsByTagName('head')[0].appendChild(script);
  }


  // Function to check user status, save user info to firestore and get access token for other api services
  _setSigninStatus(){
    // console.log("fire? 1")
    // get currently signed in user from google auth
    this.props.dataLoading(true)
    let user = window.gapi.auth2.getAuthInstance().currentUser.get()

    // check if the current user is authorized to use the service
    const isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/youtube')

    if(isAuthorized){

      // when param is true, id_token and access token info will be provided
      const authResponse = user.getAuthResponse(true)

      // set credentials using information obtained from above code for firebase login
      const credentials = auth.GoogleAuthProvider.credential(authResponse.id_token, authResponse.access_token)

      let fireUser = auth().currentUser
      // if no signed in user in firebase auth system,
      if(!fireUser){
        // console.log("fire? 21")
        // Sign in the user using the credential created above
        auth().signInAndRetrieveDataWithCredential(credentials)
        .then((user)=> {
          // After successfully signed in, pass the access token to store.
          // This token is from google auth, not from firebase.
          // this.props.getUserToken(authResponse.access_token)
          this.props.getUserToken(authResponse.access_token)
          // Check if user id is in the firestore. If the ID does not exist,
          // create one in the firestore
          var docRef = db.collection("user").doc(user.user.uid)
          docRef.get().then((doc)=>{
            if(doc.exists){
              // console.log("user doc exists")
              if(doc.data().pid){
                // console.log("user pid ex, exec")
                this.props.fetchPlaylistID(doc.data().pid)
                // this.props.fetchItemsFromPlaylist(doc.data().pid)
              }else{
                // No playlist Id found, create one
                this._createPlaylist()
              }

            }else{
              // If user exists, then check if there is a playlist ID for this user.
              // If ID exists, pass it to the store
              // console.log("user id DNE, create one")
              docRef.set({
                id:user.user.uid
              }).then(()=>{
                // console.log("user id created, pid creating..")
                this._createPlaylist()
              })
            }
          })
          .then(()=>{
            // console.log("user created,pid crated set signin pass")

          })
          .catch((err) => console.error("Error adding document: ", err))
        })
      }else{
        // if the user is already logged in, get access token for google api services
        this.props.getUserToken(authResponse.access_token)
        this.props.fetchItemsFromPlaylist(this.props.userPlaylistId)
      }
    }else{
      console.log("No USER")
    }
  }



  /**
   * Google auth lister function
   * @param {boolean} [val = true, false] - true if user's login status has changed, false otherwise
   */
  _updateSignInStatus = (val) => {
    if(val){
      this._setSigninStatus()
    }
  }


  /**
   * Sign-Out from both Google Auth and Firebase
   * @param {}
   */
  _handleSignOut(){
    //reset playlist when the user signs out
    this.props.dataReset(2)
    this.props.fetchPlaylistID('')
    window.gapi.auth2.getAuthInstance().signOut()
    .then(()=>{
      auth().signOut()
    }).catch(err=>console.log(err))
  }


  /**
   * Update playlist ID if current ID is different than the previous one
   * Set createButtonClicked state false if there is an error and prev button state is true
   * @param {object} prevProps - values of previous props
   */
  componentDidUpdate(prevProps){

    if(this.state.createButtonClicked && this.props.isError.isError){
      if(this.props.isError.errMsg === 4){
        this.setState({ createButtonClicked : false })
      }
    }

    const { userPlaylistId, userState } = this.props
    if(prevProps.userPlaylistId !== userPlaylistId){
      if(userPlaylistId !== ''){
        this._updateDBwithUserPlaylistId(userState.uid, userPlaylistId)
      }
    }
  }


  /**
   * Check if playlist ID exists in the database. Update playlist ID if not.
   * @param {string} userID - currently signed in user id
   * @param {string} playlistId - currently signed in user's playlist id
   */
  _updateDBwithUserPlaylistId(userID, playlistId){
    console.log("_updateDBwithUserPlaylistId fires")
    // Check if DB has a document named userID
    let docRef = db.collection("user").doc(userID)
    docRef.get().then((doc)=>{
      if(doc.exists){
        // If exists, compare the ID stored in the database and the current user ID
        if(doc.id === userID){
          // If they match, compare the playlist ID as well
          if(doc.data().pid === playlistId){
            console.log("user playlist id is already in the database")
          }else{
            console.log("user playlist id isnt already in the database")
            // If not matched, or does not exist,
            // store the playlist ID in the DB
            docRef.update({
              pid : playlistId
            })
            console.log("user playlist saved in the database")
          }
        }else{
          console.log("user data exists, but userID doesnt match with the current User")
        }
      }else{
        console.log("This user data is not in the database.")
      }
    })
    .then(()=> {
      this.props.fetchItemsFromPlaylist(playlistId)})
    .catch((err) => console.error("Error adding document: ", err))
  }

  /**
   * Create Youtube Channel
   * @param {int} [type : [1 - Open link, 2 - Call API to get playlist]]
   */
  _createChannel(type){
    if (type === 1){
      this.setState({ createButtonClicked : true })
      this.props.createChannel(1)
    }else{
      this.props.createChannel(2)
    }
  }

  componentDidMount(){
    // Initialize script
    this._initScript()

    // console.log(store)
    // Firebase function to listen to user status.
    this.authenticate = auth().onAuthStateChanged((user) => {
      if(user){
        this.props.dataLoading(true)
        this.props.getUserInfo(user)
      }else{
        this.props.userLogout()
      }
    })
  }

  // Remove firebase listener when the component unmounts.
  componentWillUnmount(){
    this.authenticate()
  }

  render(){
    console.log('create button clicked if true showing reload button now', this.state.createButtonClicked)
    const { classes,
            userState,
            // userPlaylistId,
            isError,
            // isLoading
          } = this.props
    const { popperOpen, createButtonClicked }  = this.state

    const drawer = (
      <div>
        <Toolbar className={classes.playlist_toolbar}>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              onClick={this._handleDrawerToggle}
              >
              <BackIcon />
            </IconButton>
          </Hidden>
        </Toolbar>

        <ExpansionPlaylist
          user={userState}
          // playlistCreator = { this._createPlaylist }
          // plistId = { userPlaylistId }
          // isLoading = { isLoading }
          isError = { isError }
          createChannel = { this._createChannel }
          createButtonState = { createButtonClicked }
        />
      </div>
    )

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this._handleDrawerToggle}
              className={classes.navIconHide}
            >
              <PlaylistIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap className={classes.flex}>
              YourPlayer
            </Typography>
            {
              userState ?
              <Manager>
                <Target>
                  <div>
                    <Button
                      aria-owns={popperOpen ? 'menu-list-grow' : null}
                      aria-haspopup="true"
                      onClick={this._handlePopper}
                      color="inherit"
                      variant="outlined">
                        {userState.displayName}
                        <Avatar alt="google logo" src={userState.photoURL} className={classes.avatar} />

                    </Button>
                  </div>
                </Target>
                <Popper
                  placement="bottom-start"
                  eventsEnabled={popperOpen}
                  className={classNames({ [classes.popperClose]: !popperOpen })}
                >
                  {
                    // ClickAwayListener keeps rendering the component everytime when the user clicks anywhere in the current page.
                    // This is expected behavior since ClickAwayListener needs to detect all click events occuring outside of the DOMM.
                    // In order to prevent the rendering issue, popperOpen state is being used as a trigger.
                    popperOpen &&
                    <ClickAwayListener onClickAway={this._handleClosePopper}>
                      <Grow in={popperOpen} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                        <Paper>
                          <MenuList role="menu">
                            <MenuItem onClick={this._handleSignOut}>Logout</MenuItem>
                          </MenuList>
                        </Paper>
                      </Grow>
                    </ClickAwayListener>
                  }
                </Popper>
              </Manager>

              :
              <Button
                onClick={this._handleSignIn}
                color="inherit"
                variant="outlined">
                  Sign In With <Avatar alt="google logo" src={G_logo} className={classes.avatar} />
              </Button>

            }


          </Toolbar>
        </AppBar>

        <Hidden mdUp>
          <SwipeableDrawer
            disableBackdropTransition
            disableDiscovery
            swipeAreaWidth={5}
            variant="temporary"
            anchor={'left'}
            open={this.state.mobileOpen}
            onOpen={this._handleDrawerToggle}
            onClose={this._handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>

        <main className={classes.content}>
          <div className={classes.toolbar} />

          {/* Search Term Container */}
          <div className={classes.searchWrapper}>
            <Search/>
          </div>

          {this.props.children}

          {/* Player Control Container */}
          <div className={classes.playerWrapper}>
            <Player />
          </div>

        </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // console.log(state)
  return{
    userState : state.userRed.user,
    userPlaylistId : state.pID,
    isLoading : state.dataLoading,
    isError : state.dataError
  }
}

const mapDispatchToProps = { getUserInfo,dataError,createChannel, userLogout, getUserToken, initPlaylistForUser, fetchPlaylistID, fetchItemsFromPlaylist,dataReset,dataLoading }

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps,mapDispatchToProps)(Layout))
