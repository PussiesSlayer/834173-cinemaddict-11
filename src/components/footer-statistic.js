import AbstractComponent from "./abstract-component";

const createFooterStatisticTemplate = () => {
  return (
    `<p>130 291 movies inside</p>`
  );
};

export default class FooterStatistic extends AbstractComponent {
  getTemplate() {
    return createFooterStatisticTemplate();
  }
}
