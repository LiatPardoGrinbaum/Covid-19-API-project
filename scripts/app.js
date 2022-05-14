import { getCovidCountriesData, getWorldData, getObjectOfContinents } from "./fetch.js";
import { drawChart } from "./chart.js";

const contriesBtns = document.querySelector(".continent-container");
const casesStatistics = document.querySelector(".worldStatistics");
const select = document.querySelector(".select");
const dataBox = document.querySelector(".countryData");
const ctx = document.getElementById("myChart");

async function mainButtonsFuncionality() {
  try {
    const covidCountries = await getCovidCountriesData(); //array of all countries!
    const continentsObj = await getObjectOfContinents(getWorldData); //object of continents

    //reset page to show world confirmed chart and show all countries options:
    const allWorldCountries = []; //for x axis but next we need to compare to covid countries
    for (let key in continentsObj) {
      allWorldCountries.push(...continentsObj[key]);
    }
    setContinentsButtonsConfirmed(allWorldCountries, covidCountries);

    contriesBtns.addEventListener("click", function (e) {
      select.innerHTML = ""; //clear current oprions in select bar
      const name = e.target.name;
      //defalut case- confirmed:
      let confirmed = "confirmed";
      resetActivation(casesStatistics, confirmed);

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

    select.addEventListener("change", function () {
      const currentCountry = this.value;
      const currentCountryObj = covidCountries.data.find((country) => {
        if (country.name === currentCountry) {
          return country;
        }
      });
      dataBox.textContent = "";
      const title = document.createElement("h3");
      title.classList.add("h3Style");
      const confirmDiv = document.createElement("p");
      confirmDiv.classList.add("pStyle");
      const confirmNum = document.createElement("p");
      confirmNum.classList.add("pStyle");
      dataBox.append(title, confirmDiv, confirmNum);

      title.textContent = currentCountry;

      confirmDiv.textContent = "Total Cases";
      let sum = currentCountryObj.latest_data.confirmed;
      function numberWithCommas(sum) {
        return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      confirmNum.textContent = numberWithCommas(sum);

      console.log(currentCountryObj.latest_data.confirmed);
      console.log(currentCountryObj.latest_data.recovered);
      console.log(currentCountryObj.latest_data.deaths);
      console.log(currentCountryObj.latest_data.critical);
      console.log(currentCountryObj.today.deaths);
      console.log(currentCountryObj.today.confirmed);
    });

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

mainButtonsFuncionality();

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

//a functions that adds options to select bar depend on the continent you select
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

//functions for all 4 statuses of continents and world
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
  let status = "Total Confirmed Cases";
  drawDataBoxButtons(status, dataConfirmedY);
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
  let status = "Total Recovered Cases";
  drawDataBoxButtons(status, dataRecoveredY);
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
  let status = "Total Critical Cases";
  drawDataBoxButtons(status, dataCriticalY);
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
  let status = "Total Deaths Cases";
  drawDataBoxButtons(status, dataDeathsY);
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
  const currentBtnName = worldOrContinentBtn.getAttribute("name");
  if (currentBtnName === "World") {
    setContinentsButtonStatus(allWorldCountries, covidCountries);
  } else if (currentBtnName != null) {
    //if the clicked element is not the container itself
    const countriesOfcontinents = continentsObj[worldOrContinentBtn.getAttribute("name")];

    setContinentsButtonStatus(countriesOfcontinents, covidCountries);
  }
}
//first call with "World"
function drawDataBoxButtons(status, dataStatusY) {
  const continentBtns = [...contriesBtns.children];
  const worldOrContinentBtn = continentBtns.find((btn) => {
    if (btn.getAttribute("data-isActive") === "true") {
      return btn;
    }
  });
  const currentBtnName = worldOrContinentBtn.getAttribute("name");
  //to insert to statebtn
  dataBox.textContent = "";
  const titleName = document.createElement("h2");
  dataBox.appendChild(titleName);
  titleName.textContent = currentBtnName;
  const titleTotal = document.createElement("h3");
  dataBox.appendChild(titleTotal);
  titleTotal.textContent = status;
  const totalNumber = document.createElement("p");
  dataBox.appendChild(totalNumber);
  const sum = dataStatusY.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  function numberWithCommas(sum) {
    return sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const sumStr = numberWithCommas(sum);
  totalNumber.textContent = sumStr;
}

function drawDataBoxOptions() {
  dataBox;
}
