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
import {RenderPosition, render, remove, appendChildComponent} from "./utils/render";
import {films} from "./mock/film-card";
import {CARDS_COUNT_SPECIAL, CARDS_COUNT_DEFAULT, CARDS_COUNT_BY_BUTTON, NO_FILMS} from "./consts";
import {filters} from "./mock/filters";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);

const siteMenuElement = new MenuComponent();

render(siteHeaderElement, new UserRatingComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, siteMenuElement, RenderPosition.BEFOREEND);
render(siteMenuElement.getElement(), new FiltersComponent(filters), RenderPosition.AFTERBEGIN);
render(siteMainElement, new SortingComponent(), RenderPosition.BEFOREEND);

const renderFilm = (filmsListElement, film) => {
  const showFilmPopup = () => {
    appendChildComponent(footerElement, filmPopupComponent);

    filmPopupComponent.setCloseButtonClickHandler(() => {
      hideFilmPopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });
  };

  const hideFilmPopup = () => {
    if (filmPopupComponent) {
      remove(filmPopupComponent);
    }
  };

  const onEscKeyDown = (evt) => {
    const isEscapeKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscapeKey) {
      hideFilmPopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const filmComponent = new FilmCardComponent(film);
  const filmPopupComponent = new FilmPopupComponent(film);

  filmComponent.setOpenPopupClickHandler(() => {
    showFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  render(filmsListElement, filmComponent, RenderPosition.BEFOREEND);
};

const renderFilmsBlock = (filmsBlockComponent, filmsCards) => {
  const filmsListElement = filmsBlockComponent.getElement().querySelector(`.films-list__container`);
  const filmsListWrap = filmsBlockComponent.getElement().querySelector(`.films-list`);

  if (filmsCards.length === NO_FILMS) {
    render(filmsListWrap, new NoFilmsComponent(), RenderPosition.BEFOREEND);
  }

  let showingFilmsCount = CARDS_COUNT_DEFAULT;

  filmsCards.slice(0, showingFilmsCount)
    .forEach((film) => renderFilm(filmsListElement, film));

  const showMoreButtonComponent = new ShowMoreButtonComponent();

  if (filmsCards.length > CARDS_COUNT_DEFAULT) {
    render(filmsListElement, showMoreButtonComponent, RenderPosition.AFTEREND);

    showMoreButtonComponent.setCLickHandler(() => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + CARDS_COUNT_BY_BUTTON;

      filmsCards.slice(prevFilmsCount, showingFilmsCount)
        .forEach((film) => renderFilm(filmsListElement, film));

      if (showingFilmsCount >= filmsCards.length) {
        remove(showMoreButtonComponent);
      }
    });
  }
};

const filmsBlock = new FilmsBlockComponent();
render(siteMainElement, filmsBlock, RenderPosition.BEFOREEND);
renderFilmsBlock(filmsBlock, films);

const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

render(footerStatisticElement, new FooterStatisticComponent(), RenderPosition.BEFOREEND);

if (films.length !== NO_FILMS) {
  const mostCommentedFilms = films.slice().sort((a, b) => a.comments.length > b.comments.length ? -1 : 1);
  const topRatedFilms = films.slice().sort((a, b) => a.userRating > b.userRating ? -1 : 1);

  const topRatedComponent = new TopRatedComponent();
  const mostCommentedComponent = new MostCommentedComponent();

  render(filmsBlock.getElement(), topRatedComponent, RenderPosition.BEFOREEND);
  render(filmsBlock.getElement(), mostCommentedComponent, RenderPosition.BEFOREEND);

  const filmsTopRatedContainerElement = topRatedComponent.getElement().querySelector(`.films-list__container`);

  topRatedFilms.slice(0, CARDS_COUNT_SPECIAL)
    .forEach((film) => renderFilm(filmsTopRatedContainerElement, film));

  const filmsMostCommentedContainerElement = mostCommentedComponent.getElement().querySelector(`.films-list__container`);

  mostCommentedFilms.slice(0, CARDS_COUNT_SPECIAL)
    .forEach((film) => renderFilm(filmsMostCommentedContainerElement, film));
}
