import NoFilmsComponent from "../components/no-films";
import ShowMoreButtonComponent from "../components/show-more-button";
import TopRatedComponent from "../components/top-rated";
import MostCommentedComponent from "../components/most-commented";
import SortingComponent from "../components/sorting";
import MovieController from "./movie-controller";
import {remove, render, RenderPosition} from "../utils/render";
import {CARDS_COUNT_SPECIAL, CARDS_COUNT_DEFAULT, CARDS_COUNT_BY_BUTTON, NO_FILMS, SortType} from "../consts";

const renderFilms = (filmsListElement, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const movieController = new MovieController(filmsListElement, onDataChange, onViewChange);

    movieController.render(film);

    return movieController;
  });
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
    case SortType.BY_RATING:
      sortedFilms = showingFilms.sort((a, b) => b.userRating - a.userRating);
      break;
    case SortType.BY_DATE:
      sortedFilms = showingFilms.sort((a, b) => b.date - a.date);
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._showedFilmControllers = [];
    this._topRatedFilmControllers = [];
    this._mostCommentedFilmsControllers = [];

    this._showingFilmsCount = CARDS_COUNT_DEFAULT;

    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortingComponent = new SortingComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(films) {
    const container = this._container.getElement();
    this._films = films;

    const filmsListElement = container.querySelector(`.films-list__container`);
    const filmsListWrap = container.querySelector(`.films-list`);

    if (films.length === NO_FILMS) {
      render(filmsListWrap, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    this._renderExtraBlocks(container, films, this._onDataChange, this._onViewChange);

    const newFilms = renderFilms(filmsListElement, films.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    const container = this._container.getElement();

    if (this._showingFilmsCount >= this._films.length) {
      return;
    }

    const filmsListElement = container.querySelector(`.films-list__container`);

    render(filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);

    this._showMoreButtonComponent.setCLickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + CARDS_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortingComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);

      const newFilms = renderFilms(filmsListElement, sortedFilms, this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _renderExtraBlocks(container, films, onDataChange, onViewChange) {
    if (films.length === NO_FILMS) {
      return;
    }

    const mostCommentedFilms = films.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);
    const topRatedFilms = films.slice().sort((a, b) => a.userRating > b.userRating ? -1 : 1);

    const topRatedComponent = new TopRatedComponent();
    const mostCommentedComponent = new MostCommentedComponent();

    render(container, topRatedComponent, RenderPosition.BEFOREEND);
    render(container, mostCommentedComponent, RenderPosition.BEFOREEND);

    const filmsTopRatedContainerElement = topRatedComponent.getElement().querySelector(`.films-list__container`);
    const newTopRatedFilms = renderFilms(filmsTopRatedContainerElement, topRatedFilms.slice(0, CARDS_COUNT_SPECIAL), onDataChange, onViewChange);
    this._topRatedFilmControllers = this._topRatedFilmControllers.concat(newTopRatedFilms);

    const filmsMostCommentedContainerElement = mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    const newMostCommentedFilms = renderFilms(filmsMostCommentedContainerElement, mostCommentedFilms.slice(0, CARDS_COUNT_SPECIAL), onDataChange, onViewChange);
    this._mostCommentedFilmsControllers = this._mostCommentedFilmsControllers.concat(newMostCommentedFilms);
  }

  _onSortTypeChange(sortType) {
    const container = this._container.getElement();

    this._showingFilmsCount = CARDS_COUNT_BY_BUTTON;

    const filmsListElement = container.querySelector(`.films-list__container`);

    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmsCount);

    filmsListElement.innerHTML = ``;

    const newFilms = renderFilms(filmsListElement, sortedFilms, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
  }

  _onDataChange(oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    [...this._showedFilmControllers, ...this._topRatedFilmControllers, ...this._mostCommentedFilmsControllers]
      .forEach((it) => {
        const film = it._filmComponent._film;

        if (film === oldData) {
          it.render(newData);
        }
      });
  }

  _onViewChange() {
    [...this._showedFilmControllers, ...this._topRatedFilmControllers, ...this._mostCommentedFilmsControllers]
      .forEach((it) => it.setDefaultView());
  }
}
