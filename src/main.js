import {createUserRatingTemplate} from "./components/user-rating";
import {createMenuTemplate} from "./components/menu";
import {createSortingTemplate} from "./components/sorting";
import {createFilmCardTemplate} from "./components/film-card";
import {createShowMoreButton} from "./components/show-more-button";
import {createFooterStatisticTemplate} from "./components/footer-statistic";
import {createTopRatedTemplate} from "./components/top-rated";
import {createMostCommentedTemplate} from "./components/most-commented";
import {createFilmPopupTemplate} from "./components/film-popup";
import {createFiltersTemplate} from "./components/filters";
import {films} from "./mock/film-card";
import {CARDS_COUNT, CARDS_COUNT_SPECIAL} from "./consts";
import {filters} from "./mock/filters";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserRatingTemplate(), `beforeend`);
render(siteMainElement, createMenuTemplate(), `beforeend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);

const siteMenuElement = siteMainElement.querySelector(`.main-navigation`);
render(siteMenuElement, createFiltersTemplate(filters), `afterbegin`);

const filmsElement = siteMainElement.querySelector(`.films`);
const filmListElement = filmsElement.querySelector(`.films-list`);
const filmListContainerElement = filmListElement.querySelector(`.films-list__container`);

films.slice(0, CARDS_COUNT)
  .forEach((film) => render(filmListContainerElement, createFilmCardTemplate(film), `beforeend`));

render(filmListElement, createShowMoreButton(), `beforeend`);

const footerElement = document.querySelector(`.footer`);
const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, createFooterStatisticTemplate(), `beforeend`);

// render(footerElement, createFilmPopupTemplate(films[0]), `afterend`);

render(filmsElement, createTopRatedTemplate(), `beforeend`);
render(filmsElement, createMostCommentedTemplate(), `beforeend`);

const filmsTopRatedElement = filmsElement.querySelector(`.films-list--extra`);
const filmsTopRatedContainerElement = filmsTopRatedElement.querySelector(`.films-list__container`);

films.slice(0, CARDS_COUNT_SPECIAL)
  .forEach((film) => render(filmsTopRatedContainerElement, createFilmCardTemplate(film), `beforeend`));

const filmsMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-of-type`);
const filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector(`.films-list__container`);

films.slice(0, CARDS_COUNT_SPECIAL)
  .forEach((film) => render(filmsMostCommentedContainerElement, createFilmCardTemplate(film), `beforeend`));
