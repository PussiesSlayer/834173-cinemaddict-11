import UserRatingComponent from "./components/user-rating";
import MenuComponent from "./components/menu";
import FooterStatisticComponent from "./components/footer-statistic";
import FilmsBlockComponent from "./components/films-block";
import StatisticComponent from "./components/statistic";
import LoadingComponent from "./components/loading";
import PageController from "./controllers/page-controller";
import FilterController from "./controllers/filter-controller";
import SortingController from "./controllers/sorting-controller";
import FilmsModel from "./models/movies";
import {RenderPosition, render, remove} from "./utils/render";
import API from "./api/index";
import Provider from "./api/provider";
import Store from "./api/store";
import {MenuItem} from "./consts";
import {getStoreName} from "./utils/common";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const AUTHORIZATION = `Basic erdfgjbhknlms;efs`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX_FILM = `film`;
const STORE_PREFIX_COMMENTS = `comments`;
const STORE_VER = `v1`;

const api = new API(END_POINT, AUTHORIZATION);
const filmStore = new Store(getStoreName(STORE_PREFIX_FILM, STORE_VER), window.localStorage);
const commentsStore = new Store(getStoreName(STORE_PREFIX_COMMENTS, STORE_VER), window.localStorage);
const apiWithProvider = new Provider(api, filmStore, commentsStore);

const siteMenuElement = new MenuComponent();
render(siteMainElement, siteMenuElement, RenderPosition.BEFOREEND);

const filmsModel = new FilmsModel();

const userRatingComponent = new UserRatingComponent();
render(siteHeaderElement, userRatingComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMenuElement.getElement(), filmsModel);
filterController.render();

const sortingController = new SortingController(siteMenuElement.getElement(), filmsModel);
sortingController.render();

const filmsBlock = new FilmsBlockComponent();

const loadingComponent = new LoadingComponent();
render(filmsBlock.getElement(), loadingComponent, RenderPosition.AFTERBEGIN);

const pageController = new PageController(filmsBlock, filmsModel, apiWithProvider);

render(siteMainElement, filmsBlock, RenderPosition.BEFOREEND);

const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);
const footerStatisticComponent = new FooterStatisticComponent();
render(footerStatisticElement, footerStatisticComponent, RenderPosition.BEFOREEND);

const statisticComponent = new StatisticComponent(filmsModel);
render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();

siteMenuElement.setClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.FILTER:
      statisticComponent.hide();
      sortingController.show();
      pageController.show();
      break;
    case MenuItem.STATS:
      sortingController.hide();
      pageController.hide();
      statisticComponent.show();
      break;
  }
});

filmsModel.setDataLoadHandler(() => {
  footerStatisticComponent.setCount(filmsModel.getAll());
});

filmsModel.setDataChangeHandlers(() => {
  userRatingComponent.setRank(filmsModel.getAll());
  statisticComponent.setRank(filmsModel.getAll());
});

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.set(films);
  })
  .catch(() => {
    filmsModel.set([]);
  })
  .finally(() => {
    remove(loadingComponent);
    pageController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.isSync()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
