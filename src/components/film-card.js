import AbstractComponent from "./abstract-component";

const createFilmCardTemplate = (film, comments) => {
  const {name, poster, description, userRating, year, duration, genres} = film;

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
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
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
}
