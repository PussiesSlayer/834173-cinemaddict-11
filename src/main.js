import UserRatingComponent from "./components/user-rating";
import MenuComponent from "./components/menu";
import FooterStatisticComponent from "./components/footer-statistic";
// import FiltersComponent from "./components/filters";
import FilmsBlockComponent from "./components/films-block";
import StatisticComponent from "./components/statistic";
import PageController from "./controllers/page-controller";
import FilterController from "./controllers/filter-controller";
import FilmsModel from "./models/movies";
import CommentsModel from "./models/comments";
import {RenderPosition, render} from "./utils/render";
import {films} from "./mock/film-card";
import {filters} from "./mock/filters";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const siteMenuElement = new MenuComponent();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

render(siteHeaderElement, new UserRatingComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuElement, RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMenuElement.getElement(), filmsModel);
// render(siteMenuElement.getElement(), new FiltersComponent(filters), RenderPosition.AFTERBEGIN);
filterController.render();

const filmsBlock = new FilmsBlockComponent();
const pageController = new PageController(filmsBlock, filmsModel);

render(siteMainElement, filmsBlock, RenderPosition.BEFOREEND);
pageController.render();

const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, new FooterStatisticComponent(films), RenderPosition.BEFOREEND);

const statisticComponent = new StatisticComponent();
render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();

siteMenuElement.setStatsClickHandler((evt) => {
  evt.preventDefault();

  console.log(`stats`);

  pageController.hide();
  statisticComponent.show();
});

filterController.setFilterClickHandler(() => {
  console.log(`filter`);

  pageController.show();
  statisticComponent.hide();
});
