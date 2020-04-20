import AbstractComponent from "./abstract-component";

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

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}
