import {createUserRatingTemplate} from "./components/user-rating";
import {createMenuTemplate} from "./components/menu";
import {createSortingTemplate} from "./components/sorting";
import {createFilmCardTemplate} from "./components/film-card";
import {createShowMoreButton} from "./components/show-more-button";
import {createFooterStatisticTemplate} from "./components/footer-statistic";
import {createTopRatedTemplate} from "./components/top-rated";
import {createMostCommentedTemplate} from "./components/most-commented";
import {createFilmPopupTemplate} from "./components/film-popup";

const CARDS_COUNT = 5;
const CARDS_COUNT_SPECIAL = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserRatingTemplate(), `beforeend`);
render(siteMainElement, createMenuTemplate(), `beforeend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmListElement = filmsElement.querySelector(`.films-list`);
const filmListContainerElement = filmListElement.querySelector(`.films-list__container`);

for (let i = 0; i < CARDS_COUNT; i++) {
  render(filmListContainerElement, createFilmCardTemplate(), `beforeend`);
}

render(filmListElement, createShowMoreButton(), `beforeend`);

const footerElement = document.querySelector(`.footer`);
const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, createFooterStatisticTemplate(), `beforeend`);
render(filmsElement, createTopRatedTemplate(), `beforeend`);
render(filmsElement, createMostCommentedTemplate(), `beforeend`);

const filmsTopRatedElement = filmsElement.querySelector(`.films-list--extra`);
const filmsTopRatedContainerElement = filmsTopRatedElement.querySelector(`.films-list__container`);

for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  render(filmsTopRatedContainerElement, createFilmCardTemplate(), `beforeend`);
}

const filmsMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-of-type`);
const filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector(`.films-list__container`);

for (let i = 0; i < CARDS_COUNT_SPECIAL; i++) {
  render(filmsMostCommentedContainerElement, createFilmCardTemplate(), `beforeend`);
}

render(footerElement, createFilmPopupTemplate(), `afterend`);
