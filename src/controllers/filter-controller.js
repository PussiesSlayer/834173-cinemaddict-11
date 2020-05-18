import FilterComponent from "../components/filters";
import {FilterType} from "../consts";
import {replace, render, RenderPosition} from "../utils/render";
import {getFilmsByFilter} from "../utils/filter";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._filterComponent = null;
    this._activeFilterType = FilterType.ALL;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._filmsModel.setDataChangeHandlers(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilmsAll();
    const filters = Object.values(FilterType).map((type) => {
      return {
        title: type,
        count: getFilmsByFilter(allFilms, type).length,
        checked: type === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  setFilterClickHandler(handler) {
    this._filterComponent.setFilterClickHandler(handler);
  }

  _onFilterChange(filterType) {
    if (this._activeFilterType === filterType) {
      return;
    }

    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
