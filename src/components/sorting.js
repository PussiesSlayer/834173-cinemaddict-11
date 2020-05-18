import AbstractComponent from "./abstract-component";
import {SortType} from "../consts";

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
  const sortingDefaultMarkup = sortingTypes
    .map((type) => createSortingMarkup(type, type.checked)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortingDefaultMarkup}
     </ul>`
  );
};

export default class Sorting extends AbstractComponent {
  constructor(sortingTypes) {
    super();

    // this._currentSortType = SortType.DEFAULT;
    this._sortingTypes = sortingTypes;
  }

  getTemplate() {
    return createSortingTemplate(this._sortingTypes);
  }

  // getSortType() {
  //   return this._currentSortType;
  // }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      // if (sortType === this._currentSortType) {
      //   return;
      // }
      //
      // this._currentSortType = sortType;

      handler(sortType);
    });
  }

  // resetSorting() {
  //   this._currentSortType = SortType.DEFAULT;
  // }
}
