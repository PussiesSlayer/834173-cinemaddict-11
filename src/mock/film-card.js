import {getRandomNumber} from "../utils/common";
import {CARDS_COUNT} from "../consts";

const DescriptionItems = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const FilmsNames = [
  `The Dance of life`,
  `Made for Each Other`,
  `Popeye Meets Sinbad`,
  `Sagebrush Trail`,
  `Santa Claus Conquers The Martians`,
  `The Great Flamarion`,
  `The Man With The Golden Arm`,
];

const Emogies = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`,
];

const Genres = [
  `drama`,
  `comedy`,
  `for children`,
  `tragedy`,
  `horror`,
];

const UserNames = [
  `Harry Potter`,
  `Ginny`,
  `Ronald`,
  `Hermione`,
  `Hedwig`,
  `Hargid`,
  `Voldemort`,
  `Albus Dumbldore`,
];

const convertNameToPoster = (string) => {
  return string.toLowerCase().split(` `).join(`-`);
};

const getRandomValue = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDescription = () => {
  let newDescription = [];

  for (let i = 0; i < getRandomNumber(1, 5); i++) {
    newDescription.push(getRandomValue(DescriptionItems));
  }

  return newDescription;
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomNumber(0, 365);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateComment = () => {
  return {
    id: String(Date() + Math.random()),
    emoji: getRandomValue(Emogies),
    date: getRandomDate(),
    message: getRandomDescription(),
    userName: getRandomValue(UserNames),
  };
};

const generateComments = () => {
  return new Array(getRandomNumber(0, 5))
    .fill(``)
    .map(generateComment);
};

const generateGenre = () => {
  return getRandomValue(Genres);
};

const generateGenres = () => {
  return new Array(getRandomNumber(1, 4))
    .fill(``)
    .map(generateGenre);
};

const generateFilm = () => {
  const name = getRandomValue(FilmsNames);

  return {
    id: String(Date() + Math.random()),
    name,
    originalName: name,
    poster: `images/posters/${convertNameToPoster(name)}.jpg`,
    description: getRandomDescription(),
    userRating: Math.floor(Math.random() * 10),
    date: getRandomDate(),
    duration: getRandomNumber(60, 180),
    genres: generateGenres(),
    ratingByAge: `18+`,
    director: `Anthony Mann`,
    writers: `Anne Wigton, Heinz Herald, Richard Weil`,
    actors: `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`,
    country: `USA`,
    isFavorite: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isWantToWatch: Math.random() > 0.5,
    comments: generateComments(),
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

const films = generateFilms(CARDS_COUNT);

export {films};
