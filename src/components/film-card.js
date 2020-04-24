import AbstractComponent from "./abstract-component";

const TypesButton = {
  ADD_TO_WATCHLIST: `Add to watchlist`,
  MARK_AS_WATCHED: `Mark as watched`,
  MARK_AS_FAVORITE: `favorite`,
};

const createButtonMarkup = (name) => {
  const nameForClass = name.toLowerCase().split(` `).join(`-`);

  return (
    `<button class="film-card__controls-item button film-card__controls-item--${nameForClass}">
      ${name === TypesButton.MARK_AS_FAVORITE ? `Mark as ${name}` : `${name}`}
     </button>`
  );
};

const createFilmCardTemplate = (film, comments) => {
  const {name, poster, description, userRating, date, duration, genres} = film;
  const year = date.getFullYear();

  const watchlistButton = createButtonMarkup(TypesButton.ADD_TO_WATCHLIST);
  const watchedButton = createButtonMarkup(TypesButton.MARK_AS_WATCHED);
  const favoriteButton = createButtonMarkup(TypesButton.MARK_AS_FAVORITE);

  return (
    `<article class="film-card">
          <h3 class="film-card__title">${name}</h3>
          <p class="film-card__rating">${userRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${duration}</span>
            <span class="film-card__genre">${genres[0]}</span>
          </p>
          <img src=${poster} alt="${name}" class="film-card__poster">
          <p class="film-card__description">${description}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            ${watchlistButton}
            ${watchedButton}
            ${favoriteButton}
          </form>
        </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film, this._comments);
  }

  setOpenPopupClickHandler(handler) {
    const filmPoster = this.getElement().querySelector(`.film-card__poster`);
    const filmName = this.getElement().querySelector(`.film-card__title`);
    const filmCommentsBlock = this.getElement().querySelector(`.film-card__comments`);

    const filmClickedElements = Array.of(filmPoster, filmName, filmCommentsBlock);

    filmClickedElements.forEach((filmClickElement) => {
      filmClickElement.addEventListener(`click`, handler);
    });
  }

  setAddWatchlistButtonCLickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
