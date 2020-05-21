import CommentsComponent from "../components/comments";
import CommentModel from "../models/comment";
import {remove, render, replace, RenderPosition} from "../utils/render";
import {encode} from "he";

const parseFormData = (formData) => {
  return new CommentModel({
    "id": null,
    "author": null,
    "comment": encode(formData.get(`comment`)),
    "date": new Date().toISOString(),
    "emotion": formData.get(`comment-emoji`)
  }, null);
};

export default class CommentsController {
  constructor(container, onCommentsDataChange, film) {
    this._container = container;

    this._onCommentsDataChange = onCommentsDataChange;
    this._film = film;

    this._commentsComponent = null;
  }

  render(comments) {
    const oldCommentsComponent = this._commentsComponent;
    this._commentsComponent = new CommentsComponent(comments);

    this._commentsComponent.setDeleteButtonClickHandler((evt, i) => {
      evt.preventDefault();
      this._onCommentsDataChange(this._film, comments[i], null);
    });

    this._commentsComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._commentsComponent.getData();
      const data = parseFormData(formData);

      console.log(data);

      this._onCommentsDataChange(this._film, null, data);
    });

    if (oldCommentsComponent) {
      replace(this._commentsComponent, oldCommentsComponent);
    } else {
      render(this._container, this._commentsComponent, RenderPosition.BEFOREEND);
    }
  }

  destroy() {
    remove(this._commentsComponent);
    this._commentsComponent.removeEvents();
  }
}
