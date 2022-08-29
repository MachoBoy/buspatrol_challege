/**
 * @jest-environment jsdom
 */
const {
  fetchMovies,
  printMovieCard,
  movies,
  eachCard,
  populateDropdown,
} = require('../public/javascripts/fn');

const axios = require('axios');
jest.mock('axios');

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

document.body.innerHTML = `
      <div class="card-container">
        <div class="rating-wrapper">
          <div class="checkbox">
            <input id="checkbox1" type="checkbox" value="G" />
            <label class="checkbox-label text-2">G</label>
          </div>
          <div class="checkbox">
            <input id="checkbox2" type="checkbox" value="PG" />
            <label class="checkbox-label text-2">PG</label>
          </div>
          <div class="checkbox">
            <input id="checkbox3" type="checkbox" value="PG-13" />
            <label class="checkbox-label text-2">PG-13</label>
          </div>
          <div class="checkbox">
            <input id="checkbox4" type="checkbox" value="R" />
            <label class="checkbox-label text-2">R</label>
          </div>
        </div>
        <div class="year-wrapper">
          <label class="year-title text-2">Year</label>
          <div class="dropdown-wrapper">
            <select class="from-selection" name="from-selection"></select>
            <div class="selection-to">to</div>
            <select class="to-selection" name="to-selection"></select>
          </div>
        </div>
        <div class="runtime-range-wrapper">
          <input
            class="runtime-range"
            type="range"
            min="50"
            max="200"
            step="1"
            value="50"
          />
          <div class="range-value text-2">50</div>
        </div>
        <div class="message"></div>
        <div class="loading">Loding...</div>
        <div class="cards"></div>
      </div>
    `;
const cardsDOM = document.querySelector('.cards');
cardsDOM.innerHTML = eachCard;

describe('fetch movies / throw error / apply cards in DOM', () => {
  const loadingDOM = document.querySelector('.loading');
  it('fetch movies', async () => {
    const response = { data: movies };
    axios.get.mockResolvedValue(response);
    // test loading
    loadingDOM.style.visibility = 'visible';
    expect(loadingDOM.style.visibility).toBe('visible');

    // fetch data
    const result = await fetchMovies();
    expect(axios.get).toHaveBeenCalledWith('/movies');
    expect({ data: result }).toEqual(response);

    // test hide loading
    loadingDOM.style.visibility = 'hidden';
    expect(loadingDOM.style.visibility).toBe('hidden');
  });
  it('if fetched data length < 0', async () => {
    const messageDOM = document.querySelector('.message');
    const response = { data: [] };
    axios.get.mockResolvedValue(response);
    expect(axios.get).toHaveBeenCalledWith('/movies');
    expect({ data: [] }).toEqual(response);
    messageDOM.innerHTML = `<h5 class="empty-list">No movies in the list</h5>`;
    expect(messageDOM.innerHTML).toBe(
      `<h5 class="empty-list">No movies in the list</h5>`,
    );
  });
  it('throw error', async () => {
    const error = new Error('network error');
    axios.get.mockRejectedValueOnce(error);
    try {
      await fetchMovies();
    } catch (e) {
      expect(e).toEqual(err);
    }
  });
  // it('Print movie cards', () => {
  //   const expectedMovieCard = `<div class="cards"><div class="card card-bg">
  //   <div class="first row">
  //     <h3 class="name text">Jaws</h3>
  //     <h5 class="rating ratePg">PG</h5>
  //   </div>
  //   <div class="second text-2 row year">1975</div>
  //   <div class="third text-2 row runtime">124 minutes</div>
  // </div></div>`;

  //   const movieCard = printMovieCard([
  //     {
  //       name: 'Jaws',
  //       rating: 'PG',
  //       runtime: '124 minutes',
  //       year: 1975,
  //     },
  //   ]).join('');
  //   const cardsDOM = document.querySelector('.cards');
  //   cardsDOM.innerHTML = movieCard;
  //   expect(cardsDOM).toContainHTML(expectedMovieCard);
  // });
});

/**
 * when search value is 'the'.
 * The expected result of elements length which class name has 'hidden' will be 6
 * and rest will be 4
 */
describe('search by movie name', () => {
  //
  it('match seach value', () => {
    let visibleCards = 0;
    let hiddenCards = 0;
    const searchValue = 'the';
    cardsDOM.querySelectorAll('.card').forEach(card => {
      const movieName = card.querySelector('.name').textContent.toLowerCase();
      if (movieName.includes(searchValue)) {
        card.classList.remove('hidden');
        visibleCards++;
      } else {
        card.classList.add('hidden');
        hiddenCards++;
      }
    });
    expect(visibleCards).toBe(4);
    expect(hiddenCards).toBe(6);
  });
});

describe('filter by year dropdowns', () => {
  const fromYearDropdown = document.querySelector('.from-selection');
  const toYearDropdown = document.querySelector('.to-selection');
  const earliestYear = 1970;
  // Populate dropdowns that
  it('Populate dropdowns', () => {
    populateDropdown(fromYearDropdown, earliestYear);
    populateDropdown(toYearDropdown, earliestYear);
    toYearDropdown.disabled = true;

    expect(fromYearDropdown.children.length).toBe(54);
    expect(fromYearDropdown).toHaveDisplayValue('Select a year');
    expect(fromYearDropdown.children[0].selected).toBeTruthy();
    expect(toYearDropdown).toHaveDisplayValue('Select a year');
    expect(toYearDropdown).toBeDisabled();
  });

  it('select from year dropdown and populate to year dropdown', () => {
    fromYearDropdown.selectedIndex = '12'; // year: 2011
    toYearDropdown.innerHTML = '';
    toYearDropdown.disabled = false;
    populateDropdown(toYearDropdown, 2011);
    expect(toYearDropdown).not.toBeDisabled();
    expect(toYearDropdown.children.length).toBe(13); // 2011 ~ 2022 and select a year
  });

  it('filter movie cards by year dropdowns', () => {
    const fromYearValue = 1970;
    const toYearValue = 1983;
    let visibleCards = 0;
    let hiddenCards = 0;
    cardsDOM.querySelectorAll('.card').forEach(card => {
      const movieYear = card.querySelector('.year').textContent;
      if (movieYear >= fromYearValue && movieYear <= toYearValue) {
        card.classList.remove('hidden');
        visibleCards++;
      } else {
        card.classList.add('hidden');
        hiddenCards++;
      }
    });
    expect(visibleCards).toBe(5);
    expect(hiddenCards).toBe(5);
  });
});

describe('filter by checkbox', () => {
  it('filter movie cards by checkbox', () => {
    const filterVals = new Set();
    filterVals.add('PG');
    filterVals.add('R');
    const isValid = value => filterVals.size === 0 || filterVals.has(value);
    let visibleCards = 0;
    let hiddenCards = 0;
    cardsDOM.querySelectorAll('.card').forEach(card => {
      const movieRating = card.querySelector('.rating').textContent;
      if (filterVals.size > 0 && isValid(movieRating)) {
        card.classList.remove('hidden');
        visibleCards++;
      } else {
        card.classList.add('hidden');
        hiddenCards++;
      }
    });
    expect(visibleCards).toBe(6);
    expect(hiddenCards).toBe(4);
  });
});

describe('filter by slider', () => {
  it('Check range slider initalize value', () => {
    const rangeValue = document.querySelector('.runtime-range');
    expect(rangeValue).toHaveValue('50');
    expect(rangeValue).toHaveAttribute('min', '50');
    expect(rangeValue).toHaveAttribute('max', '200');
  });
  it('filter by slider', () => {
    const runtimeValue = 102;
    let visibleCards = 0;
    let hiddenCards = 0;
    cardsDOM.querySelectorAll('.card').forEach(card => {
      const movieRuntime = card
        .querySelector('.runtime')
        .textContent.replace(' minutes', '');
      if (movieRuntime >= runtimeValue) {
        card.classList.remove('hidden');
        visibleCards++;
      } else {
        card.classList.add('hidden');
        hiddenCards++;
      }
    });
    expect(visibleCards).toBe(7);
    expect(hiddenCards).toBe(3);
  });
});

describe('Filter by various filers', () => {
  it('filter with movie name and runtime', () => {
    const searchValue = 'the';
    const runtimeValue = 102;
    let visibleCards = 0;
    let hiddenCards = 0;
    cardsDOM.querySelectorAll('.card').forEach(card => {
      const movieName = card.querySelector('.name').textContent.toLowerCase();
      const movieRuntime = card
        .querySelector('.runtime')
        .textContent.replace(' minutes', '');
      if (movieRuntime >= runtimeValue && movieName.includes(searchValue)) {
        card.classList.remove('hidden');
        visibleCards++;
      } else {
        card.classList.add('hidden');
        hiddenCards++;
      }
    });
    expect(visibleCards).toBe(2);
    expect(hiddenCards).toBe(8);
  });

  it('filter with movie name, year, rating, and runtime', () => {
    const searchValue = 'the';
    const runtimeValue = 81;
    const fromYearValue = 1973;
    const toYearValue = 1985;
    const isValid = value => filterVals.size === 0 || filterVals.has(value);
    const filterVals = new Set();
    filterVals.add('R');
    let visibleCards = 0;
    let hiddenCards = 0;
    cardsDOM.querySelectorAll('.card').forEach(card => {
      const movieName = card.querySelector('.name').textContent.toLowerCase();
      const movieRuntime = card
        .querySelector('.runtime')
        .textContent.replace(' minutes', '');
      const movieYear = card.querySelector('.year').textContent;
      const movieRating = card.querySelector('.rating').textContent;

      if (
        movieRuntime >= runtimeValue &&
        movieName.includes(searchValue) &&
        movieYear >= fromYearValue &&
        movieYear <= toYearValue &&
        filterVals.size > 0 &&
        isValid(movieRating)
      ) {
        card.classList.remove('hidden');
        visibleCards++;
      } else {
        card.classList.add('hidden');
        hiddenCards++;
      }
    });
    expect(visibleCards).toBe(1);
    expect(hiddenCards).toBe(9);
  });
});
