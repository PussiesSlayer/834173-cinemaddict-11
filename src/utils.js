import {MINUTES_IN_HOUR} from "./consts";

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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);

  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

export const render = (container, template, place) => {
  switch (place) {
    case RenderPosition.BEFOREEND:
      container.append(template);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(template);
      break;
    case RenderPosition.AFTEREND:
      container.after(template);
      break;
  }
};
