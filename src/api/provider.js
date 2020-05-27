export default class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
  }

  getFilms() {
    return this._api.getFilms();
  }

  getComments(film) {
    return this._api.getComments(film);
  }

  updateFilm(id, data) {
    return this._api.updateFilm(id, data);
  }

  createComment(comment, filmId) {
    return this._api.createComment(comment, filmId);
  }

  deleteComment(comment) {
    return this._api.deleteComment(comment);
  }
}
