import NoFilmsComponent from "../components/no-films";
import ShowMoreButtonComponent from "../components/show-more-button";
import TopRatedComponent from "../components/top-rated";
import MostCommentedComponent from "../components/most-commented";
import MovieController from "./movie-controller";
import {remove, render, RenderPosition} from "../utils/render";
import {CARDS_COUNT_DEFAULT, CARDS_COUNT_BY_BUTTON, NO_FILMS} from "../consts";
import {getMostCommentedFilms, getTopRatedFilms} from "../utils/extra-films";

const renderFilms = (filmsListElement, films, onDataChange, onViewChange, api) => {
  return films.map((film) => {
    const movieController = new MovieController(filmsListElement, onDataChange, onViewChange, api);

    movieController.render(film);

    return movieController;
  });
};

export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._api = api;

    this._showedFilmControllers = [];
    this._topRatedFilmControllers = [];
    this._mostCommentedFilmsControllers = [];

    this._showingFilmsCount = CARDS_COUNT_DEFAULT;

    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._mostCommentedComponent = new MostCommentedComponent();
    this._topRatedComponent = new TopRatedComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
    this._filmsModel.setSortChangeHandler(this._onSortTypeChange);
  }

  render() {
    const container = this._container.getElement();
    const films = this._filmsModel.get();

    const filmsListWrap = container.querySelector(`.films-list`);

    if (films.length === NO_FILMS) {
      render(filmsListWrap, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }

    this._renderTopRatedBlock();
    this._renderMostCommentedBlock();
    this._renderFilms(films.slice(0, this._showingFilmsCount));
    this._renderShowMoreButton();
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  _renderFilms(films) {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list__container`);

    const newFilms = renderFilms(filmsListElement, films, this._onDataChange, this._onViewChange, this._api);

    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._showingFilmsCount = this._showedFilmControllers.length;
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.get().slice(0, count));
    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list__container`);

    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCount >= this._filmsModel.get().length) {
      return;
    }

    render(filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);

    this._showMoreButtonComponent.setCLickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list__container`);

    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount = this._showingFilmsCount + CARDS_COUNT_BY_BUTTON;
    const films = this._filmsModel.get();

    const newFilms = renderFilms(filmsListElement, films.slice(prevFilmsCount, this._showingFilmsCount), this._onDataChange, this._onViewChange, this._api);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    if (this._showingFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderMostCommentedBlock() {
    const container = this._container.getElement();
    const films = this._filmsModel.get();

    const mostCommentedFilms = getMostCommentedFilms(films);

    if (mostCommentedFilms.length === 0) {
      return;
    }

    if (this._mostCommentedComponent !== null) {
      remove(this._mostCommentedComponent);
    }

    render(container, this._mostCommentedComponent, RenderPosition.BEFOREEND);

    const filmsMostCommentedContainerElement = this._mostCommentedComponent.getElement().querySelector(`.films-list__container`);

    const newMostCommentedFilms = renderFilms(filmsMostCommentedContainerElement, mostCommentedFilms, this._onDataChange, this._onViewChange, this._api);
    this._mostCommentedFilmsControllers = this._mostCommentedFilmsControllers.concat(newMostCommentedFilms);
  }

  _renderTopRatedBlock() {
    const container = this._container.getElement();
    const films = this._filmsModel.get();

    const topRatedFilms = getTopRatedFilms(films);

    if (topRatedFilms.length === 0) {
      return;
    }

    render(container, this._topRatedComponent, RenderPosition.BEFOREEND);

    const filmsTopRatedContainerElement = this._topRatedComponent.getElement().querySelector(`.films-list__container`);

    const newTopRatedFilms = renderFilms(filmsTopRatedContainerElement, topRatedFilms, this._onDataChange, this._onViewChange, this._api);
    this._topRatedFilmControllers = this._topRatedFilmControllers.concat(newTopRatedFilms);
  }

  _onFilterChange() {
    this._updateFilms(CARDS_COUNT_DEFAULT);
  }

  _onSortTypeChange() {
    this._updateFilms(CARDS_COUNT_DEFAULT);
  }

  _onDataChange(oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
      .then((filmModel) => {
        const isSuccess = this._filmsModel.update(oldData.id, filmModel);

        if (isSuccess) {
          [...this._showedFilmControllers, ...this._topRatedFilmControllers, ...this._mostCommentedFilmsControllers]
            .forEach((it) => {
              const film = it._filmComponent._film;

              if (film === oldData) {
                it.render(newData);
              }
            });
        }
      });
  }

  _onViewChange() {
    [...this._showedFilmControllers, ...this._topRatedFilmControllers, ...this._mostCommentedFilmsControllers]
      .forEach((it) => it.setDefaultView());
  }
}
