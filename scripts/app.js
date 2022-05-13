import { getCovidCountriesData, getWorldData, getObjectOfContinents } from "./fetch.js";
import { drawChart } from "./chart.js";

const contriesBtns = document.querySelector(".continent-container");
const casesStatistics = document.querySelector(".worldStatistics");
const select = document.querySelector(".select");
const ctx = document.getElementById("myChart");

async function countriesStatus() {
  try {
    const covidCountries = await getCovidCountriesData(); //array of all countries!
    const continentsObj = await getObjectOfContinents(getWorldData); //object of continents
    //try to underatand how to get setBtnEvents funtion out
    contriesBtns.addEventListener("click", function (e) {
      select.innerHTML = "";
      const name = e.target.name;
      //defalut case- confirmed:
      let confirmed = "confirmed";
      resetActivation(casesStatistics, confirmed);

      const allWorldCountries = []; //for x axis but next we need to compare to covid countries
      for (let key in continentsObj) {
        allWorldCountries.push(...continentsObj[key]);
      }
      if (name === "World") {
        resetActivation(contriesBtns, name);
        setContinentsButtonsConfirmed(allWorldCountries, covidCountries);
      } else if (name != null) {
        //if the clicked element is not the container itself
        resetActivation(contriesBtns, name);

        const countriesOfcontinents = continentsObj[name];
        setContinentsButtonsConfirmed(countriesOfcontinents, covidCountries);
      }
    });
    // const options = [...select.children];
    // select.addEventListener("change", function () {
    //   if (select.value === options[1].value) {
    //     console.log(options[1].value);
    //   }
    // });

    casesStatistics.addEventListener("click", function (e) {
      const name = e.target.name;
      const continentBtns = [...contriesBtns.children];
      const worldOrContinentBtn = continentBtns.find((btn) => {
        if (btn.getAttribute("data-isActive") === "true") {
          return btn;
        }
      });

      if (name === "confirmed") {
        resetActivation(casesStatistics, name);
        setStateBtn(continentsObj, worldOrContinentBtn, covidCountries, setContinentsButtonsConfirmed);
      } else if (name === "recovered") {
        resetActivation(casesStatistics, name);
        setStateBtn(continentsObj, worldOrContinentBtn, covidCountries, setContinentsButtonsRecovered);
      } else if (name === "critical") {
        resetActivation(casesStatistics, name);
        setStateBtn(continentsObj, worldOrContinentBtn, covidCountries, setContinentsButtonsCritical);
      } else if (name === "deaths") {
        resetActivation(casesStatistics, name);
        setStateBtn(continentsObj, worldOrContinentBtn, covidCountries, setContinentsButtonsDeaths);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

// console.log(covidCountries.data[0].latest_data.confirmed);
// console.log(covidCountries.data[0].latest_data.recovered);
// console.log(covidCountries.data[0].latest_data.critical);
// console.log(covidCountries.data[0].latest_data.deaths);

countriesStatus();

drawChart([1, 2, 3], "hello", [1, 2, 4]);

function sortCountries(arr) {
  arr.sort(function (a, b) {
    const nameA = a.name;
    const nameB = b.name;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  });
  return arr;
}

function createOptions(arr) {
  const option1 = document.createElement("option");
  select.appendChild(option1);
  option1.innerText = "Choose country";
  arr.forEach((country, i) => {
    const option = document.createElement("option");
    select.appendChild(option);
    option.value = country;
    option.innerText = country;
  });
}

function getConfirmCases(arr) {
  const confirmed = [];

  return confirmed;
}

//functions for all statuses
//confirmed
function setContinentsButtonsConfirmed(worldOrContinentsCountries, covidCountries) {
  const dataYfiltered = covidCountries.data.filter((country) => {
    if (worldOrContinentsCountries.includes(country.name)) {
      return country;
    }
  });
  let covidCase = "Covid-19 confirmed";
  const dataYObj = sortCountries(dataYfiltered);
  const dataConfirmedY = [];
  const dataX = [];
  dataYObj.forEach((country) => {
    dataConfirmedY.push(country.latest_data.confirmed); //confirmed cases for y axis
    dataX.push(country.name); //countries for x axis compared to countries from covid api
  });
  drawChart(dataX, covidCase, dataConfirmedY);
  createOptions(dataX);
}

//recovered
function setContinentsButtonsRecovered(worldOrContinentsCountries, covidCountries) {
  const dataYfiltered = covidCountries.data.filter((country) => {
    if (worldOrContinentsCountries.includes(country.name)) {
      return country;
    }
  });
  let covidCase = "Covid-19 Recovered";
  const dataYObj = sortCountries(dataYfiltered);
  const dataRecoveredY = [];
  const dataX = [];
  dataYObj.forEach((country) => {
    dataRecoveredY.push(country.latest_data.recovered); //recovered cases for y axis
    dataX.push(country.name); //countries for x axis compared to countries from covid api
  });
  drawChart(dataX, covidCase, dataRecoveredY);
  createOptions(dataX);
}

//critical
function setContinentsButtonsCritical(worldOrContinentsCountries, covidCountries) {
  const dataYfiltered = covidCountries.data.filter((country) => {
    if (worldOrContinentsCountries.includes(country.name)) {
      return country;
    }
  });
  let covidCase = "Covid-19 critical";
  const dataYObj = sortCountries(dataYfiltered);
  const dataCriticalY = [];
  const dataX = [];
  dataYObj.forEach((country) => {
    dataCriticalY.push(country.latest_data.critical); //critical cases for y axis
    dataX.push(country.name); //countries for x axis compared to countries from covid api
  });
  drawChart(dataX, covidCase, dataCriticalY);
  createOptions(dataX);
}

//deaths
function setContinentsButtonsDeaths(worldOrContinentsCountries, covidCountries) {
  const dataYfiltered = covidCountries.data.filter((country) => {
    if (worldOrContinentsCountries.includes(country.name)) {
      return country;
    }
  });
  let covidCase = "Covid-19 deaths";
  const dataYObj = sortCountries(dataYfiltered);
  const dataDeathsY = [];
  const dataX = [];
  dataYObj.forEach((country) => {
    dataDeathsY.push(country.latest_data.deaths); //deaths cases for y axis
    dataX.push(country.name); //countries for x axis compared to countries from covid api
  });
  drawChart(dataX, covidCase, dataDeathsY);
  createOptions(dataX);
}

function resetActivation(btnContainer, name) {
  const btns = [...btnContainer.children];
  btns.forEach((btn) => {
    btn.setAttribute("data-isActive", "false");
  });
  const currentBtn = document.querySelector(`[name=${name}]`);
  currentBtn.setAttribute("data-isActive", "true");
}

function setStateBtn(continentsObj, worldOrContinentBtn, covidCountries, setContinentsButtonStatus) {
  const allWorldCountries = [];
  for (let key in continentsObj) {
    allWorldCountries.push(...continentsObj[key]);
  }
  if (worldOrContinentBtn.getAttribute("name") === "World") {
    setContinentsButtonStatus(allWorldCountries, covidCountries);
  } else if (worldOrContinentBtn.getAttribute("name") != null) {
    //if the clicked element is not the container itself
    const countriesOfcontinents = continentsObj[worldOrContinentBtn.getAttribute("name")];

    setContinentsButtonStatus(countriesOfcontinents, covidCountries);
  }
}
