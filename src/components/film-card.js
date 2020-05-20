import AbstractSmartComponent from "./abstract-smart-component";
import {TypesButton} from "../consts";
import {normalizeDuration, formatReleaseYear} from "../utils/common";

const createButtonMarkup = (name, isChecked) => {
  const setNameForClass = () => {
    let nameForClass;

    switch (name) {
      case TypesButton.FAVORITE:
        nameForClass = `${name}`;
        break;
      case TypesButton.WATCHLIST:
        nameForClass = `add-to-${name}`;
        break;
      case TypesButton.WATCHED:
        nameForClass = `mark-as-${name}`;
        break;
    }

    return nameForClass;
  };

  return (
    `<button type="button" class="film-card__controls-item button film-card__controls-item--${setNameForClass()} ${isChecked ? `film-card__controls-item--active` : ``}">
      ${name === TypesButton.WATCHLIST ? `Add to ${name}` : `Mark as ${name}`}
     </button>`
  );
};

const createFilmCardTemplate = (film, commentsAmount) => {
  const {name, poster, description, userRating, date, duration, genres} = film;
  const year = formatReleaseYear(date);

  const watchlistButton = createButtonMarkup(TypesButton.WATCHLIST, film.isWantToWatch);
  const watchedButton = createButtonMarkup(TypesButton.WATCHED, film.isWatched);
  const favoriteButton = createButtonMarkup(TypesButton.FAVORITE, film.isFavorite);
  const normalDuration = normalizeDuration(duration);

  return (
    `<article class="film-card">
          <h3 class="film-card__title">${name}</h3>
          <p class="film-card__rating">${userRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${normalDuration}</span>
            <span class="film-card__genre">${genres[0]}</span>
          </p>
          <img src=${poster} alt="${name}" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <a class="film-card__comments">${commentsAmount} comments</a>
          <form class="film-card__controls">
            ${watchlistButton}
            ${watchedButton}
            ${favoriteButton}
          </form>
        </article>`
  );
};

export default class FilmCard extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._commentsAmount = film.comments.length;

    this.openPopupClickHandler = null;
    this.watchlistButtonCLickHandler = null;
    this.watchedButtonClickHandler = null;
    this.favoriteButtonClickHandler = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._commentsAmount);
  }

  setOpenPopupClickHandler(handler) {
    const filmPoster = this.getElement().querySelector(`.film-card__poster`);
    const filmName = this.getElement().querySelector(`.film-card__title`);
    const filmCommentsBlock = this.getElement().querySelector(`.film-card__comments`);

    const filmClickedElements = Array.of(filmPoster, filmName, filmCommentsBlock);

    filmClickedElements.forEach((filmClickElement) => {
      filmClickElement.addEventListener(`click`, handler);
    });

    this.openPopupClickHandler = handler;
  }

  setAddWatchlistButtonCLickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);

    this.watchlistButtonCLickHandler = handler;
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);

    this.watchedButtonClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);

    this.favoriteButtonClickHandler = handler;
  }

  updateCommentsAmount(newCommentsAmount) {
    this._commentsAmount = newCommentsAmount;
    this.rerender();
  }

  recoveryListeners() {
    this.setOpenPopupClickHandler(this.openPopupClickHandler);
    this.setAddWatchlistButtonCLickHandler(this.watchlistButtonCLickHandler);
    this.setWatchedButtonClickHandler(this.watchedButtonClickHandler);
    this.setFavoriteButtonClickHandler(this.favoriteButtonClickHandler);
  }
}
