import AbstractComponent from "./abstract-component";
import {MenuItem} from "../consts";

const createMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
        <a href="#stats" class="main-navigation__additional">Stats</a>
     </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setMenuClickHandler(handler) {
    const element = this.getElement();

    element
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        if (evt.target.tagName !== `A` && evt.target.parentElement.tagName !== `A`) {
          return;
        }

        const menuItem = evt.target.dataset.filterType || evt.target.parentElement.dataset.filterType ? MenuItem.FILTER : MenuItem.STATS;

        if (menuItem === MenuItem.STATS) {
          this._setStatsActiveStatus();
        } else {
          this._deactivateStatsActiveStatus();
        }

        handler(menuItem);
      });
  }

  _setStatsActiveStatus() {
    const element = this.getElement();
    const statsElement = element.querySelector(`.main-navigation__additional`);

    statsElement.classList.add(`main-navigation__additional--active`);
  }

  _deactivateStatsActiveStatus() {
    const element = this.getElement();
    const statsElement = element.querySelector(`.main-navigation__additional`);

    statsElement.classList.remove(`main-navigation__additional--active`);
  }
}
