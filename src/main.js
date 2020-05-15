import UserRatingComponent from "./components/user-rating";
import MenuComponent from "./components/menu";
import FooterStatisticComponent from "./components/footer-statistic";
import FilmsBlockComponent from "./components/films-block";
import StatisticComponent from "./components/statistic";
import PageController from "./controllers/page-controller";
import FilterController from "./controllers/filter-controller";
import FilmsModel from "./models/movies";
import {RenderPosition, render} from "./utils/render";
import API from "./api";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const AUTHORIZATION = `Basic erdfgjbhknlms;efs`;
const api = new API(AUTHORIZATION);

const siteMenuElement = new MenuComponent();

const filmsModel = new FilmsModel();

render(siteMainElement, siteMenuElement, RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMenuElement.getElement(), filmsModel);
filterController.render();

const filmsBlock = new FilmsBlockComponent();
const pageController = new PageController(filmsBlock, filmsModel);

render(siteMainElement, filmsBlock, RenderPosition.BEFOREEND);

const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);


// TODO: переписать статистику на контроллер
const statisticComponent = new StatisticComponent(filmsModel.getFilmsAll());
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

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
  })
  .finally(() => {
    const allFilms = filmsModel.getFilmsAll();

    pageController.render();

    render(siteHeaderElement, new UserRatingComponent(allFilms), RenderPosition.BEFOREEND);
    render(footerStatisticElement, new FooterStatisticComponent(allFilms), RenderPosition.BEFOREEND);
    render(siteMainElement, new StatisticComponent(allFilms), RenderPosition.BEFOREEND);
  });
