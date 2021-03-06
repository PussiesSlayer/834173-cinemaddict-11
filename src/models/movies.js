import {getFilmsByFilter} from "../utils/filter";
import {FilterType, SortType} from "../consts";
import {getSortedFilms} from "../utils/sort";

export default class Movies {
  constructor() {
    this._films = [];

    this._activeFilterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._sortingChangeHandlers = [];
    this._dataLoadHandlers = [];
  }

  get() {
    const filteredFilms = getFilmsByFilter(this._films, this._activeFilterType);

    return getSortedFilms(filteredFilms, this._currentSortType);
  }

  getAll() {
    return this._films;
  }

  set(films) {
    this._films = films;
    this._callHandlers(this._dataLoadHandlers);
    this._callHandlers(this._dataChangeHandlers);
  }

  update(id, newData) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setSortType(sortType) {
    this._currentSortType = sortType;
    this._callHandlers(this._sortingChangeHandlers);
  }

  setSortChangeHandler(handler) {
    this._sortingChangeHandlers.push(handler);
  }

  setDataLoadHandler(handler) {
    this._dataLoadHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
