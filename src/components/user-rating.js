import {getUserRank} from "../utils/common";
import {getWatchedFilms} from "../utils/filter";
import AbstractSmartComponent from "./abstract-smart-component";

const createUserRatingTemplate = (rank) => {
  return (
    rank !== null ?
      `<section class="header__profile profile">
        <p class="profile__rating">${rank}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
       </section>` : ` `);
};

export default class UserRating extends AbstractSmartComponent {
  constructor() {
    super();

    this._rank = null;
  }

  getTemplate() {
    return createUserRatingTemplate(this._rank);
  }

  setRank(films) {
    const watchedFilms = getWatchedFilms(films);
    const watchedFilmsAmount = watchedFilms.length;

    this._rank = getUserRank(watchedFilmsAmount);
    this.rerender();
  }

  recoveryListeners() {}
}
