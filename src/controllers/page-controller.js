import FilmCardComponent from "../components/film-card";
import FilmPopupComponent from "../components/film-popup";
import NoFilmsComponent from "../components/no-films";
import ShowMoreButtonComponent from "../components/show-more-button";
import TopRatedComponent from "../components/top-rated";
import MostCommentedComponent from "../components/most-commented";
import SortingComponent from "../components/sorting";
import {appendChildComponent, remove, render, RenderPosition} from "../utils/render";
import {CARDS_COUNT_SPECIAL, CARDS_COUNT_DEFAULT, CARDS_COUNT_BY_BUTTON, NO_FILMS, SortType} from "../consts";

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

const renderFilms = (filmsListElement, films, comments) => {
  films.forEach((film) => renderFilm(filmsListElement, film, comments));
};

const renderExtraBlocks = (container, films, comments) => {
  if (films.length !== NO_FILMS) {
    // РАЗОБРАТЬСЯ С СОРТИРОВКОЙ ПО КОММЕНТАРИЯМ
    const mostCommentedFilms = films.slice().sort((a, b) => a.length > b.length ? -1 : 1);
    const topRatedFilms = films.slice().sort((a, b) => a.userRating > b.userRating ? -1 : 1);

    const topRatedComponent = new TopRatedComponent();
    const mostCommentedComponent = new MostCommentedComponent();

    render(container, topRatedComponent, RenderPosition.BEFOREEND);
    render(container, mostCommentedComponent, RenderPosition.BEFOREEND);

    const filmsTopRatedContainerElement = topRatedComponent.getElement().querySelector(`.films-list__container`);
    renderFilms(filmsTopRatedContainerElement, topRatedFilms.slice(0, CARDS_COUNT_SPECIAL), comments);

    const filmsMostCommentedContainerElement = mostCommentedComponent.getElement().querySelector(`.films-list__container`);
    renderFilms(filmsMostCommentedContainerElement, mostCommentedFilms.slice(0, CARDS_COUNT_SPECIAL), comments);
  }
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
    case SortType.BY_RATING:
      sortedFilms = showingFilms.sort((a, b) => b.userRating - a.userRating);
      break;
    case SortType.BY_DATE:
      sortedFilms = showingFilms.sort((a, b) => b.date - a.date);
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortingComponent = new SortingComponent();
  }

  render(films, comments) {
    const container = this._container.getElement();

    const filmsListElement = container.querySelector(`.films-list__container`);
    const filmsListWrap = container.querySelector(`.films-list`);

    if (films.length === NO_FILMS) {
      render(filmsListWrap, this._noFilmsComponent, RenderPosition.BEFOREEND);
    }

    let showingFilmsCount = CARDS_COUNT_DEFAULT;

    if (films.length > CARDS_COUNT_DEFAULT) {
      render(filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);

      this._showMoreButtonComponent.setCLickHandler(() => {
        const prevFilmsCount = showingFilmsCount;
        showingFilmsCount = showingFilmsCount + CARDS_COUNT_BY_BUTTON;

        const sortedFilms = getSortedFilms(films, this._sortingComponent.getSortType(), prevFilmsCount, showingFilmsCount);

        renderFilms(filmsListElement, sortedFilms, comments);

        if (showingFilmsCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    renderFilms(filmsListElement, films.slice(0, showingFilmsCount), comments);
    renderExtraBlocks(container, films, comments);

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      showingFilmsCount = CARDS_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(films, sortType, 0, showingFilmsCount);

      filmsListElement.innerHTML = ``;

      renderFilms(filmsListElement, sortedFilms, comments);
    });
  }
}
