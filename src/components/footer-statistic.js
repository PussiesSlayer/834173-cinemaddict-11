import AbstractSmartComponent from "./abstract-smart-component";

const createFooterStatisticTemplate = (count) => {
  return (
    `<p>${count} movies inside</p>`
  );
};

export default class FooterStatistic extends AbstractSmartComponent {
  constructor() {
    super();

    this._count = 0;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._count);
  }

  setCount(films) {
    this._count = films.length;
    this.rerender();
  }

  recoveryListeners() {}
}
