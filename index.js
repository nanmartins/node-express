const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

let vinyls = [];

app.get('/vinyls', (req, res) => {
  res.status(200).send({
    vinyls
  });
});

app.post('/vinyls', (req, res) => {
  const { artist, album, year } = req.body;

  if (!artist || !album || !year) {
    return res.status(400).send({ message: 'Incomplete information provided for creating a vinyl.' });
  }

  const newVinyl = {
    id: generateUniqueId(),
    artist,
    album,
    year
  };

  vinyls.push(newVinyl);

  res.status(201).send({ message: 'Vinyl created successfully', vinyl: newVinyl });
});

app.put('/vinyls/:id', (req, res) => {
  const { id } = req.params;
  const { artist, album, year } = req.body;

  const index = vinyls.findIndex(vinyl => vinyl.id === id);

  if (index === -1) {
    return res.status(404).send({ message: 'Vinyl not found.' });
  }

  vinyls[index] = {
    id,
    artist: artist || vinyls[index].artist,
    album: album || vinyls[index].album,
    year: year || vinyls[index].year
  };

  res.status(200).send({ message: 'Vinyl updated successfully', vinyl: vinyls[index] });
});

function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

app.listen(
  PORT,
  () => console.log(`Server is running on http://localhost:${PORT}`)
);
