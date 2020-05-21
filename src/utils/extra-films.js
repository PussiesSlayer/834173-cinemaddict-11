import {CARDS_COUNT_SPECIAL} from "../consts";

export const getMostCommentedFilms = () => {};

export const getTopRatedFilms = (films) => {
  return films.slice()
    .sort((a, b) => b.userRating - a.userRating)
    .slice(0, CARDS_COUNT_SPECIAL)
    .filter((film) => film.userRating !== 0);
};
