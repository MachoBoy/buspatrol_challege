const axios = require('axios');

const eachCard = `<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">Jaws</h3>
    <h5 class="rating ratePg">PG</h5>
  </div>
  <div class="second text-2 row year">1975</div>
  <div class="third text-2 row runtime">124 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">Pulp Fiction</h3>
    <h5 class="rating rateR">R</h5>
  </div>
  <div class="second text-2 row year">1994</div>
  <div class="third text-2 row runtime">154 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">Star Wars</h3>
    <h5 class="rating ratePg">PG</h5>
  </div>
  <div class="second text-2 row year">1977</div>
  <div class="third text-2 row runtime">121 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">Taxi Driver</h3>
    <h5 class="rating rateR">R</h5>
  </div>
  <div class="second text-2 row year">1976</div>
  <div class="third text-2 row runtime">114 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">The Dark Knight</h3>
    <h5 class="rating ratePg13">PG-13</h5>
  </div>
  <div class="second text-2 row year">2008</div>
  <div class="third text-2 row runtime">152 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">The Godfather</h3>
    <h5 class="rating rateR">R</h5>
  </div>
  <div class="second text-2 row year">1972</div>
  <div class="third text-2 row runtime">175 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">The Lion King</h3>
    <h5 class="rating rateG">G</h5>
  </div>
  <div class="second text-2 row year">1994</div>
  <div class="third text-2 row runtime">88 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">The Texas Chain Saw Massacre</h3>
    <h5 class="rating rateR">R</h5>
  </div>
  <div class="second text-2 row year">1974</div>
  <div class="third text-2 row runtime">83 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">Titanic</h3>
    <h5 class="rating ratePg13">PG-13</h5>
  </div>
  <div class="second text-2 row year">1997</div>
  <div class="third text-2 row runtime">194 minutes</div>
</div>
<div class="card card-bg">
  <div class="first row">
    <h3 class="name text">Toy Story</h3>
    <h5 class="rating rateG">G</h5>
  </div>
  <div class="second text-2 row year">1995</div>
  <div class="third text-2 row runtime">81 minutes</div>
</div>`;

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

const getRating = rating => {
  switch (rating) {
    case 'G':
      return 'rateG';
    case 'PG':
      return 'ratePg';
    case 'PG-13':
      return 'ratePg13';
    case 'R':
      return 'rateR';
    default:
      return '';
  }
};

function printMovieCard(movies) {
  const movieCard = movies.map(movie => {
    const { name, rating, runtime, year } = movie;
    return `<div class="card card-bg">
      <div class="first row">
        <h3 class="name text">${name}</h3>
        <h5 class="rating ${getRating(rating)}">${rating}</h5>
      </div>
      <div class="second text-2 row year">${year}</div>
      <div class="third text-2 row runtime">${runtime}</div>
    </div>`;
  });
  return movieCard;
}

async function fetchMovies() {
  try {
    const { data } = await axios.get('/movies');
    return data;
  } catch (error) {
    return error;
  }
}

function populateDropdown(element, earliestYear) {
  let currentYear = new Date().getFullYear();
  // populate options until current year
  while (currentYear >= earliestYear) {
    const dateOption = document.createElement('option');
    dateOption.text = currentYear;
    dateOption.value = currentYear;
    dateOption['data-testid'] = 'select-option';
    element.add(dateOption);
    currentYear -= 1;
  }
  // Add default option as first to dropdown
  element.insertBefore(new Option('Select a year', ''), element.firstChild);
  element.selectedIndex = '0';
}

module.exports = {
  fetchMovies,
  printMovieCard,
  movies,
  eachCard,
  populateDropdown,
};
