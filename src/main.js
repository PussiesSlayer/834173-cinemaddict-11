import UserRatingComponent from "./components/user-rating";
import MenuComponent from "./components/menu";
import SortingComponent from "./components/sorting";
import FooterStatisticComponent from "./components/footer-statistic";
import FiltersComponent from "./components/filters";
import FilmsBlockComponent from "./components/films-block";
import {RenderPosition, render} from "./utils/render";
import {films, comments} from "./mock/film-card";
import {filters} from "./mock/filters";
import PageController from "./controllers/page-controller";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const siteMenuElement = new MenuComponent();

render(siteHeaderElement, new UserRatingComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuElement, RenderPosition.BEFOREEND);
render(siteMenuElement.getElement(), new FiltersComponent(filters), RenderPosition.AFTERBEGIN);
render(siteMainElement, new SortingComponent(), RenderPosition.BEFOREEND);

const filmsBlock = new FilmsBlockComponent();
const pageController = new PageController(filmsBlock);

render(siteMainElement, filmsBlock, RenderPosition.BEFOREEND);
pageController.render(films, comments);

const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, new FooterStatisticComponent(), RenderPosition.BEFOREEND);

// if (films.length !== NO_FILMS) {
//   const mostCommentedFilms = films.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);
//   const topRatedFilms = films.slice().sort((a, b) => a.userRating > b.userRating ? -1 : 1);
//
//   const topRatedComponent = new TopRatedComponent();
//   const mostCommentedComponent = new MostCommentedComponent();
//
//   render(filmsBlock.getElement(), topRatedComponent, RenderPosition.BEFOREEND);
//   render(filmsBlock.getElement(), mostCommentedComponent, RenderPosition.BEFOREEND);
//
//   const filmsTopRatedContainerElement = topRatedComponent.getElement().querySelector(`.films-list__container`);
//
//   topRatedFilms.slice(0, CARDS_COUNT_SPECIAL)
//     .forEach((film) => renderFilm(filmsTopRatedContainerElement, film));
//
//   const filmsMostCommentedContainerElement = mostCommentedComponent.getElement().querySelector(`.films-list__container`);
//
//   mostCommentedFilms.slice(0, CARDS_COUNT_SPECIAL)
//     .forEach((film) => renderFilm(filmsMostCommentedContainerElement, film));
// }
