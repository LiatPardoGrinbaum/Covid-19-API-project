export async function getCovidCountriesData() {
  try {
    const countriesData = await fetchData("https://corona-api.com/countries");
    return countriesData;
  } catch (e) {
    console.log(e);
  }
}

export async function getWorldData() {
  try {
    const continentsData = await fetchData("https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1");
    // console.log(continentsData);
    return continentsData;
  } catch (e) {
    console.log(e);
  }
}

export async function getObjectOfContinents(getWorldData) {
  //get array of continets names
  try {
    const continents = await getWorldData();
    const continentsNames = continents.map((country) => {
      return country.region;
    });
    const continentsArray = removeDuplicatesContinents(continentsNames);
    return getContinentsObj(continentsArray);
    //return the continets object with all countries names in any continent
  } catch (e) {
    console.log(e);
  }
}

//creates the object which contains continents as keys. inside thers is an array of all counries in that continent.
async function getContinentsObj(continentsArray) {
  try {
    const continentsKeys = {};
    const countriesInContinents = await Promise.all(
      continentsArray.map(async function (continent) {
        return await fetchData(`https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${continent}`);
      })
    );
    for (let i = 0; i < countriesInContinents.length; i++) {
      for (let j = 0; j < countriesInContinents[i].length; j++) {
        countriesInContinents[i][j] = countriesInContinents[i][j].cca2;
      }
    }
    continentsArray.forEach((continent, i) => {
      continentsKeys[continent] = countriesInContinents[i];
    });
    return continentsKeys;
  } catch (e) {
    console.log(e);
  }
}

function removeDuplicatesContinents(arr) {
  try {
    const newArr = [];
    arr.forEach((continent) => {
      if (!newArr.includes(continent) && continent !== "") {
        newArr.push(continent);
      }
    });
    return newArr;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}
