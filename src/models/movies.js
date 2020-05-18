import {getFilmsByFilter} from "../utils/filter";
import {FilterType, SortType} from "../consts";
import {getSortingFilms} from "../utils/sort";

export default class Movies {
  constructor() {
    this._films = [];

    this._activeFilterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
    this._sortingChangeHandlers = [];
  }

  getFilms() {
    const filteredFilms = getFilmsByFilter(this._films, this._activeFilterType);
    return getSortingFilms(filteredFilms, this._currentSortType);
  }

  getFilmsAll() {
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilm(id, newData) {
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

  setSortTypeChangeHandler(handler) {
    this._sortingChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
