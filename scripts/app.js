import { getCovidCountriesData, getWorldData, getObjectOfContinents } from "./fetch.js";
import { drawChart } from "./chart.js";

const contriesBtns = document.querySelector(".countries-container");
const select = document.querySelector(".select");
const ctx = document.getElementById("myChart");

async function countriesStatus() {
  const covidCountries = await getCovidCountriesData(); //array of all countries!
  const continentsObj = await getObjectOfContinents(getWorldData); //object of continents
  //try to underatand how to get setBtnEvents funtion out
  contriesBtns.addEventListener("click", function setBtnEvents(e) {
    select.innerHTML = "";
    const name = e.target.name;

    const countriesOfcontinents = continentsObj[name];
    const dataYfilterd = covidCountries.data.filter((country) => {
      if (countriesOfcontinents.includes(country.name)) {
        return country;
      }
    });

    let covidCase = "Covid-19 confirmed";
    const dataYObj = sortCountries(dataYfilterd); //sort alphabetical by name

    const dataConfirmedY = [];
    const dataX = [];

    dataYObj.forEach((country) => {
      dataConfirmedY.push(country.latest_data.confirmed); //confirmed cases for y axis
      dataX.push(country.name); //countries for x axis compared to countries from covid api
    });

    drawChart(dataX, covidCase, dataConfirmedY);
    createOptions(dataX); //create countries options elements in select bar
    // drawChart(dataX, covidCase, dataConfirmedY);
  });
  // const countryFilterd=covidCountries.filter((country)=>{
  //   continentsObj[name].includes(country)
  // }
}

// console.log(continentsObj);
// console.log(covidCountries.data[0].latest_data.confirmed);
// console.log(covidCountries.data[0].latest_data.recovered);
// console.log(covidCountries.data[0].latest_data.critical);
// console.log(covidCountries.data[0].latest_data.deaths);
//   const filterdConfirm=covidCountries.data.find((country)=>{
//     if getObjectOfContinents
// country.name ===
//   })

countriesStatus();
// for (let item of )
// document.createElement("button")
// countriesBtns.

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

// if (dataY[i].indexOf[dataX] !== -1) {
// }
