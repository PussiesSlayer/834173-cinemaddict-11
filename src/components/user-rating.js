import {getUserRank} from "../utils/common";
import {getWatchedFilms} from "../utils/filter";
import AbstractComponent from "./abstract-component";

const createUserRatingTemplate = (films) => {
  const watchedFilms = getWatchedFilms(films);
  const watchedFilmsAmount = watchedFilms.length;
  const rank = getUserRank(watchedFilmsAmount);

  return (
    rank !== null ?
      `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
   </section>` : ` `);
};

export default class UserRating extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }


  getTemplate() {
    return createUserRatingTemplate(this._films);
  }
}
