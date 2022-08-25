/**
 * @jest-environment jsdom
 */
const axios = require('axios');
const jestConfig = require('../jest.config');
const { fetchMovies } = require('../public/javascripts/index');

jest.mock('axios');

describe('fetch movies', () => {
  axios.get = jest
    .fn()
    .mockImplementationOnce(() => Promise.resolve({ data: 'mock data' }));
});
