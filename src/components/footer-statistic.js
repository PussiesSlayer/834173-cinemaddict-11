import AbstractComponent from "./abstract-component";

const createFooterStatisticTemplate = (films) => {
  const filmsAmount = films.length;

  return (
    `<p>${filmsAmount} movies inside</p>`
  );
};

export default class FooterStatistic extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._films);
  }
}
