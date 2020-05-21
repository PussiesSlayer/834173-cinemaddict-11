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

  toRaw() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.name,
        "alternative_title": this.originalName,
        "total_rating": this.userRating,
        "poster": this.poster,
        "age_rating": this.ratingByAge,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.date.toISOString(),
          "release_country": this.country
        },
        "runtime": this.duration,
        "genre": this.genres,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.isWantToWatch,
        "already_watched": this.isWatched,
        "watching_date": this.watchedDate.toISOString(),
        "favorite": this.isFavorite
      }
    };
  }

  static parse(data) {
    return new Film(data);
  }

  static parseAll(data) {
    return data.map(Film.parse);
  }

  static clone(data) {
    return new Film(data.toRaw());
  }

  removeComment(id) {
    this.comments = this.comments.filter((it) => it !== id);
  }

  addComment(id) {
    this.comments = [].concat(id, this.comments);
  }
}
