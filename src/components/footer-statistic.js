import {createElement} from "../utils";

const createFooterStatisticTemplate = () => {
  return (
    `<p>130 291 movies inside</p>`
  );
};

export default class FooterStatistic {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticTemplate();
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
