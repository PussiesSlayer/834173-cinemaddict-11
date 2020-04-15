import {createElement} from "../utils";

const createFilterMarkup = (filter, isChecked) => {
  const {title, count} = filter;
  const isAllFilter = title.toLowerCase() === `all`;

  return (
    `<a href="#${title.toLowerCase()}"
      class="main-navigation__item 
      ${isChecked ? `main-navigation__item--active` : ``}"
     >
     ${isAllFilter ? `${title} movies` : title}
     ${isAllFilter ? `` : `<span class="main-navigation__item-count">${count}</span>`}
     </a>`
  );
};

const createFiltersTemplate = (filters) => {
  const filterMarkup = filters
    .map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<div class="main-navigation__items">
        ${filterMarkup}
     </div>`
  );
};

export default class Filters {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
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
