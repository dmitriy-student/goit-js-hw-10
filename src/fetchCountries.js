export { fetchCountries };

function fetchCountries(name) {
  const URL = 'https://restcountries.com/v3.1/name/';
  const HEADERS = '?name.official,capital,population,flags.svg,languages';
  return fetch(`${URL}${name}${HEADERS}`).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}
