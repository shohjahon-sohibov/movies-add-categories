const elSearchForm = $_('.js-search-form')
const elTitleInput = $_(".js-search-form__title-input", elSearchForm);
const elRatingInput = $_(".js-search-form__rating-input", elSearchForm);
const elGenreSelect = $_(".js-search-form__genre-select", elSearchForm);
const elSortSelect = $_(".js-search-form__sort-select", elSearchForm);
const elSearchResults = $_(".search-results");

const elResultTemplate = $_("#search-result-template").content;

// Sort, categories and render at HTML 

const createGenreSelectOptions = () => {
  let movieCategories = [];

  normalizedMovies.forEach((movie) => {
    movie.categories.forEach((category) => {
      if (!movieCategories.includes(category)) {
        movieCategories.push(category)
      }
    })
  });

  movieCategories.sort()

  let elOptionsFragment = document.createDocumentFragment()
  movieCategories.forEach((category) => {
    let elCategoryOption = createElement('option', '', category);
    elCategoryOption.value = category.toLowerCase();

    elOptionsFragment.appendChild(elCategoryOption);
  })

  elGenreSelect.appendChild(elOptionsFragment);
};

createGenreSelectOptions()

let render = (searchResults, searchRegex) => {
  elSearchResults.innerHTML = '';

  let elResultsFragment = document.createDocumentFragment();

  searchResults.forEach((movie)=> {
    let elMovie = elResultTemplate.cloneNode(true);
    $_('.movie__poster', elMovie).src = movie.smallImage;
    $_('.movie__title', elMovie).textContent = movie.title;

    if (searchRegex === '(?:)') {
      $_('.movie__title', elMovie).textContent = movie.title
    } else {
      $_('.movie__title', elMovie).innerHTML = movie.title.replace(searchRegex, `<mark class = "px = 0">${searchRegex}</mark>`);
    }
      
      $_('.movie__year', elMovie).textContent = movie.year;
      $_('.movie__rating', elMovie).textContent = movie.imdbRating;
      $_('.movie-trailer-link', elMovie).href = movie.trailer;

      elResultsFragment.appendChild(elMovie);
  });
  elSearchResults.appendChild(elResultsFragment)
};

let sortObjectsAZ = (array) => {
  return array.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1
    } else if (a.year > b.year) {
      return 1
    } else if (a.year < b.year) {
      return -1
    } else if (a.imdbRating > b.imdbRating) {
      return 1
    } else if (a.imdbRating < b.imdbRating) {
      return -1
    }
    return 0
  })
};

let sortSearchResults = (results, sortType) => {
  if (sortType === 'az') {
    return sortObjectsAZ(results)
  } else if (sortType === 'za') {
    return sortObjectsAZ(results).reverse();
  } else if (sortType === 'rating_desc') {
    return sortObjectsAZ(results)
  } else if (sortType === 'rating_asc') {
    return sortObjectsAZ(results).reverse()
  } else if (sortType === 'year_desc') {
    return sortObjectsAZ(results)
  } else if (sortType === 'year_asc') {
    return sortObjectsAZ(results).reverse()
  }
};

let findMovies = (title, minRating, genre) => {
  return normalizedMovies.filter((movie) => {
    let searchQuery = new RegExp(genre, 'gi');
    let doesMatchCategories = genre === 'all' || movie.categories.join(' ').match(searchQuery) ? true : false;
console.log(doesMatchCategories, movie.title.match(title), movie.imdbRating >= minRating);
    return (
      movie.title.match(title) &&
      movie.imdbRating >= minRating &&
      doesMatchCategories
    )
  })
};

elSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();

 let searchTitle = elTitleInput.value.trim();
 let movieTitleRegex = new RegExp(searchTitle, 'gi');
 let minimumRating = Number(elRatingInput.value);
 let genre = elGenreSelect.value;
 let sorting = elSortSelect.value;

 let searchResults = findMovies(movieTitleRegex, minimumRating, genre);
 console.log(searchResults);
 let test = sortSearchResults(searchResults, sorting);
 console.log(test);

 render(searchResults, movieTitleRegex);
});