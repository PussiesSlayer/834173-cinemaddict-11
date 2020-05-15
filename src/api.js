import Film from "./models/movie";
import Comment from "./models/comment";

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies/`, {headers})
      .then((response) => response.json())
      .then(Film.parseFilms);
  }

  getComments(id) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${id}`, {headers})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateFilm(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies/`, {
      method: `PUT`,
      body: JSON.stringify(data),
      headers
    })
      .then((response) => response.json())
      .then(Film.parseFilms);
  }
};

export default API;
