import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {appendChildComponent, remove, render, replace, RenderPosition} from "../utils/render";

const PopupStatus = {
  SHOW: `show`,
  HIDE: `hide`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._filmPopupComponent = null;
    this._filmComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = PopupStatus.HIDE;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const oldFlmComponent = this._filmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._filmPopupComponent = new FilmPopupComponent(film);
    this._filmComponent = new FilmCardComponent(film);

    this._filmComponent.setOpenPopupClickHandler(() => {
      this._showFilmPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._filmPopupComponent.setCloseButtonClickHandler(() => {
      this._hideFilmPopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

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

    if (oldFlmComponent && oldFilmPopupComponent) {
      replace(this._filmComponent, oldFlmComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }

  _showFilmPopup() {
    const footerElement = document.querySelector(`.footer`);

    this._onViewChange();
    appendChildComponent(footerElement, this._filmPopupComponent);

    this._mode = PopupStatus.SHOW;
  }

  _hideFilmPopup() {
    if (this._filmPopupComponent) {
      this._filmPopupComponent.reset();
      remove(this._filmPopupComponent);
      this._mode = PopupStatus.HIDE;
    }
  }

  _onEscKeyDown(evt) {
    const isEscapeKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscapeKey) {
      this._hideFilmPopup();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== PopupStatus.HIDE) {
      this._hideFilmPopup();
    }
  }
}
