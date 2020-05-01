import FilterComponet from "../components/filters";
import {FilterType} from "../consts";
import {replace, render, RenderPosition} from "../utils/render";

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
        count: allFilms.length,
        checked: type === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponet(filters);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange() {}

  _onDataChange() {}
}
