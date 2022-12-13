const btnCalcular = document.getElementById("submiter")
const monedas = document.getElementById("moneda")
const pesos = document.getElementById("monto")
const resultado = document.getElementById("result")
const graph = document.getElementById("grafico");
const spinner = document.getElementById("spinner")
let renderGraph;

const getData = async (monedas) => {
    try {
            
            const response = await fetch(`https://mindicador.cl/api/${monedas}`);
            const arrayMonedas = await response.json();
            arrayMonedas.serie.forEach((moneda, index) => {
                if(index == 0){
                    resultado.innerHTML = `<p>Resultado: <b>${Intl.NumberFormat('de-DE').format(pesos.value/moneda.valor)}</b>`
                }    
            });     
    } catch (error) {
        alert("No se puede acceder a la información solicitada")    
    }
}

const chartRender = async (monedas) => {
    try {
        if(renderGraph) {
            renderGraph.destroy();
        }    
        spinner.classList.remove("d-none")
        const response = await fetch(`https://mindicador.cl/api/${monedas}`);
        const arrayMonedas = await response.json();
        const arrayNuevo = arrayMonedas.serie.slice(0,10.).reverse();
        const fechas = arrayNuevo.map((item) => item.fecha.split("T")[0].split("-").reverse().join("-"))
        const valores = arrayNuevo.map((item) => item.valor)

    

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
        spinner.classList.add("d-none")
        } 
    catch (error) {
        alert("No se puede mostrar la informacion del grafico")
        
    }
}


btnCalcular.addEventListener("submit", (e) => { 
    e.preventDefault()
    let inp = monedas.value
    let inp2 = +pesos.value

    if(inp2 <= 0){
        alert("debe ingresar un valor mayor a '0'")
        return
    }
    if(inp == ""){
        alert("Debe seleccionar un tipo de moneda")
        return
    }
    else{
        getData(monedas.value)
        chartRender(monedas.value)
    } 
})