function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then(result => result)
    .catch(({ status, message }) => {
      const errorMessage =
        status === 404 ? 'Oops, there is no country with that name' : message;
      throw new Error(errorMessage);
    });
}

export { fetchCountries };
