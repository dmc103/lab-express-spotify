require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });


  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// Our routes go here:

app.get('/', (req, res) => {
    res.render('layout', {
        title: "Artist Search"
    });
});


app.get('/artist-search', (req, res) => {
    const artistName = req.query.artist;

    spotifyApi.searchArtists(artistName)
    .then (data => {
        // console.log('Received the following data from API:', data.body)
        const artists = data.body.artists.items;
        console.log('Received artists:', artists);

        res.render('artist-search-results' , {
            title: 'Search Results',
            artistName,
            artists,
        });
    })
    .catch(err => {
        console.log('Error while searching artists occured:', err);
        res.status(500).send('An error occured while searching for artists');
    });

});


app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;

    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
        const albums = data.body.items;

        res.render('albums', {
            title: 'Albums',
            artistName: req.query.artistName, albums,
        });
    })
    .catch(err => {
        console.log('Error while searching artists occured:', err);
        res.status(500).send('An error occured while searching for artists');
    });

});


app.get('/album-tracks/: albumId' , (req, res, next) => {
    spotifyApi.getAlbumTracks(albumId)
    .then(data => {
        const tracks = data.body.items;

        res.render('album-tracks' , {
            title: 'Album Tracks',
            albumId,
            tracks,
        });
    })
    .catch(err => {
        console.log('Error while searching artists occured:', err);
        res.status(500).send('An error occured while searching for artists');
    });

});






app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
