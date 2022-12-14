const cardsDOM = document.querySelector('.cards');
const loadingDOM = document.querySelector('.loading');
const messageDOM = document.querySelector('.message');
const arrowDownDOM = document.querySelector('.arrow-down');
const arrowDownIcon = document.querySelector('.arrow');
const advancedSearchDOM = document.querySelector('.advanced-search');
const fromYearDropdown = document.querySelector('.from-selection');
const toYearDropdown = document.querySelector('.to-selection');
const runtimeRangeDOM = document.querySelector('.runtime-range');
const rangeValue = document.querySelector('.range-value');
const searchDOM = document.querySelector('.input-title');
const themeSwitcher = document.querySelector('.theme-switcher');
const sunIcon = document.querySelector('.bi-sun');
const moonIcon = document.querySelector('.bi-moon');
const sortButtons = document.querySelectorAll('.sort-button');
const resetButton = document.querySelector('.reset-button');
/**
 * function to set a given theme
 * */
function setTheme(themeName) {
  const element = document.body;
  localStorage.setItem('theme', themeName);
  if (themeName === 'light') {
    element.classList.remove('light');
    element.classList.add('dark');
    moonIcon.classList.remove('hidden');
    sunIcon.classList.add('hidden');
  } else {
    element.classList.remove('dark');
    element.classList.add('light');
    moonIcon.classList.add('hidden');
    sunIcon.classList.remove('hidden');
  }
}
/**
 * Toggle theme function to get theme
 */
function toggleTheme() {
  if (localStorage.getItem('theme') === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

/**
 * Run function to set the theme on initialization
 */
(function () {
  if (localStorage.getItem('theme') === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
})();

/**
 * Assign class name depends on rating value
 * @param {String} rating
 * @returns {String}
 */
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

/**
 * Movie card template
 * @param {{name: String, rating: String, runtime: String, year: String}[]} movies
 * @returns {String}
 */
function printMovieCard(movies) {
  const movieCard = movies.map(movie => {
    const { name, rating, runtime, year } = movie;
    return `
      <div class='card card-bg'>
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
/**
 * Create movie cards / add to dom
 * @param {{name: String, rating: String, runtime: String, year: String}[]} data
 */
function createMovieCards(data) {
  const movies = printMovieCard(data).join('');
  cardsDOM.innerHTML = movies;
}
/**
 * Load movies from /movies
 * Add movie cards to the DOM
 */
async function fetchMovies() {
  loadingDOM.style.display = 'flex';
  try {
    const { data } = await axios.get('/movies');
    if (data.length < 1) {
      // No Movies in the list
      messageDOM.style.padding = '100px 0';
      messageDOM.innerHTML =
        '<h5 class="empty-list">No movies in the list</h5>';
      loadingDOM.style.display = 'none';
      return;
    }
    createMovieCards(data);
  } catch (error) {
    messageDOM.style.padding = '100px 0';
    messageDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later.</h5>';
  }
  loadingDOM.style.display = 'none';
}

// fetch movies
fetchMovies();

/**
 * Populate options of dropdown with year starting 1970 to current year
 * @param {HTMLElement} element
 * @param {number} earliestYear
 */
function populateDropdown(element, earliestYear) {
  let currentYear = new Date().getFullYear();
  // populate options until current year
  while (currentYear >= earliestYear) {
    const dateOption = document.createElement('option');
    dateOption.text = currentYear;
    dateOption.value = currentYear;
    element.add(dateOption);
    currentYear -= 1;
  }
  // Add default option as first to dropdown
  element.insertBefore(new Option('Select a year', ''), element.firstChild);
  element.selectedIndex = '0';
}

/**
 * Create full year dropdown
 */
function createFullYearDropdown() {
  const earliestYear = 1970;
  populateDropdown(fromYearDropdown, earliestYear);
  populateDropdown(toYearDropdown, earliestYear);
  toYearDropdown.disabled = true;
}

// create year dropdowns
createFullYearDropdown();

/**
 * Select value to year dropdown
 * @param {string} value
 */
function filterByToYearDropdown(value) {
  // remove all options in dropdown
  toYearDropdown.innerHTML = '';
  // enable dropdown
  toYearDropdown.disabled = false;
  // populate to year dropdown depends on from selection
  populateDropdown(toYearDropdown, value);
}

// intialize filter values
const filterVals = new Set();
/**
 *
 * @param {string} value
 * @returns Boolean
 */
const isValid = value => filterVals.size === 0 || filterVals.has(value);

// select checkboxes elements
const checkboxes = document.querySelectorAll(
  '.checkbox > input[type="checkbox"]',
);

/**
 * Add, Delete target value into set
 * @param {target: {checked: boolean, value: string}}
 */
const filterByRating = ({ target: { checked, value } }) => {
  if (checked) filterVals.add(value);
  else filterVals.delete(value);
};

/**
 * Get value of card for sorting
 * @param {HTMLElement} element
 * @param {string} value
 * @returns {string | number}
 */
function getCardValue(element, value) {
  const elementText = element.querySelector(`.${value}`).innerText;
  // check if the sorting element is runtime
  if (elementText.includes('minutes')) {
    const runTime = Number(elementText.replace('minutes', ''));
    // return runtime number
    return runTime;
  }
  return elementText;
}

/**
 * Sort Data in ascending order based on button values (name, year, runtime)
 * @param {string} value
 */
function sortAscending(value) {
  Array.from(cardsDOM.querySelectorAll('.card'))
    .sort((a, b) => {
      const left = getCardValue(a, value);
      const right = getCardValue(b, value);
      const isSameValue = left === right;
      if (isSameValue) return false;
      if (left > right) return 1;
      return -1;
    })
    .forEach(node => cardsDOM.appendChild(node));
}
/**
 * Sort Data in descending order based on button values (name, year, runtime)
 * @param {string} value
 */
function sortDescending(value) {
  Array.from(cardsDOM.querySelectorAll('.card'))
    .sort((a, b) => {
      const left = getCardValue(a, value);
      const right = getCardValue(b, value);
      const isSameValue = left === right;
      if (isSameValue) return false;
      if (left < right) return 1;
      return -1;
    })
    .forEach(node => cardsDOM.appendChild(node));
}

/**
 * Clear and initialize value in search & filter
 */
resetButton.addEventListener('click', () => {
  // clear input field
  searchDOM.value = '';
  // reset year dropdowns
  toYearDropdown.innerHTML = '';
  fromYearDropdown.innerHTML = '';
  createFullYearDropdown();
  // reset checkbox
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  // reset Set()
  filterVals.clear();
  // reset range
  runtimeRangeDOM.value = 50;
  rangeValue.innerHTML = 50;
  // reset no cards
  messageDOM.style.padding = '0';
  messageDOM.innerHTML = '';
  // fetch movies
  fetchMovies();
});

/**
 * Add function to theme switch button
 */
themeSwitcher.addEventListener('click', () => toggleTheme());

/**
 * Change from year dropdown
 */
fromYearDropdown.addEventListener('change', e => {
  // console.log('from year', e.target.value);
  filterByToYearDropdown(e.target.value);
});

/**
 * iterate checkboxes to add function
 * initialize checkbox checked
 */
checkboxes.forEach(checkbox => {
  checkbox.checked = false;
  checkbox.addEventListener('click', filterByRating);
});

/**
 * Print range value
 * @param {event} e
 */
runtimeRangeDOM.oninput = function (e) {
  rangeValue.innerHTML = e.target.value;
};

/**
 * Click event on arrow icon
 * toggle advanced search box
 */
arrowDownDOM.addEventListener('click', e => {
  advancedSearchDOM.classList.toggle('collapsed');
  arrowDownIcon.classList.toggle('collapsed');
  resetButton.classList.toggle('collapsed');

  // focus on search input when its open
  if (!advancedSearchDOM.classList.contains('collapsed')) {
    searchDOM.focus();
  } else {
    searchDOM.blur();
  }
});

/**
 * Add event to sort button
 */
sortButtons.forEach(button => {
  button.addEventListener('click', e => {
    const buttonChildren = button.children[0];
    if (buttonChildren) {
      if (buttonChildren.classList.contains('desc')) {
        buttonChildren.classList.remove('desc');
        sortAscending(e.target.value);
      } else {
        buttonChildren.classList.add('desc');
        sortDescending(e.target.value);
      }
    }
  });
});

/**
 * Start all filter functions in one method, render card with conditions.
 */
document.addEventListener('change', e => {
  if (
    e.target.matches(
      '.input-title, .from-selection, .to-selection, input[type="checkbox"], .runtime-range',
    )
  ) {
    // Grab all filter values
    const searchInput = searchDOM.value.toLowerCase();
    const fromYearValue = fromYearDropdown.value;
    const toYearValue = toYearDropdown.value;
    const runtimeValue = parseInt(runtimeRangeDOM.value, 10);

    cardsDOM.querySelectorAll('.card').forEach(card => {
      const movieName = card.querySelector('.name').innerText.toLowerCase();
      const movieYear = card.querySelector('.year').innerText;
      const movieRating = card.querySelector('.rating').innerText;
      const movieRuntime = card
        .querySelector('.runtime')
        .innerText.replace(' minutes', '');
      // Add or remove class name based on filtering condition
      (searchInput ? movieName.includes(searchInput) : true) &&
      (fromYearValue ? movieYear >= fromYearValue : true) &&
      (toYearValue ? movieYear <= toYearValue : true) &&
      (filterVals.size > 0 ? isValid(movieRating) : true) &&
      (runtimeValue ? movieRuntime >= runtimeValue : true)
        ? card.classList.remove('hidden')
        : card.classList.add('hidden');
    });
    if (
      Array.from(cardsDOM.querySelectorAll('.card')).every(card =>
        card.classList.contains('hidden'),
      )
    ) {
      messageDOM.style.padding = '100px 0';
      messageDOM.innerHTML =
        '<h5 class="empty-list">No movies in the list</h5>';
    } else {
      messageDOM.style.padding = '0';
      messageDOM.innerHTML = '';
    }
  }
});
