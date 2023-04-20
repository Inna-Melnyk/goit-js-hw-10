import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoContainerEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  evt.preventDefault();

  const countryName = evt.target.value.trim();
  countryInfoContainerEl.innerHTML = '';

  if (!countryName) {
    countryListEl.innerHTML = '';
    return;
  }

  fetchCountries(countryName)
    .then(countryList => {

      if (countryList.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countryList.length > 2 && countryList.length < 10) {
        createListMarkup(countryList);
      } else {
        countryListEl.innerHTML = '';
        createInfoCardMarkup(countryList);
      }
    })
    .catch(({ message }) => Notiflix.Notify.failure(message));
}

function createListMarkup(arr) {
  const markup = arr
    .map(
      ({ name: { official: officalName }, flags: { svg: flag } }) =>
        `<li class="country-list_item">
               <a class="flag-link" href="${flag}">
              <img class="flag-img" src="${flag}" alt="${officalName}" width = "25" />
              </a>
              <h1 class="contry-list-name">${officalName}</h1>
              </li>`
    )
    .join('');

  countryListEl.innerHTML = markup;
}

function createInfoCardMarkup(arr) {
  const markup = arr
    .map(
      ({
        name: { official: officalName },
        capital: [capital = 'It is not a country'],
        languages,
        population,
        flags: { svg: flag },
      }) =>
        `     <div class="card-heading" href="${flag}">
              <img class="flag-img" src="${flag}" alt="${officalName}" width = "50" />
              <h1 class="card-country-name">${officalName}</h1>
               </div>
               <ul class="card-descr-list">
               <li class="card-descr-list-item">
               <p class="description-text">Capital:<span class="description-value"> ${capital}</span></p>
               </li>
               <li class="card-descr-list-item">
               <p class="description-text">Population: <span class="description-value"> ${population}</span></p>
               </li>
               <li class="card-descr-list-item">
               <p class="description-text">Languages: <span class="description-value">${Object.values(
                 languages
               )}</span></p>
               </li>
               </ul>
              `
    )
    .join('');

  countryInfoContainerEl.innerHTML = markup;
}
