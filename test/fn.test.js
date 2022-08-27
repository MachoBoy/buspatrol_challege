/**
 * @jest-environment jsdom
 */
const { fetchMovies } = require('../public/javascripts/fn');
const { movies } = require('../routes/movies');

const axios = require('axios');
// const { fetchMovies } = require('../public/javascripts/index');
// console.log(fetchMovies);
jest.mock('axios');

test('fetch movies', async () => {
  const response = { data: movies };
  axios.get.mockResolvedValue(response);
  const result = await fetchMovies();
  expect(axios.get).toHaveBeenCalledWith('/movies');
  expect({ data: result }).toEqual(response);
});

// test('Search movie by name', () => {
//   const searchMockFn = jest.fn(x => 42 + x);
// });
