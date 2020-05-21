import AbstractSmartComponent from "./abstract-smart-component";
import {formatDateOfComment} from "../utils/common";
import {EMOGIES, RED_SHINING_STYLE} from "../consts";

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

const createNewCommentMarkup = (chosenEmoji, formIsAvailable, commentText) => {
  const installingEmojiMarkup = createInstallEmojiMarkup(EMOGIES, chosenEmoji);

  return (
    `<div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
            ${chosenEmoji !== null ? `<img src="images/emoji/${chosenEmoji}.png" width="55" height="55" alt="emoji-${chosenEmoji}">` : ``}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${formIsAvailable ? `` : `disabled`}>${commentText}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${installingEmojiMarkup}
          </div>
        </div>`
  );
};

const createCommentsTemplate = (comments, options = {}) => {
  const {chosenEmoji, formIsAvailable, commentText} = options;

  const commentsMarkup = createCommentsMarkup(comments);
  const newCommentMarkup = createNewCommentMarkup(chosenEmoji, formIsAvailable, commentText);

  return (
    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
         ${commentsMarkup}
        </ul>

        ${newCommentMarkup}
        </div>
      </section>`
  );
};

export default class Comments extends AbstractSmartComponent {
  constructor(comments) {
    super();

    this._comments = comments;
    this._chosenEmoji = null;
    this._commentText = ``;
    this._formIsAvailable = true;

    this._deleteButtonCLickHandler = null;

    this._pressedButtons = {};
    this._keyUpHandler = () => {
      this._pressedButtons = {};
    };

    this._submitGenerateHandler = null;

    this._setEmojiRadioChangeHandler();
    this._setTextareaChangeHandler();
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, {
      chosenEmoji: this._chosenEmoji,
      formIsAvailable: this._formIsAvailable,
      commentText: this._commentText,
    });
  }

  recoveryListeners() {
    this._setEmojiRadioChangeHandler();
    this._setTextareaChangeHandler();
    this.setDeleteButtonClickHandler(this._deleteButtonCLickHandler);
    this.setSubmitHandler(this._submitInitialHandler);
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._chosenEmoji = null;

    this.rerender();
  }

  removeElement() {
    super.removeElement();
  }

  getData() {
    const form = document.querySelector(`form.film-details__inner`);

    return new FormData(form);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement()
      .querySelectorAll(`.film-details__comment-delete`)
      .forEach((button, i) => {
        button.addEventListener(`click`, (evt) => handler(evt, i));
      });

    this._deleteButtonCLickHandler = handler;
  }

  removeEvents() {
    document.removeEventListener(`keydown`, this._submitGenerateHandler);
    document.removeEventListener(`keyup`, this._keyUpHandler);
  }

  setSubmitHandler(handler) {
    this._submitGenerateHandler = this._getSubmitHandler(handler);
    this._submitInitialHandler = handler;

    document.addEventListener(`keydown`, this._submitGenerateHandler);
    document.addEventListener(`keyup`, this._keyUpHandler);
  }

  _getSubmitHandler(handler) {
    return (evt) => {
      const isCtrlKey = evt.key === `Meta` || evt.key === `Control`;
      const isEnterKey = evt.key === `Enter`;

      if (isEnterKey) {
        this._pressedButtons.enter = true;
      } else if (isCtrlKey) {
        this._pressedButtons.ctrl = true;
      }

      if (this._pressedButtons.ctrl && this._pressedButtons.enter) {
        handler(evt);
      }
    };
  }

  _setEmojiRadioChangeHandler() {
    const emogies = this.getElement().querySelectorAll(`.film-details__emoji-item`);

    emogies.forEach((emoji) => {
      emoji.addEventListener(`change`, (evt) => {
        this._chosenEmoji = evt.target.value;

        this._removeError();
        this.removeEvents();
        this._setCommentAfterUpdate();
      });
    });
  }

  _setCommentAfterUpdate() {
    const comment = this.getElement().querySelector(`.film-details__comment-input`);
    comment.value = this._commentText;
    this.rerender();
  }

  _setTextareaChangeHandler() {
    const comment = this.getElement().querySelector(`.film-details__comment-input`);

    comment.addEventListener(`input`, (evt) => {
      this._commentText = evt.target.value;

      this._removeError();
    });
  }

  addError() {
    const element = this.getElement().querySelector(`.film-details__comment-input`);

    element.classList.add(`error`);
  }

  _removeError() {
    const element = this.getElement().querySelector(`.film-details__comment-input`);

    element.classList.remove(`error`);
  }

  disabledForm() {
    this._formIsAvailable = false;
    // this.rerender();
  }

  unlockForm() {
    this._formIsAvailable = true;
  }
}
