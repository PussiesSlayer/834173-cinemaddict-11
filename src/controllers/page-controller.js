import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import {appendChildComponent, remove, render, RenderPosition} from "../utils/render";
import {CARDS_COUNT_SPECIAL, CARDS_COUNT_DEFAULT, CARDS_COUNT_BY_BUTTON, NO_FILMS} from "../consts";
import NoFilmsComponent from "../components/no-films";
import ShowMoreButtonComponent from "../components/show-more-button";

const renderFilm = (filmsListElement, film, comments) => {
  const footerElement = document.querySelector(`.footer`);

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

  const filmComponent = new FilmCardComponent(film, comments);
  const filmPopupComponent = new FilmPopupComponent(film, comments);

  filmComponent.setOpenPopupClickHandler(() => {
    showFilmPopup();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  render(filmsListElement, filmComponent, RenderPosition.BEFOREEND);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noFilmsComponent = new NoFilmsComponent();
  }

  render(films, comments) {
    const container = this._container.getElement();

    const filmsListElement = container.querySelector(`.films-list__container`);
    const filmsListWrap = container.querySelector(`.films-list`);

    if (films.length > CARDS_COUNT_DEFAULT) {
      render(filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);

      this._showMoreButtonComponent.setCLickHandler(() => {
        const prevFilmsCount = showingFilmsCount;
        showingFilmsCount = showingFilmsCount + CARDS_COUNT_BY_BUTTON;

        films.slice(prevFilmsCount, showingFilmsCount)
          .forEach((film) => renderFilm(filmsListElement, film, comments));

        if (showingFilmsCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    }

    let showingFilmsCount = CARDS_COUNT_DEFAULT;

    if (films.length === NO_FILMS) {
      render(filmsListWrap, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }

    films.slice(0, showingFilmsCount)
      .forEach((film) => renderFilm(filmsListElement, film, comments));
  }
}
