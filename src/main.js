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
import NoFilmsComponent from "./components/no-films";
import {RenderPosition, render} from "./utils";
import {films} from "./mock/film-card";
import {CARDS_COUNT_SPECIAL, CARDS_COUNT_DEFAULT, CARDS_COUNT_BY_BUTTON, NO_FILMS} from "./consts";
import {filters} from "./mock/filters";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const siteMenuElement = new MenuComponent();

render(siteHeaderElement, new UserRatingComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuElement.getElement(), RenderPosition.BEFOREEND);
render(siteMenuElement.getElement(), new FiltersComponent(filters).getElement(), RenderPosition.AFTERBEGIN);
render(siteMainElement, new SortingComponent().getElement(), RenderPosition.BEFOREEND);

const renderFilm = (filmsListElement, film) => {
  const showFilmPopup = () => {
    footerElement.appendChild(filmPopupComponent.getElement());
  };
  const hideFilmPopup = () => {
    footerElement.removeChild(filmPopupComponent.getElement());
    filmPopupComponent.removeElement();
  };

  const filmComponent = new FilmCardComponent(film);
  const filmPopupComponent = new FilmPopupComponent(film);

  const filmPoster = filmComponent.getElement().querySelector(`.film-card__poster`);
  const filmName = filmComponent.getElement().querySelector(`.film-card__title`);
  const filmCommentsBlock = filmComponent.getElement().querySelector(`.film-card__comments`);

  const filmClickedElements = Array.of(filmPoster, filmName, filmCommentsBlock);
  filmClickedElements.forEach((filmClickElement) => {
    filmClickElement.addEventListener(`click`, () => {
      showFilmPopup();
    });
  });

  const closePopupButton = filmPopupComponent.getElement().querySelector(`.film-details__close-btn`);

  closePopupButton.addEventListener(`click`, hideFilmPopup);

  render(filmsListElement, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderFilmsBlock = (filmsBlockComponent, filmsCards) => {
  const filmsListElement = filmsBlockComponent.getElement().querySelector(`.films-list__container`);
  const filmsListWrap = filmsBlockComponent.getElement().querySelector(`.films-list`);

  if (filmsCards.length === NO_FILMS) {
    render(filmsListWrap, new NoFilmsComponent().getElement(), RenderPosition.BEFOREEND);
  }

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

const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, new FooterStatisticComponent().getElement(), RenderPosition.BEFOREEND);

if (films.length !== NO_FILMS) {
  const mostCommentedFilms = films.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);
  const topRatedFilms = films.slice().sort((a, b) => a.userRating > b.userRating ? -1 : 1);

  const topRatedComponent = new TopRatedComponent();
  const mostCommentedComponent = new MostCommentedComponent();

  render(filmsBlock.getElement(), topRatedComponent.getElement(), RenderPosition.BEFOREEND);
  render(filmsBlock.getElement(), mostCommentedComponent.getElement(), RenderPosition.BEFOREEND);

  const filmsTopRatedContainerElement = topRatedComponent.getElement().querySelector(`.films-list__container`);

  topRatedFilms.slice(0, CARDS_COUNT_SPECIAL)
    .forEach((film) => renderFilm(filmsTopRatedContainerElement, film));

  const filmsMostCommentedContainerElement = mostCommentedComponent.getElement().querySelector(`.films-list__container`);

  mostCommentedFilms.slice(0, CARDS_COUNT_SPECIAL)
    .forEach((film) => renderFilm(filmsMostCommentedContainerElement, film));
}
