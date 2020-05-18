import {SortType} from "../consts";

export const getSortedFilms = (films, sortType) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.date - a.date);
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.userRating - a.userRating);
      break;
  }

  return sortedFilms;
};
