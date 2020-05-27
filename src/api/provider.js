import Film from "../models/movie";
import Comment from "../models/comment";
import store from "./store";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, filmStore, commentStore) {
    this._api = api;
    this._filmStore = filmStore;
    this._commentStore = commentStore;

    this._offlineChangedFilms = new Set();
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = films.reduce((acc, current) => {
            return Object.assign({}, acc, {
              [current.id]: current.toRaw(),
            });
          }, {});

          this._filmStore.setAllItems(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._filmStore.getItems());

    return Promise.resolve(Film.parseAll(storeFilms));
  }

  getComments(film) {
    if (isOnline()) {
      return this._api.getComments(film)
        .then((comments) => {
          this._commentStore.setItem(film.id, comments.map((comment) => comment.toRaw()));

          return comments;
        });
    }

    const storeComments = this._commentStore.getItems()[film.id];

    return Promise.resolve(Comment.parseAll(storeComments, film.id));
  }

  updateFilm(id, data) {
    if (isOnline()) {
      return this._api.updateFilm(id, data)
        .then((newFilm) => {
          this._filmStore.setItem(newFilm.id, newFilm.toRaw());

          return newFilm;
        });
    }

    const localFilm = Film.clone(data);
    this._filmStore.setItem(id, data.toRaw());
    this._offlineChangedFilms.add(id);

    return Promise.resolve(localFilm);
  }

  createComment(comment, filmId) {
    if (isOnline()) {
      return this._api.createComment(comment, filmId)
        .then((result) => {
          this._filmStore.setItem(filmId, result.comments.map((item) => item.toRaw()));

          this._commentStore.setItem(result.movie.id, result.movie.toRaw());

          return result;
        });
    }

    return Promise.reject(`You can't create comment in offline`);
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment)
        .then(() => {
          const storeComments = this._commentStore.getItems()[comment.filmId]
            .filter((rawComment) => rawComment[`id`] !== comment.id);

          this._commentStore.setItem(comment.filmId, storeComments);

          const storeFilm = this._filmStore.getItems()[comment.filmId];
          const storeCommentsByFilm = storeFilm[`comments`];

          storeFilm[`comments`] = storeCommentsByFilm.filter((id) => id !== comment.id);
          this._filmStore.setItem(comment.id, storeFilm);
        });
    }

    return Promise.reject(`You can't delete comments in offline`);
  }

  isSync() {
    return this._offlineChangedFilms === 0;
  }

  sync() {
    if (isOnline()) {
      const storeFilms = this._filmStore.getItems();
      const storeChangedFilms = Array.from(this._offlineChangedFilms)
        .map((id) => storeFilms[id]);

      return this._api.sync(storeChangedFilms)
        .then((response) => {
          const items = response.updated.reduce((acc, current) => {
            return Object.assign({}, acc, {
              [current.id]: current,
            });
          }, {});

          this._filmStore.setItems(items);

          this._offlineChangedFilms.clear();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
