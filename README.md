This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

~~[YourPlayer Demo site]~~

## Music Player with YouTube Data API

Simple Music Player utilizing
 - YouTube Data API
 - Firebase
 - Firestore
 - Google Auth API
 - Material UI
 - React + Redux
 

## Features

- User Signin/ Signout using Google Auth and Firebase
- Automatically create and manage the youtube Playlist for users who are signed in through Google
- Repeat currently playing song or Repeat all songs in the playlist
- Not Signed-in users can search and play songs, but can't use playlist

# Features to be updated / fixed / added

- ~~Shuffle songs~~
- Better IOS support
- ~~Text styles for search results~~
- Volume control, ~~slider bar control~~
- ~~No duplicate in the playlist~~
- ~~button to show more results (pagetoken)~~
- ~~close playlist sidemenu after selecting the song (mobile)~~ (added close btn instead)

# Update #1
- add song in the playlist if the song is not in the list
- seek currently playing song using slider bar
- improved UI
- 1.1 Fixed : unable to show track title when clicking prev, next skip button
- 1.2 Fixed : unable to rotate tracks automatically when repeat-all is activated

# Update #2
- pulse icon while playing
- fixed song duration format
- fixed minor auth issues

# Update #3
- Better error handling & display
