import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {getUserRank, getHours, getMinutes} from "../utils/common";
import {getWatchedFilms} from "../utils/filter";
import moment from "moment";

const BAR_HEIGHT = 50;

const NOTHING = 0;

const PeriodFilterType = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const getTotalDuration = (watchedFilms) => {
  const allDurations = watchedFilms.map((film) => {
    return film.duration;
  });

  return allDurations.length === 0 ? NOTHING : allDurations.reduce((acc, it) => acc + parseFloat(it));
};

const getGenresCounts = (watchedFilms) => {
  let genresCount = {};

  watchedFilms.map((film) => {
    film.genres.map((genre) => {
      if (genre in genresCount) {
        genresCount[genre]++;
      } else {
        genresCount[genre] = 1;
      }
    });
  });

  return genresCount;
};

const getFavoriteGenre = (watchedFilms) => {
  const genresCount = getGenresCounts(watchedFilms);

  let maxGenreCount = 1;
  let favoriteGenre = ``;

  Object.keys(genresCount).map((genre) => {
    if (maxGenreCount === 1 || genresCount[genre] > maxGenreCount) {
      maxGenreCount = genresCount[genre];
      favoriteGenre = genre;
    }
  });

  return favoriteGenre;
};

const getWatchedFilmsByPeriod = (watchedFilms, dateFrom) => {
  if (!dateFrom) {
    return watchedFilms;
  }

  return watchedFilms.filter((film) => film.watchedDate >= dateFrom);
};

const renderChart = (statisticCtx, watchedFilms) => {
  statisticCtx.height = BAR_HEIGHT * 5;

  const genresCounts = getGenresCounts(watchedFilms);

  const genres = Object.keys(genresCounts);
  const counts = Object.values(genresCounts);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticTemplate = (watchedFilms, datePeriod, rank) => {
  const watchedFilmsAmount = watchedFilms.length;

  const totalDuration = getTotalDuration(watchedFilms);
  const hours = getHours(totalDuration);
  const minutes = getMinutes(totalDuration);

  const favoriteGenre = getFavoriteGenre(watchedFilms);

  return (
    `<section class="statistic">
      ${rank === null ? `` :
      `<p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
      </p>`
    }
   

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${datePeriod === PeriodFilterType.ALL_TIME ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${datePeriod === PeriodFilterType.TODAY ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${datePeriod === PeriodFilterType.WEEK ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${datePeriod === PeriodFilterType.MONTH ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${datePeriod === PeriodFilterType.YEAR ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsAmount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${favoriteGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Statistic extends AbstractSmartComponent {
  constructor(films) {
    super();

    this._allFilms = films;
    this._watchedFilms = getWatchedFilms(this._allFilms);
    this._filteredFilms = this._watchedFilms;

    this._rank = getUserRank(this._watchedFilms.length);

    this._currentPeriod = PeriodFilterType.ALL_TIME;

    this._charts = null;

    this._renderCharts(this._filteredFilms);

    this.datePeriodChangeHandler = null;
    this._onDatePeriodChangeHandler = this._onDatePeriodChangeHandler.bind(this);
    this.setDatePeriodChangeHandler(this._onDatePeriodChangeHandler);
  }

  getTemplate() {
    return createStatisticTemplate(this._filteredFilms, this._currentPeriod, this._rank);
  }

  show() {
    super.show();

    this.rerender();
  }

  hide() {
    super.hide();
  }

  recoveryListeners() {
    this.setDatePeriodChangeHandler(this.datePeriodChangeHandler);
  }

  rerender() {
    super.rerender();

    this._renderCharts(this._filteredFilms);
  }

  setDatePeriodChangeHandler(handler) {
    const periodInputs = this.getElement().querySelectorAll(`.statistic__filters-input`);

    periodInputs.forEach((input) => {
      input.addEventListener(`change`, (evt) => {
        handler(evt.target.value);
      });
    });

    this.datePeriodChangeHandler = handler;
  }

  _onDatePeriodChangeHandler(period) {
    this._currentPeriod = period;
    let dateFrom = null;

    switch (period) {
      case PeriodFilterType.TODAY:
        dateFrom = moment().startOf(`day`).toDate();
        break;
      case PeriodFilterType.WEEK:
        dateFrom = moment().startOf(`isoWeek`).toDate();
        break;
      case PeriodFilterType.MONTH:
        dateFrom = moment().startOf(`month`).toDate();
        break;
      case PeriodFilterType.YEAR:
        dateFrom = moment().startOf(`year`).toDate();
        break;
      default:
        dateFrom = null;
        break;
    }

    this._filteredFilms = getWatchedFilmsByPeriod(this._watchedFilms, dateFrom);
    this.rerender();
  }

  _renderCharts(films) {
    const element = this.getElement();

    const statisticCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._charts = renderChart(statisticCtx, films);
  }

  _resetCharts() {
    if (this._charts) {
      this._charts.destroy();
      this._charts = null;
      this._currentPeriod = PeriodFilterType.ALL_TIME;
    }
  }
}
