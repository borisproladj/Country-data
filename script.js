'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend',msg);
}

const renderCountry = function(data, className= '') {
const html = 
    `<article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}M</p>
            <p class="country__row"><span>🗣️</span>${Object.values(data.languages)}</p>
            <p class="country__row"><span>💰</span>${Object.values(data.currencies).map(({ name }) => name).join(', ')}</p>
        </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend',html)
}


// const request = fetch('https://restcountries.com/v3.1/name/portugal');

const getCountryData = function(country) {
    fetch(`https://restcountries.com/v3.1/name/${country}`)
        .then(response => response.json())
        .then(data => {
            renderCountry(data[0]);
            const neighbor = data[0].borders[0];
            

            if(!neighbor) return;

            return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
        })
        .then(response => response.json())
        .then(data => renderCountry(...data, 'neighbour'))
        .catch(err => {
            console.error(`${err} 💥 💥 💥`);
            renderError(`Something went wrong 💥 ${err.message}. Try again!`)
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
        }) 

};


const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// const inputCoords = function(coords) {
//     const coords1 = prompt(`Whats your first coordinate?`)
//     const coords2 = prompt(`Whats your second coordinate?`)
//     const coords = coords1.concat(',', coords2)
// }
// inputCoords()

const getCountryCoords = function (cord1,cord2) {
    const apiKey = '15992428671418319566x58885';
    fetch(`https://geocode.xyz/${cord1},${cord2}?geoit=json&auth=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            
            const formattedCity = capitalizeFirstLetter(data.city);
            console.log(`You're in ${formattedCity}, ${data.country}`);
            getCountryData(data.country)
        })
        .catch(err => {
            console.error('Error fetching or parsing data:', err);
        });
}

// getCountryCoords(52.508,13.381);
// getCountryCoords(19.038,72.873);
// getCountryCoords(-33.933,18.474);
getCountryData('australia')










// const getCountryAndNeighbor = function(country){


// const request =  new XMLHttpRequest();
// request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
// request.send();

// request.addEventListener('load', function() {
//     const [data] = JSON.parse(this.responseText)
//     // console.log(Object.values(data.currencies).map(currency => currency.name).join(', '));
//     renderCountry(data)

//     const [neighbor] = data.borders

//     if(!neighbor) return;

//     const request2 =  new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbor}`);
//     request2.send();

//     request2.addEventListener('load', function() {
//         const [data2] = JSON.parse(this.responseText);

//         renderCountry(data2, 'neighbour')
//         })
//     })
// };
// // getCountryAndNeighbor('portugal')
// getCountryAndNeighbor('usa')
// setTimeout(() => {
//     console.log('1 second passed')
//     setTimeout(() => {
//         console.log('2 second passed')
//         setTimeout(() => {
//             console.log('3 second passed')
//             setTimeout(() => {
//                 console.log('4 second passed')
//             },1000)
//         },1000)
//     },1000)
// },1000)
