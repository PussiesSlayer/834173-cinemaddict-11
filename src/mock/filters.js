import {films} from "./film-card";

const generateFilters = () => {
  return [
    {
      title: `All`,
    },
    {
      title: `Watchlist`,
      count: films.filter((film) => film.isWantToWatch).length,
    },
    {
      title: `History`,
      count: films.filter((film) => film.isWatched).length,
    },
    {
      title: `Favorites`,
      count: films.filter((film) => film.isFavorite).length,
    },
  ];
};

const filters = generateFilters();

export {filters};
