const countriesBtns = document.querySelector(".countries-container");

async function getCovidCountriesData() {
  const countriesData = await fetchData("https://corona-api.com/countries");
  return countriesData;
  // console.log(countriesData.data[1].name);
}
getCovidCountriesData();

async function getWorldData() {
  const continentsData = await fetchData("https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1");
  // console.log(continentsData);
  return continentsData;
}

// worldData();

async function getArrayOfContinents(getWorldData, getCovidCountriesData) {
  //get array of continets names
  const continents = await getWorldData();
  const continentsNames = continents.map((country) => {
    return country.region;
  });
  const continentsArray = removeDuplicatesContinents(continentsNames);
  // console.log(continentsArray);
  getContinentsObj(continentsArray);

  // return continentsArray;
}

getArrayOfContinents(getWorldData);

//creates the object which contain continents as keys. inside thers is an array of all counries in that continent.
async function getContinentsObj(continentsArray) {
  const continentsKeys = {};
  const countriesInContinents = await Promise.all(
    continentsArray.map(async function (continent) {
      return await fetchData(`https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${continent}`);
    })
  );
  console.log(countriesInContinents);

  // continentsKeys[newContinentsArray[i]] = continent;

  for (let i = 0; i < countriesInContinents.length; i++) {
    for (let j = 0; j < countriesInContinents[i].length; j++) {
      countriesInContinents[i][j] = countriesInContinents[i][j].name.common;
    }

    // countriesInContinents[i] = countriesInContinents[i].name;
  }
  console.log(countriesInContinents);
  continentsArray.forEach((continent, i) => {
    continentsKeys[continent] = countriesInContinents[i];
  });
  console.log(continentsKeys);
}

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function removeDuplicatesContinents(arr) {
  const newArr = [];
  arr.forEach((continent) => {
    if (!newArr.includes(continent) && continent !== "") {
      newArr.push(continent);
    }
  });
  return newArr;
}

// const mainObject = {
//   Asia: [],
//   Europe: [],
//   Africa: [],
//   Oceania: [],
//   Americas: [],
// };
