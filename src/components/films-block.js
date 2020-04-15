import {createElement} from "../utils";

const createFilmsBlockTemplate = () => {
  return (
    `<section class="films">
       <section class="films-list">
         <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
         <div class="films-list__container"></div>
      </section>
    </section>`
  );
};

export default class FilmsBlock {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsBlockTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
