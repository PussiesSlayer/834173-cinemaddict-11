export default class Comment {
  constructor(data) {
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

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
