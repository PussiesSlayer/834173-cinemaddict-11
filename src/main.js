import UserRatingComponent from "./components/user-rating";
import MenuComponent from "./components/menu";
import FooterStatisticComponent from "./components/footer-statistic";
import FilmsBlockComponent from "./components/films-block";
import StatisticComponent from "./components/statistic";
import PageController from "./controllers/page-controller";
import FilterController from "./controllers/filter-controller";
import FilmsModel from "./models/movies";
import {RenderPosition, render} from "./utils/render";
import {films} from "./mock/film-card";
import API from "./api";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

// const api = new API();

const siteMenuElement = new MenuComponent();

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

render(siteHeaderElement, new UserRatingComponent(filmsModel.getFilms()), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuElement, RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMenuElement.getElement(), filmsModel);
filterController.render();

const filmsBlock = new FilmsBlockComponent();
const pageController = new PageController(filmsBlock, filmsModel);
pageController.render();

render(siteMainElement, filmsBlock, RenderPosition.BEFOREEND);

const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, new FooterStatisticComponent(filmsModel.getFilms()), RenderPosition.BEFOREEND);

const statisticComponent = new StatisticComponent({films: filmsModel.getFilms()});
render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();

siteMenuElement.setStatsClickHandler((evt) => {
  evt.preventDefault();

  pageController.hide();
  statisticComponent.show();
});

filterController.setFilterClickHandler(() => {
  statisticComponent.hide();

  pageController.show();
});

// api.getFilms()
//   .then((films) => {
//     filmsModel.setFilms(films);
//     pageController.render();
//   });
