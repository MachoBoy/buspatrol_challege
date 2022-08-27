const axios = require('axios');

async function fetchMovies() {
  try {
    const { data } = await axios.get('/movies');
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
}

module.exports = { fetchMovies };
