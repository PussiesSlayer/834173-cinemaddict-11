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
      .then(checkStatus)
      .then((response) => response.json())
      .then(Film.parseFilms);
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateFilm(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);

    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Film.parseFilm);
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
