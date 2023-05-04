import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
var debounce = require('lodash.debounce');

const inputEL = document.querySelector('input#search-box');
const countryListEL = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

inputEL.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const typed = e.target.value.trim();
  fetchCountries(typed)
    .then(resp => {
      if (resp.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryListEL.innerHTML = '';
        countryInfoEl.innerHTML = '';
      }
      if (resp.length <= 10) {
        countryListEL.innerHTML = countryListMarkup(resp);
        countryInfoEl.innerHTML = '';
      }
      if (resp.length === 1) {
        countryListEL.innerHTML = '';
        countryInfoEl.innerHTML = countryInfoMarkup(resp);
      }
    })
    .catch(err => {
      console.log(err);
      Notify.failure('Oops, there is no country with that name');
      countryListEL.innerHTML = '';
      countryInfoEl.innerHTML = '';
    });
}

function countryListMarkup(markup) {
  return markup
    .map(
      ({ flags: { svg, alt }, name: { official } }) =>
        `<li style="list-style: none;">
        <img src="${svg}" alt="${alt}" height = "30" width="50" />
      <span style="font-size: 21px;">${official}</span></li>`
    )
    .join('');
}

function countryInfoMarkup(markup) {
  return markup
    .map(
      ({
        flags: { svg, alt },
        name: { official },
        capital,
        languages,
        population,
      }) =>
        `
        <div class="country" style="display: flex; flex-direction: row;">
        <img src="${svg}" alt="${alt}" height="35"  style="margin-right: 20px;">
        <div>
          <h2 class="country-name" style="font-size: 28px; margin-top: 0; margin-bottom: 15px;">${official}</h2>
          <div class="country-info" style="font-size: 18px; line-height: 1.5;">
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Languages:</strong> ${Object.values(languages)}</p>
            <p><strong>Population:</strong> ${population}</p>
          </div>
        </div>
      </div>
      
`
    )
    .join('');
}
