'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const btnMore = document.querySelector('.btn-showmore');
const btnAgain = document.querySelector('.btn-tryagain');

///////////////////////////////////////
btn.addEventListener('click', () => {
  const countryName = prompt('Which country are you interested in?');
  getCountryData(countryName);
  btn.classList.add('hidden');
});
btnAgain.addEventListener('click', () => {
    btnAgain.innerText = "Are you sure?";
    btnAgain.addEventListener('click', () => {
          location.reload();
    })
});

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}M</p>
            <p class="country__row"><span>🗣️</span>${Object.values(
              data.languages
            ).slice(0, 3)}</p>
            <p class="country__row"><span>💰</span>${Object.values(
              data.currencies
            )
              .map(({ name }) => name)
              .join(', ')}</p>
        </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getCountryData = function (country) {
  let allNeighborData; // Store all neighbor data for future reference
  let displayedNeighbors = 0; // Track the number of neighbors already displayed

  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0]);
      btnMore.classList.remove('hidden');

      const neighbors = data[0].borders;

      if (!neighbors || neighbors.length === 0) {
        throw new Error('No neighboring countries found!');
      }

      const neighborPromises = neighbors.map(neighbor => {
        return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`).then(
          response => response.json()
        );
      });

      return Promise.all(neighborPromises);
    })
    .then(neighborDataArray => {
      allNeighborData = neighborDataArray; // Store all neighbor data

      if (neighborDataArray.length > 0) {
        renderCountry(neighborDataArray[0][0], 'neighbour');
        displayedNeighbors++;
      }
    })
    .catch(err => {
      console.error(`${err} 💥 💥 💥`);
      renderError(`Error: Not a country`);
      btnMore.classList.add('hidden');
      btnAgain.classList.remove('hidden');
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });

  btnMore.addEventListener('click', () => {
    if (displayedNeighbors < allNeighborData.length) {
      renderCountry(allNeighborData[displayedNeighbors][0], 'neighbour');
      displayedNeighbors++;

      if (displayedNeighbors >= allNeighborData.length) {
        btnMore.classList.add('hidden');
        btnAgain.classList.remove('hidden');
      }

      // Scroll to the last added country container after a short delay
      setTimeout(() => {
        const newCountryContainer = countriesContainer.lastElementChild;
        newCountryContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300); // Adjust the delay as needed
    }
  });
};

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};