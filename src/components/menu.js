import AbstractComponent from "./abstract-component";

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
}
