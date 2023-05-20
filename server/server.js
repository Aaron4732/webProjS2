const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

let genreSet = new Set();
Object.values(movieModel).forEach(movie => movie.Genres.forEach(genre => genreSet.add(genre.toString())));

const genres = Array.from(genreSet).sort();

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

app.get('/movies', function (req, res) {
  const GENRE = req.query.genre

  let movies = Object.values(movieModel);

  if (!GENRE) {
    res.send(movies);
    return;
  }

  if (genres.includes(GENRE) || GENRE == "All") {

    let movies = Object.values(movieModel);

    if (GENRE != "All") {
      movies = movies.filter(movie => movie.Genres.includes(GENRE));
    }

    res.send(movies);
    return;
  }

  res.send(404);
})


app.get('/genres', function (req, res) {

  res.send(genres);
})


// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")