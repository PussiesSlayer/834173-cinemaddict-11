export default class Comment {
  constructor(data, filmId) {
    this.filmId = filmId;

    this.id = data[`id`];
    this.emoji = data[`emotion`];
    this.date = new Date(data[`date`]);
    this.message = data[`comment`];
    this.userName = data[`author`];
  }

  toRaw() {
    return {
      "id": this.id,
      "author": this.userName,
      "comment": this.message,
      "date": this.date.toISOString(),
      "emotion": this.emoji,
    };
  }

  static parse(data, filmId) {
    return new Comment(data, filmId);
  }

  static parseAll(data, filmId) {
    return data.map((rawComment) => {
      return Comment.parse(rawComment, filmId);
    });
  }
}
