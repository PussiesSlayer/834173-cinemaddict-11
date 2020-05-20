import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import CommentsController from "../controllers/comments-controller";
import CommentsModel from "../models/comments";
import {appendChildComponent, removeChildComponent, remove, render, replace, RenderPosition} from "../utils/render";
import FilmModel from "../models/movie";

const PopupStatus = {
  SHOW: `show`,
  HIDE: `hide`,
};

const renderComments = (commentsContainer, comments, onCommentsDataChange, film) => {
  const commentsController = new CommentsController(commentsContainer, onCommentsDataChange, film);

  commentsController.render(comments);

  return commentsController;
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;

    this._api = api;
    this._film = null;

    this._filmPopupComponent = null;
    this._filmComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._commentsController = null;

    this._commentsModel = new CommentsModel();

    this._mode = PopupStatus.HIDE;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);

    this._commentsModel.setCommentsDataChangeHandlers(this._onCommentsDataChange);
  }

  render(film) {
    this._film = film;
    const oldFlmComponent = this._filmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._filmPopupComponent = new FilmPopupComponent(film);
    this._filmComponent = new FilmCardComponent(film);

    this._filmComponent.setOpenPopupClickHandler(() => {
      this._showFilmPopup();
      document.addEventListener(`keydown`, this._onEscKeyDown);

      this._updateComments(film);
    });

    this._filmPopupComponent.setCloseButtonClickHandler(() => {
      this._hideFilmPopup();
      this._removeComments();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    const changeWatchlistStatus = () => {
      const newFilm = FilmModel.clone(film);

      newFilm.isWantToWatch = !newFilm.isWantToWatch;

      this._onDataChange(film, newFilm);
    };

    const changeWatchedStatus = () => {
      const newFilm = FilmModel.clone(film);

      newFilm.isWatched = !newFilm.isWatched;

      this._onDataChange(film, newFilm);
    };

    const changeFavoriteStatus = () => {
      const newFilm = FilmModel.clone(film);

      newFilm.isFavorite = !newFilm.isFavorite;

      this._onDataChange(film, newFilm);
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
      if (this._mode === PopupStatus.SHOW) {
        this._updateComments(film);
      }
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _showFilmPopup() {
    const footerElement = document.querySelector(`.footer`);

    this._onViewChange();
    appendChildComponent(footerElement, this._filmPopupComponent);

    this._mode = PopupStatus.SHOW;
  }

  _hideFilmPopup() {
    const footerElement = document.querySelector(`.footer`);

    if (document.contains(this._filmPopupComponent.getElement())) {
      removeChildComponent(footerElement, this._filmPopupComponent);
    }

    this._mode = PopupStatus.HIDE;
  }

  setDefaultView() {
    if (this._mode !== PopupStatus.HIDE) {
      this._hideFilmPopup();
    }
  }

  _renderComments(comments) {
    const filmPopup = this._filmPopupComponent.getElement();
    const commentsContainer = filmPopup.querySelector(`.form-details__bottom-container`);
    this._commentsController = renderComments(commentsContainer, comments, this._onCommentsDataChange, this._film);
  }

  _removeComments() {
    if (this._commentsController === null) {
      return;
    }

    this._commentsController.destroy();
    this._commentsController = null;
  }

  _updateComments(film) {
    this._removeComments();
    this._api.getComments(film)
      .then((comments) => {
        this._renderComments(comments);
      });
  }

  _onEscKeyDown(evt) {
    const isEscapeKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscapeKey) {
      this._hideFilmPopup();
      this._removeComments();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _updateCommentsAmountAfterDelete(film, id) {
    film.removeComment(id);

    this._filmComponent.updateCommentsAmount(film.comments.length);
  }

  _updateCommentsAmountAfterAdd(film, id) {
    film.addComment(id);

    this._filmComponent.updateCommentsAmount(film.comments.length);
  }

  _onCommentsDataChange(film, oldData, newData) {
    if (oldData === null) {
      this._api.createComment(newData, film.id)
        .then(() => {
          this._commentsModel.addComment(newData);
          this._updateComments(film);

          this._updateCommentsAmountAfterAdd(film, newData.id);
        });
    } else
    if (newData === null) {
      this._api.deleteComment(oldData)
        .then(() => {
          this._commentsModel.removeComment(oldData.id);
          this._updateComments(film);

          this._updateCommentsAmountAfterDelete(film, oldData.id);
        });
    }
  }
}
