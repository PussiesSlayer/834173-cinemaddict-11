export default class Film {
  constructor(data) {
    this.id = data[`id`];

    this.comments = data[`comments`];

    this.name = data[`film_info`][`title`];
    this.originalName = data[`film_info`][`alternative_title`];
    this.userRating = data[`film_info`][`total_rating`];
    this.poster = data[`film_info`][`poster`];
    this.ratingByAge = data[`film_info`][`age_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];

    this.date = new Date(data[`film_info`][`release`][`date`]);
    this.country = data[`film_info`][`release`][`release_country`];

    this.duration = data[`film_info`][`runtime`];
    this.genres = data[`film_info`][`genre`];
    this.description = data[`film_info`][`description`];

    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isWantToWatch = Boolean(data[`user_details`][`watchlist`]);
    this.watchedDate = new Date(data[`user_details`][`watching_date`]);
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }
}
