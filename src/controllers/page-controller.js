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
  constructor(container, filmsModel, commentsModel) {
    this._container = container;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
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
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const films = this._filmsModel.getFilms();
    const comments = this._commentsModel.getComments();

    const filmsListWrap = container.querySelector(`.films-list`);

    if (films.length === NO_FILMS) {
      render(filmsListWrap, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREBEGIN);

    this._renderExtraBlocks(container, films, this._onDataChange, this._onViewChange);
    this._renderFilms(films.slice(0, this._showingFilmsCount));
    this._renderShowMoreButton();
  }

  _renderFilms(films) {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list__container`);

    const newFilms = renderFilms(filmsListElement, films, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._showingFilmsCount = this._showedFilmControllers.length;
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list__container`);

    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);

    this._showMoreButtonComponent.setCLickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    const prevFilmsCount = this._showingFilmsCount;
    const films = this._filmsModel.getFilms();

    this._showingFilmsCount = this._showingFilmsCount + CARDS_COUNT_BY_BUTTON;

    const sortedFilms = getSortedFilms(films, this._sortingComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);
    this._renderFilms(sortedFilms);

    if (this._showingFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
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
    this._showingFilmsCount = CARDS_COUNT_BY_BUTTON;
    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);
    this._removeFilms();
    this._renderFilms(sortedFilms);

    this._renderShowMoreButton();
  }

  _onDataChange(oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      [...this._showedFilmControllers, ...this._topRatedFilmControllers, ...this._mostCommentedFilmsControllers]
        .forEach((it) => {
          const film = it._filmComponent._film;

          if (film === oldData) {
            it.render(newData);
          }
        });
    }
  }

  _onViewChange() {
    [...this._showedFilmControllers, ...this._topRatedFilmControllers, ...this._mostCommentedFilmsControllers]
      .forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateFilms(CARDS_COUNT_DEFAULT);
  }
}
