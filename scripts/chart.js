const ctx = document.getElementById("myChart");
let myChart = null;
export function drawChart(dataX, covidCase, dataY) {
  if (myChart != null) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dataX,
      datasets: [
        {
          label: covidCase,
          data: dataY,
          backgroundColor: ["rgba(54, 162, 235, 0.2)"],
          borderColor: ["rgba(30, 89, 179,0.5)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRation: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
