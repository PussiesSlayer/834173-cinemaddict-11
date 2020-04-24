import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {appendChildComponent, remove, render, RenderPosition} from "../utils/render";

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;

    this._filmPopupComponent = null;
    this._filmComponent = null;
    this._onDataChange = onDataChange;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film, comments) {
    this._filmPopupComponent = new FilmPopupComponent(film, comments);
    this._filmComponent = new FilmCardComponent(film, comments);

    this._filmComponent.setOpenPopupClickHandler(() => {
      this._showFilmPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._filmComponent, RenderPosition.BEFOREEND);

    const changeWatchlistStatus = () => {
      this._onDataChange(film, Object.assign({}, film, {
        isWantToWatch: !film.isWantToWatch,
      }));
    };

    const changeWatchedStatus = () => {
      this._onDataChange(film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    };

    const changeFavoriteStatus = () => {
      this._onDataChange(film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    };

    this._filmComponent.setAddWatchlistButtonCLickHandler(changeWatchlistStatus);
    this._filmComponent.setWatchedButtonClickHandler(changeWatchedStatus);
    this._filmComponent.setFavoriteButtonClickHandler(changeFavoriteStatus);
    this._filmPopupComponent.setAddWatchlistCheckboxChangeHandler(changeWatchlistStatus);
    this._filmPopupComponent.setWatchedCheckboxChangeHandler(changeWatchedStatus);
    this._filmPopupComponent.setFavoriteCheckboxChangeHandler(changeFavoriteStatus);
  }

  _showFilmPopup() {
    const footerElement = document.querySelector(`.footer`);

    appendChildComponent(footerElement, this._filmPopupComponent);

    this._filmPopupComponent.setCloseButtonClickHandler(() => {
      this._hideFilmPopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });
  }

  _hideFilmPopup() {
    if (this._filmPopupComponent) {
      remove(this._filmPopupComponent);
    }
  }

  _onEscKeyDown(evt) {
    const isEscapeKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscapeKey) {
      this._hideFilmPopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
