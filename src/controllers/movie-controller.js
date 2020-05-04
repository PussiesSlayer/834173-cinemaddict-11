import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import CommentsComponent from "../components/comments";
import {appendChildComponent, removeChildComponent, remove, render, replace, RenderPosition} from "../utils/render";

const PopupStatus = {
  SHOW: `show`,
  HIDE: `hide`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._filmPopupComponent = null;
    this._filmComponent = null;
    this._commentsComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = PopupStatus.HIDE;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const oldFlmComponent = this._filmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;
    const oldCommentsComponent = this._commentsComponent;

    this._filmPopupComponent = new FilmPopupComponent(film);
    this._filmComponent = new FilmCardComponent(film);
    this._commentsComponent = new CommentsComponent(film.comments);

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

    if (oldFlmComponent && oldFilmPopupComponent && oldCommentsComponent) {
      replace(this._filmComponent, oldFlmComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
    remove(this._commentsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _showFilmPopup() {
    const footerElement = document.querySelector(`.footer`);
    const commentsContainer = this._filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`);

    this._onViewChange();
    appendChildComponent(footerElement, this._filmPopupComponent);

    render(commentsContainer, this._commentsComponent, RenderPosition.BEFOREEND);

    this._mode = PopupStatus.SHOW;
  }

  _hideFilmPopup() {
    const footerElement = document.querySelector(`.footer`);
    const commentsContainer = this._filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`);

    this._filmPopupComponent.reset();
    this._commentsComponent.reset();

    if (document.contains(this._filmPopupComponent.getElement())) {
      removeChildComponent(footerElement, this._filmPopupComponent);
      removeChildComponent(commentsContainer, this._commentsComponent);
    }

    this._mode = PopupStatus.HIDE;
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
