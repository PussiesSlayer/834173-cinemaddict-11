import Film from "./models/movie";
import Comment from "./models/comment";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  DELETE: `DELETE`,
  POST: `POST`,
};

const checkStatus = (response) => {
  if (response.status >= 200 || response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Film.parseFilms);
  }

  getComments(film) {
    return this._load({url: `comments/${film.id}`})
      .then((response) => response.json())
      .then((data) => Comment.parseComments(data, film.id));
  }

  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(Film.parseFilm);
  }

  createComment(comment, filmId) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRaw()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then((data) => {
        return {
          movie: Film.parseFilm(data.movie),
          comments: Comment.parseComments(data.comments, filmId),
        };
      });
  }

  deleteComment(comment) {
    return this._load({
      // url: `comments/${comment.id}`,
      url: `commets/${comment.id}`,
      method: Method.DELETE
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
