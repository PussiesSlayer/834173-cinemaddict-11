import SortingComponent from "../components/sorting";
import {SortType} from "../consts";
import {replace, render, RenderPosition} from "../utils/render";

export default class SortingController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._sortingComponent = null;
    this._currentSortType = SortType.DEFAULT;

    this._onSortChange = this._onSortChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._filmsModel.setDataChangeHandlers(this._onDataChange);
  }

  render() {
    const container = this._container;
    const sortTypes = Object.values(SortType).map((type) => {
      return {
        type,
        checked: type === this._currentSortType,
      };
    });

    const oldComponent = this._sortingComponent;

    this._sortingComponent = new SortingComponent(sortTypes);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortChange);

    if (oldComponent) {
      replace(this._sortingComponent, oldComponent);
    } else {
      render(container, this._sortingComponent, RenderPosition.AFTEREND);
    }
  }

  _onSortChange(sortType) {
    this._filmsModel.setSortType(sortType);
    this._currentSortType = sortType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
