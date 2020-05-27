import {MINUTES_IN_HOUR, UserRank} from "../consts";
import moment from "moment";

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

export const getHours = (duration) => {
  return Math.floor(duration / MINUTES_IN_HOUR);
};
export const getMinutes = (duration) => {
  return duration % MINUTES_IN_HOUR;
};

export const formatReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatReleaseYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDateOfComment = (date) => {
  return moment(date).fromNow();
};

export const getUserRank = (amount) => {
  let rank;

  if (amount === 0) {
    return null;
  } else if (amount >= 1 && amount <= 10) {
    rank = UserRank.NOTICE;
  } else if (amount >= 11 && amount <= 20) {
    rank = UserRank.FAN;
  } else if (amount >= 21) {
    rank = UserRank.MOVIE_BUFF;
  }

  return rank;
};

export const getStoreName = (prefix, version) => {
  return `cinemaadict-${prefix}-localstorage-${version}`;
};
