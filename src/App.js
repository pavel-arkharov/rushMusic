import './App.css';
import {useEffect, useState} from 'react';

function App() {

	const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
	const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
	const REDIRECT_URI = window.location.href;
	const AUTH_ENDPOINT = 'http://accounts.spotify.com/authorize';
	const RESPONSE_TYPE = 'token';
	const SCOPE = 'user-library-read';

	var SpotifyWebApi = require('spotify-web-api-node');

	var SpotifyApi = new SpotifyWebApi({
		clientId: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		redirectUri: REDIRECT_URI
	});

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
	
	SpotifyApi.setAccessToken(token);
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
	  	<a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
		  : <div><form onSubmit={getElvis}>
				<button type={'submit'}>Search</button>
				{renderAlbums()}
		  </form><button onClick={logout}>Logout</button></div>}

	   
      </header>
    </div>
  );
}

export default App;
