import AbstractComponent from "./abstract-component";

const createSortingMarkup = (sortType) => {
  const {type, checked} = sortType;

  return (
    `<li>
      <a href="#"
       data-sort-type="${type}"
        class="sort__button
         ${checked ? `sort__button--active` : ``}"
         >
        Sort by ${type}
        </a>
        </li>`
  );
};

const createSortingTemplate = (sortingTypes) => {
  const sortingMarkup = sortingTypes
    .map((type) => createSortingMarkup(type)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortingMarkup}
     </ul>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor(sortingTypes) {
    super();

    this._sortingTypes = sortingTypes;
  }

  getTemplate() {
    return createSortingTemplate(this._sortingTypes);
  }

  setTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      handler(sortType);
    });
  }
}
