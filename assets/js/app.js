const btnCalcular = document.getElementById("submiter")
const monedas = document.getElementById("moneda")
const pesos = document.getElementById("monto")
const resultado = document.getElementById("result")
const graph = document.getElementById("grafico");
const dolar = "https://mindicador.cl/api/dolar"
const euro = "https://mindicador.cl/api/euro"
let renderGraph;
const getDataDollar = async () => {
    try {
            const response = await fetch(dolar);
            const arrayMonedas = await response.json();
            arrayMonedas.serie.forEach((moneda, index) => {
                if(index == 0){
                    resultado.innerHTML = `<p>Resultado: <b>${Intl.NumberFormat('de-DE').format(pesos.value/moneda.valor)}</b>`
                }    
            });     
    } catch (error) {
        console.log(error)     
    }
}


const getDataEuro = async () => {
    try {
            const response = await fetch(euro);
            const arrayMonedas = await response.json();
            arrayMonedas.serie.forEach((moneda, index) => {
                if(index == 0){
                    resultado.innerHTML = `<p>Resultado: <b>${Intl.NumberFormat('de-DE').format(pesos.value/moneda.valor)}`
                }    
            });   
    } catch (error) {
        console.log(error)     
    }
}

const chartRender = async (monedas) => {
    const response = await fetch(`https://mindicador.cl/api/${monedas}`);
    const arrayMonedas = await response.json();
    const arrayNuevo = arrayMonedas.serie.slice(0,10.).reverse();
    const fechas = arrayNuevo.map((item) => item.fecha.split("T")[0].split("-").reverse().join("-"))
    const valores = arrayNuevo.map((item) => item.valor)

    if(renderGraph) {
        renderGraph.destroy();
    }


    renderGraph = new Chart(graph, {
        type: 'line',
        data: {
          labels: fechas,
          datasets: [{
            label: 'Valor Ultimos 10 días',
            data: valores,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
}


btnCalcular.addEventListener("submit", (e) => { 
    e.preventDefault()
    let inp = monedas.value
    let inp2 = +pesos.value

    if(inp2 <= 0){
        alert("debe ingresar un valor mayor a '0'")
        return
    }
    if(inp == "dolar"){
        getDataDollar()
        chartRender(monedas.value)
        return
    }
    if(inp == "euro"){
        getDataEuro()
        chartRender(monedas.value)
        return
    }
    else{
        alert("Debe seleccionar un tipo de moneda")
    }

})