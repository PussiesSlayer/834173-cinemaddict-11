export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.emoji = data[`emotion`];
    this.date = new Date(data[`date`]);
    this.message = data[`comment`];
    this.userName = data[`author`];
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
