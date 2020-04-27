import {MINUTES_IN_HOUR} from "../consts";
import moment from "moment";

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const normalizeDuration = (duration) => {
  const hours = `${Math.floor(duration / MINUTES_IN_HOUR)}`;
  const minutes = `${duration % MINUTES_IN_HOUR}`;

  if (duration % MINUTES_IN_HOUR === 0) {
    return `${hours}h`;
  } else if (duration < 60) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

export const formatReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatReleaseYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDateOfComment = (date) => {
  return moment(date).format(`YYYY/MM/DD H:mm`);
};
