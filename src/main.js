import UserRatingComponent from "./components/user-rating";
import MenuComponent from "./components/menu";
import FooterStatisticComponent from "./components/footer-statistic";
import FiltersComponent from "./components/filters";
import FilmsBlockComponent from "./components/films-block";
import {RenderPosition, render} from "./utils/render";
import {films, generateComments} from "./mock/film-card";
import {filters} from "./mock/filters";
import PageController from "./controllers/page-controller";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const siteMenuElement = new MenuComponent();

render(siteHeaderElement, new UserRatingComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuElement, RenderPosition.BEFOREEND);
render(siteMenuElement.getElement(), new FiltersComponent(filters), RenderPosition.AFTERBEGIN);

const filmsBlock = new FilmsBlockComponent();
const pageController = new PageController(filmsBlock);

render(siteMainElement, filmsBlock, RenderPosition.BEFOREEND);
pageController.render(films, generateComments());

const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, new FooterStatisticComponent(), RenderPosition.BEFOREEND);
