import CommentsComponent from "../components/comments";
import CommentsModel from "../models/comments";
import {appendChildComponent, removeChildComponent, remove, render, replace, RenderPosition} from "../utils/render";

export default class CommentsController {
  constructor(container, onCommentsDataChange) {
    this._container = container;

    this._onCommentsDataChange = onCommentsDataChange;

    this._commentsComponent = null;
  }

  render(comments) {
    const oldCommentsComponent = this._commentsComponent;
    this._commentsComponent = new CommentsComponent(comments);

    this._commentsComponent.setDeleteButtonClickHandler((evt, i) => {
      evt.preventDefault();
      this._onCommentsDataChange(comments[i], null);
    });

    this._commentsComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._commentsComponent.getData();
      // this._onCommentsDataChange(null, data);
      console.log(data);
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
