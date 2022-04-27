import './App.css';
import axios from 'axios';
import {useEffect, useState} from 'react';

function App() {

	const CLIENT_ID = 'd3bec1c2ac244fb59650d7067352468a';
	const REDIRECT_URI = 'http://localhost:3000';
	const AUTH_ENDPOINT = 'http://accounts.spotify.com/authorize';
	const RESPONSE_TYPE = 'token';

	var SpotifyWebApi = require('spotify-web-api-node');

	var SpotifyApi = new SpotifyWebApi({
		clientId: CLIENT_ID,
		clientSecret: 'b15f58d1819a40f896051636521f08a9',
		redirectUri: REDIRECT_URI
	});

	var querystring = require('querystring');

	const [searchKey, setSearchKey] = useState("");
	const [artists, setArtists] = useState([]);
	const [token, setToken] = useState("");

	const [albums, setAlbums] = useState([]);

	useEffect(() => {
		const hash = window.location.hash;
		let token = window.localStorage.getItem('token');
	
		if (!token && hash) {
			token = hash.substring(1).split("&").find(elem => elem.startsWith('access_token')).split("=")[1];
		
			window.location.hash = "";
			window.localStorage.setItem("token", token);
		}
	
		setToken(token);
	}, []);

	const logout = () => {
		setToken("");
		window.localStorage.removeItem('token');
	}
	
	// const getToken = async () => {
	// 	const {data} = await axios.post("https://accounts.spotify.com/authorize?" +
	// 	querystring.stringify({
	// 		response_type: 'code',
	// 		client_id: CLIENT_ID,
	// 		scope: 'user-library-read',
	// 		redirect_uri: REDIRECT_URI,
	// 		state: '1asjdaskda',
	// 	}), {
	// 		headers: {
	// 			Authorization: `Bearer ${token}`,
	// 			'Content-Type': 'application/x-www-form-urlencoded'
	// 		}
	// 	});

	// 	console.log(data.code);
	// };


	const searchArtists = async (e) => {
		e.preventDefault();
		const {data} = await axios.get("https://api.spotify.com/v1/search", {
			headers: {
				Authorization: `Bearer ${token}`,
				'Access-Control-Allow-Origin': null
			},
			params: {
				q: searchKey,
				type: 'artist'
			}
		})

		setArtists(data.artists.items);
	}

	SpotifyApi.setAccessToken('BQB1PxLJRMz6KaICrmdte3udUTYdooyzHCT0gssk_cdYZZLgWG8L5YwpnKx6r1d9OE3y9TBDxVXQHYYVMnuKba4FoGVbG5gXThSwpRo_kmLtGfx_7yGcUogR9TURXtVihtmH4Du5Fc8y2b1jZU40hqQTrgwiScVgWcE-wjge8ZFRnk7NE0sud0g');


	const renderArtists = () => {
		return artists.map(artist => (
			<div key={artist.id}>
				{artist.images.length ? <img width={'100%'} src={artist.images[0].url} alt=""/> : <div>No image</div>}
				{artist.name}
			</div>
		))
	}
	function getElvis (e) {
		e.preventDefault();
		SpotifyApi.getMySavedAlbums({
			limit : 50,
			offset: 0
		  })
		  .then(function(data) {
			// Output items
			console.log(data.body.items);
			setAlbums(data.body.items);
		  }, function(err) {
			console.log('Something went wrong!', err);
		  });
	}

	const renderAlbums = () => {
		return albums.map(album => (
			<div key={album.album.id}>
			{album.album.artists.map((artist) => (
				<p>{artist.name}</p>
			))}
			<br></br>
			<img width={'50%'} src ={album.album.images[0].url} alt=""/>
			<br/>
			{album.album.name} 
			<div>  </div>  {(new Date().getFullYear(album.album.release_date))}
			<ol>
				{album.album.tracks.items.map((track) => (
					<li>{track.name}</li>
				))}
			</ol>
			<br/><br/>
			</div>
		))
	}
  return (

	
    <div className="App">
      <header className="App-header">
	  <h1>Ghettoblaster music box 0.7</h1>
	  {!token ?
	  	<a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
		  : <div><form onSubmit={getElvis}>
				<button type={'submit'}>Search</button>
				{renderAlbums()}
		  </form><button onClick={logout}>Logout</button></div>}

	   
      </header>
    </div>
  );
}

export default App;
