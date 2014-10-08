TicTail Angular Boilerplate

Starting point for a TicTail app based on AngularJS. Code is in no way complete and not tested in production.

## Install

1. Run ```npm install``` for "native" and "server".
2. Start server ```node server.js``` in /server
3. Start native ```grunt serve``` in /native

The server uses redis and mongodb to store sessions and user profiles. The backend is not required to make API calls to tictail from the app. Handshakes can be done using only JS but that you'll have to do yourself.

I won't update this repo on a regular basis, see it as a representation of what I learned while messing around with TicTail and Angular. Take it, use it and change the world!
