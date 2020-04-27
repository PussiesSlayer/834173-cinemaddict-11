import AbstractSmartComponent from "./abstract-smart-component";
import {EMOGIES, TypesButton} from "../consts";
import {formatReleaseDate, formatDateOfComment} from "../utils/common";

const createCommentsMarkup = (comments) => {
  return comments
    .map((comment) => {
      const commentDate = formatDateOfComment(comment.date);

      return (
        `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-angry">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.message}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.userName}</span>
                <span class="film-details__comment-day">${commentDate}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>
        `
      );
    }).join(`\n`);
};

const createInstallEmojiMarkup = (emogies, chosenEmoji) => {
  return emogies
    .map((emoji) => {
      return (
        `<input 
          class="film-details__emoji-item visually-hidden"
          name="comment-emoji" 
          type="radio" 
          id="emoji-${emoji}" 
          value="${emoji}"
          ${chosenEmoji === emoji ? `checked` : ``}
          >
                <label class="film-details__emoji-label" for="emoji-${emoji}">
              <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
            </label>`
      );
    }).join(`\n`);
};

const createNewCommentMarkup = (chosenEmoji) => {
  const installingEmojiMarkup = createInstallEmojiMarkup(EMOGIES, chosenEmoji);

  return (
    `<div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
            ${chosenEmoji !== null ? `<img src="images/emoji/${chosenEmoji}.png" width="55" height="55" alt="emoji-${chosenEmoji}">` : ``}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${installingEmojiMarkup}
          </div>
        </div>`
  );
};

const createCheckboxMarkup = (name, isChecked) => {
  const setDescriptionButton = () => {
    let descriptionButton;

    switch (name) {
      case TypesButton.FAVORITE:
        descriptionButton = `Add to favorites`;
        break;
      case TypesButton.WATCHLIST:
        descriptionButton = `Add to ${name}`;
        break;
      case TypesButton.WATCHED:
        descriptionButton = `Already ${name}`;
        break;
    }

    return descriptionButton;
  };

  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isChecked ? `checked` : ``}>
     <label for="${name}" class="film-details__control-label film-details__control-label--${name}">
        ${setDescriptionButton()}
     </label>`
  );
};

const createFilmPopupTemplate = (film, comments, options = {}) => {
  const {
    name,
    poster,
    originalName,
    director,
    writers,
    date,
    description,
    userRating,
    duration,
    genres,
    ratingByAge,
    actors,
    country,
  } = film;

  const {chosenEmoji} = options;

  const genreTitle = genres.length > 1 ? `Genres` : `Genre`;
  const commentsMarkup = createCommentsMarkup(comments);
  const newCommentMarkup = createNewCommentMarkup(chosenEmoji);

  const releaseDate = formatReleaseDate(date);

  const watchlistCheckbox = createCheckboxMarkup(TypesButton.WATCHLIST, film.isWantToWatch);
  const watchedCheckbox = createCheckboxMarkup(TypesButton.WATCHED, film.isWatched);
  const favoriteCheckbox = createCheckboxMarkup(TypesButton.FAVORITE, film.isFavorite);

  return (
    `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${poster} alt="${name}">

          <p class="film-details__age">${ratingByAge}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${originalName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${userRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genreTitle}</td>
              <td class="film-details__cell">
                ${
    genres.map((genre) => {
      return `<span class="film-details__genre">${genre}</span>`;
    }).join(` `)
    }
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        ${watchlistCheckbox}
        ${watchedCheckbox}
        ${favoriteCheckbox}
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
         ${commentsMarkup}
        </ul>

        ${newCommentMarkup}
        </div>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class FilmPopup extends AbstractSmartComponent {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._chosenEmoji = null;

    this._closeHandler = null;
    this._addWatchlistCheckboxChangeHandler = null;
    this._watchedCheckboxChangeHandler = null;
    this._favoriteCheckboxChangeHandler = null;

    this._setEmojiRadioChangeHandler();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film, this._comments, {
      chosenEmoji: this._chosenEmoji,
    });
  }

  setCloseButtonClickHandler(handler) {
    const closePopupButton = this.getElement().querySelector(`.film-details__close-btn`);

    closePopupButton.addEventListener(`click`, handler);

    this._closeHandler = handler;
  }

  setAddWatchlistCheckboxChangeHandler(handler) {
    this.getElement().querySelector(`#watchlist`)
      .addEventListener(`change`, handler);

    this._addWatchlistCheckboxChangeHandler = handler;
  }

  setWatchedCheckboxChangeHandler(handler) {
    this.getElement().querySelector(`#watched`)
      .addEventListener(`change`, handler);

    this._watchedCheckboxChangeHandler = handler;
  }

  setFavoriteCheckboxChangeHandler(handler) {
    this.getElement().querySelector(`#favorite`)
      .addEventListener(`change`, handler);

    this._favoriteCheckboxChangeHandler = handler;
  }

  _setEmojiRadioChangeHandler() {
    const emogies = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    emogies.forEach((emoji) => {
      emoji.addEventListener(`change`, (evt) => {
        this._chosenEmoji = evt.target.value;

        this.rerender();
      });
    });
  }

  recoveryListeners() {
    this._setEmojiRadioChangeHandler();
    this.setCloseButtonClickHandler(this._closeHandler);
    this.setAddWatchlistCheckboxChangeHandler(this._addWatchlistCheckboxChangeHandler);
    this.setWatchedCheckboxChangeHandler(this._watchedCheckboxChangeHandler);
    this.setFavoriteCheckboxChangeHandler(this._favoriteCheckboxChangeHandler);
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._chosenEmoji = null;

    this.rerender();
  }
}
