import UserRatingComponent from "./components/user-rating";
import MenuComponent from "./components/menu";
import SortingComponent from "./components/sorting";
import FilmCardComponent from "./components/film-card";
import ShowMoreButtonComponent from "./components/show-more-button";
import FooterStatisticComponent from "./components/footer-statistic";
import TopRatedComponent from "./components/top-rated";
import MostCommentedComponent from "./components/most-commented";
import FilmPopupComponent from "./components/film-popup";
import FiltersComponent from "./components/filters";
import FilmsBlockComponent from "./components/films-block";
import {RenderPosition, render} from "./utils";
import {films} from "./mock/film-card";
import {CARDS_COUNT_SPECIAL, CARDS_COUNT_DEFAULT, CARDS_COUNT_BY_BUTTON} from "./consts";
import {filters} from "./mock/filters";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

const siteMenuElement = new MenuComponent();

render(siteHeaderElement, new UserRatingComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuElement.getElement(), RenderPosition.BEFOREEND);
render(siteMenuElement.getElement(), new FiltersComponent(filters).getElement(), RenderPosition.AFTERBEGIN);
render(siteMainElement, new SortingComponent().getElement(), RenderPosition.BEFOREEND);

const renderFilm = (filmsListElement, film) => {
  const filmComponent = new FilmCardComponent(film);

  render(filmsListElement, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderFilmsBlock = (filmsBlockComponent, filmsCards) => {
  const filmsListElement = filmsBlockComponent.getElement().querySelector(`.films-list__container`);

  let showingFilmsCount = CARDS_COUNT_DEFAULT;

  filmsCards.slice(0, showingFilmsCount)
    .forEach((film) => renderFilm(filmsListElement, film));

  const showMoreButtonComponent = new ShowMoreButtonComponent();

  if (filmsCards.length > CARDS_COUNT_DEFAULT) {
    render(filmsListElement, showMoreButtonComponent.getElement(), RenderPosition.AFTEREND);

    showMoreButtonComponent.getElement().addEventListener(`click`, () => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + CARDS_COUNT_BY_BUTTON;

      filmsCards.slice(prevFilmsCount, showingFilmsCount)
        .forEach((film) => renderFilm(filmsListElement, film));

      if (showingFilmsCount >= filmsCards.length) {
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
};

const filmsBlock = new FilmsBlockComponent();
render(siteMainElement, filmsBlock.getElement(), RenderPosition.BEFOREEND);
renderFilmsBlock(filmsBlock, films);

const footerElement = document.querySelector(`.footer`);
const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, new FooterStatisticComponent().getElement(), RenderPosition.BEFOREEND);

// EXTRA

// const mostCommentedFilms = films.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);
// const topRatedFilms = films.slice().sort((a, b) => a.userRating > b.userRating ? -1 : 1);
//
// render(filmsElement, createTopRatedTemplate(), `beforeend`);
// render(filmsElement, createMostCommentedTemplate(), `beforeend`);
//
// const filmsTopRatedElement = filmsElement.querySelector(`.films-list--extra`);
// const filmsTopRatedContainerElement = filmsTopRatedElement.querySelector(`.films-list__container`);
//
// topRatedFilms.slice(0, CARDS_COUNT_SPECIAL)
//   .forEach((film) => render(filmsTopRatedContainerElement, createFilmCardTemplate(film), `beforeend`));
//
// const filmsMostCommentedElement = filmsElement.querySelector(`.films-list--extra:last-of-type`);
// const filmsMostCommentedContainerElement = filmsMostCommentedElement.querySelector(`.films-list__container`);
//
// mostCommentedFilms.slice(0, CARDS_COUNT_SPECIAL)
//   .forEach((film) => render(filmsMostCommentedContainerElement, createFilmCardTemplate(film), `beforeend`));
