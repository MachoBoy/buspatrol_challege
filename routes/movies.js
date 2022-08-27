var express = require('express');
var router = express.Router();

const movies = [
  {
    name: 'Jaws',
    rating: 'PG',
    runtime: '124 minutes',
    year: 1975,
  },
  {
    name: 'Pulp Fiction',
    rating: 'R',
    runtime: '154 minutes',
    year: 1994,
  },
  {
    name: 'Star Wars',
    rating: 'PG',
    runtime: '121 minutes',
    year: 1977,
  },
  {
    name: 'Taxi Driver',
    rating: 'R',
    runtime: '114 minutes',
    year: 1976,
  },
  {
    name: 'The Dark Knight',
    rating: 'PG-13',
    runtime: '152 minutes',
    year: 2008,
  },
  {
    name: 'The Godfather',
    rating: 'R',
    runtime: '175 minutes',
    year: 1972,
  },
  {
    name: 'The Lion King',
    rating: 'G',
    runtime: '88 minutes',
    year: 1994,
  },
  {
    name: 'The Texas Chain Saw Massacre',
    rating: 'R',
    runtime: '83 minutes',
    year: 1974,
  },
  {
    name: 'Titanic',
    rating: 'PG-13',
    runtime: '194 minutes',
    year: 1997,
  },
  {
    name: 'Toy Story',
    rating: 'G',
    runtime: '81 minutes',
    year: 1995,
  },
];

router.get('/', (_req, res, _next) => {
  res.json(movies);
});

module.exports = router;
