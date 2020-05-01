import {FilterType} from "../consts";

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

export const getFavoritesFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

export const getWantToWatchFilms = (films) => {
  return films.filter((film) => film.isWantToWatch);
};

export const getFilmsByFilms = (films, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.FAVORITES:
      return getFavoritesFilms(films);
    case FilterType.HISTORY:
      return getWatchedFilms(films);
    case FilterType.WATCHLIST:
      return getWantToWatchFilms(films);
  }

  return films;
};
