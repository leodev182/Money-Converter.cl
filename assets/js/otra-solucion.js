// ----------------------------------------------------------------------DOM ELEMENTS
const inputCoin = document.querySelector("input");
const selectCoin = document.querySelector("select");
const btn = document.querySelector(".btn");
const span = document.querySelector("span");
const graph = document.querySelector("#myChart");

// -----------------------------------------------------------------------VARIABLES
//     endpoint by API

const urlAPI = "https://mindicador.cl/api/";
var myChart;

// -----------------------------------------------------------------------FUNCTIONS
//     call data by endpoint
async function getMyIndicador(typeOfChange, worthCoin) {
  try {
    const res = await fetch(urlAPI + typeOfChange);
    const data = await res.json();
    const { serie } = data;
    // console.table(serie);

    const info = stageData(serie.slice(0, 10).reverse());
    // console.table(info);

    renderGraphic(info);

    const coinValue = data.serie[0].valor;

    const total = worthCoin / coinValue;

    switch (typeOfChange) {
      case "dolar":
        span.innerHTML = `${total.toFixed(2)} $`;
        break;
      case "euro":
        span.innerHTML = `${total.toFixed(2)} €`;
        break;
      case "uf":
        span.innerHTML = `${total.toFixed(2)} UF`;
        break;
      case "utm":
        span.innerHTML = `${total.toFixed(2)} UTM`;
        break;
      default:
        alert("Por favor ingrese un valor");
        break;
    }

    //    cleaning input
    inputCoin.value = "";
  } catch (e) {
    console.log(e.message);
  }
}

function renderGraphic(data) {
  const config = {
    type: "line",
    data: data,
  };

  //    desroying graphic

  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(graph, config);
}

const stageData = (serie) => {
  const labels = serie.map(({ fecha }) => restartDate(fecha));
  console.log(labels);
  const amountData = serie.map(({ valor }) => valor);
  // console.table(amountData);
  const datasets = [
    {
      label: selectCoin.value,
      borderColor: "rgb(28, 5, 238)",
      data: amountData,
    },
  ];
  return { labels, datasets };
};

const restartDate = (fecha) => {
  date = new Date(fecha);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day} - ${month} - ${year}`;
};

// -----------------------------------------------------------------------EVENTS

btn.addEventListener("click", () => {
  const amountCoin = inputCoin.value;
  const worthSelected = selectCoin.value;
  console.log(worthSelected);
  getMyIndicador(worthSelected, amountCoin);
});
