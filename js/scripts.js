//Cargar nuevos montos
const datosIngresosyGastos = []

//Validación de campos de datos
const validarNoVacio = (dato) => dato.trim() !== ''
const validarNumerico = (dato) => !isNaN(dato) && dato.trim() !== ''

class Registro {
    static id = 0
    constructor(fecha, concepto, monto, iog, categoria) {
        this.id = ++Registro.id
        this.fecha = fecha
        this.concepto = concepto
        if (iog == "gasto") {
            monto = monto * -1
        }
        this.monto = monto
        this.categoria = categoria
    }
    esSueldo = () => {
        return this.categoria == 1
    }
    obtenerSemana = () => {
        let dia = parseInt(this.fecha.split('/')[0]); // Extraer el día de la fecha
        return Math.ceil(dia / 7); // Dividir por 7 para obtener la semana
    }
    // obtenerHora = () => {
    //     return parseInt(this.fecha.split(' ')[1]); //Divide por el espacio y devuelve la parte con indice 1 DD/MM/AAAA hh:mm  
    // }
}

//Devuelve array de objetos con los registros realizados entre las fechas especificadas (formato de fechas Date())
const filtrarPorRangoFechas = (datos, fechaInicio, fechaFin) => {
    return datos.filter((registro) => convertirAFecha(registro.fecha) >= fechaInicio && convertirAFecha(registro.fecha) <= fechaFin)
}

// function obtenerSemana(fecha) {
//     let dia = parseInt(fecha.split('/')[0]); // Extraer el día de la fecha
//     return Math.ceil(dia / 7); // Dividir por 7 para obtener la semana
// }

function obtenerRangoMensual(fechaStr) {
    let fecha = convertirAFecha(fechaStr)
    let primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1, 0, 0)
    let ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59)
    return {
        primerDia: primerDia,
        ultimoDia: ultimoDia
    }
}

function agruparRegistrosPorFecha(tipo, registrosFiltrados) {
    let resultadoFiltro = {}
    if (registrosFiltrados) {
        switch (tipo) {
            case "mensual":
                let semanas = [1, 2, 3, 4]
                let ingresosPorSemana = semanas.map((semana) => {
                    return registrosFiltrados.filter(registro => registro.obtenerSemana() === semana) // Filtrar por semana
                        .reduce((acc, registro) => acc + (registro.monto > 0 ? registro.monto : 0), 0) // Sumar solo ingresos
                })
                let gastosPorSemana = semanas.map((semana) => {
                    return registrosFiltrados.filter(registro => registro.obtenerSemana() === semana) // Filtrar por semana
                        .reduce((acc, registro) => acc + (registro.monto < 0 ? registro.monto * -1 : 0), 0) // Sumar solo gastos
                })
                resultadoFiltro = {
                    etiquetas: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                    ingresos: ingresosPorSemana,
                    gastos: gastosPorSemana
                }
                break
            case "semanal":
                // // Agrupar por días de la semana
                let dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
                let ingresosPorDia = [] //FALTA DEFINIR
                let gastosPorDia = [] //FALTA DEFINIR
                resultadoFiltro = {
                    etiquetas: dias,
                    ingresos: ingresosPorDia,
                    gastos: gastosPorDia
                }
                break
            case "diario":
                //Agrupar por horas del día
                let horas = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
                let fechaRef = convertirAFecha(registrosFiltrados[0].fecha)
                let ingresosPorHora = horas.map((hora, index) => {
                    return registrosFiltrados.filter(registro => convertirAFecha(registro.fecha) >= fechaRef.setHours(index, 0, 0) && convertirAFecha(registro.fecha) <= fechaRef.setHours(index, 59, 59)) // Filtrar por hora
                        .reduce((acc, registro) => acc + (registro.monto > 0 ? registro.monto : 0), 0) // Sumar solo ingresos
                })
                let gastosPorHora = horas.map((hora, index) => {
                    return registrosFiltrados.filter(registro => convertirAFecha(registro.fecha) >= fechaRef.setHours(index, 0, 0) && convertirAFecha(registro.fecha) <= fechaRef.setHours(index, 59, 59)) // Filtrar por hora
                        .reduce((acc, registro) => acc + (registro.monto < 0 ? registro.monto * -1 : 0), 0) // Sumar solo gastos
                })
                resultadoFiltro = {
                    etiquetas: horas,
                    ingresos: ingresosPorHora,
                    gastos: gastosPorHora
                }
                break
            default:
                break
        }
    }
    return resultadoFiltro
}

//Sumar valores positivos de un array
const sumarIngresos = (ingresos) => {
    let total = 0
    ingresos.forEach(registro => {
        if (registro.monto > 0) {
            total += parseFloat(registro.monto)
        }
    })
    return total
}

//Sumar valores negativos de un array
const sumarGastos = (gastos) => {
    let total = 0
    gastos.forEach(registro => {
        if (registro.monto < 0) {
            total += parseFloat(registro.monto)
        }
    })
    return total
}

function estaEnMismoMes(fechaString) {
    // Obtener la fecha actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const añoActual = fechaActual.getFullYear();

    const [dia, mes, año] = fechaString.split(' ')[0].split('/').map(Number);

    // Comparar el mes y el año
    return mesActual === mes && añoActual === año;
}

const obtenerSueldo = (datos) => {
    let sueldo = 0
    datos.forEach((reg) => {
        if (reg.esSueldo() && estaEnMismoMes(reg.fecha)) {
            sueldo += reg.monto
        }
    })
    return sueldo
}

//Calcular el total de todos los valores ingresados
const balanceTotal = (datos) => sumarIngresos(datos) + sumarGastos(datos)

const cargarIngresosOGastos = (fecha, concepto, monto, iog, categoria) => {
    let dato = new Registro(fecha, concepto, monto, iog, categoria)
    datosIngresosyGastos.push(dato)
    localStorage.setItem("Montos", JSON.stringify(datosIngresosyGastos))
    actualizarDatosMostrados(datosIngresosyGastos)
}

function obtenerFechaActual() {
    let fechaActual = new Date()
    let dia = fechaActual.getDate().toString().padStart(2, '0') // Agrega un 0 si es necesario
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0') // Los meses empiezan en 0
    let año = fechaActual.getFullYear()

    let horas = fechaActual.getHours().toString().padStart(2, '0')
    let minutos = fechaActual.getMinutes().toString().padStart(2, '0')

    // Formato DD/MM/AAAA hh:mm
    return `${dia}/${mes}/${año} ${horas}:${minutos}`
}

function convertirAFecha(fechaStr) {
    // Dividir la fecha y la hora
    let [fecha, hora] = fechaStr.split(' ')

    // Dividir día, mes, año
    let [dia, mes, anio] = fecha.split('/')

    // Dividir hora y minutos
    let [horas, minutos] = hora.split(':')

    // Crear un objeto Date (meses empiezan en 0 en JavaScript, así que restamos 1 al mes)
    return new Date(anio, mes - 1, dia, horas, minutos)
}

document.addEventListener("DOMContentLoaded", () => {
    let validarDatos = localStorage.getItem("Montos")
    if (validarDatos) {
        JSON.parse(validarDatos).forEach(dato => {
            datosIngresosyGastos.push(new Registro(dato.fecha, dato.concepto, dato.monto, dato.iog, dato.categoria))
        })
        Registro.id = datosIngresosyGastos.slice(-1)[0].id
    }
    actualizarDatosMostrados(datosIngresosyGastos)
})





//Quitar ultimo monto cargado ###AUN NO SE USA
const quitarUltimoMontoCargado = (datosIngresosyGastos) => {
    datosIngresosyGastos.pop()
}

//Mostrar datos almacenados
const actualizarDatosMostrados = (datos) => {
    let tabla = document.getElementById("tabla-dashboard")
    if (datos.length > 0) {
        if (tabla.classList.contains("centrar-texto-tabla")) {
            tabla.classList.remove("centrar-texto-tabla")
        }
        tabla.innerHTML = `<caption class="caption-top">Ultimas 10 transacciones</caption>
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Concepto</th>
                            <th scope="col">Monto $</th>
                        </tr>
                    </thead>`
        let bodyTabla = document.createElement("tbody")
        let numerador = 1
        const ultimos10 = datos.slice(-10).reverse()
        ultimos10.forEach((dato) => {
            //ARREGLAR PARA QUE SEAN ULTIMAS 10 TRANSACCIONES
            let fila = document.createElement("tr")
            if (dato.monto > 0) {
                fila.classList.add("fila-positiva")
            } else {
                fila.classList.add("fila-negativa")
            }
            let mostratMonto = parseFloat(dato.monto).toFixed(2)
            fila.innerHTML = `<th scope="row">${numerador}</th>
                            <td>${dato.fecha}</td>
                            <td>${dato.concepto}</td>
                            <td>${mostratMonto}</td>
                            <td><button type="button" class="btn btn-outline-dark btn-eliminar-registro" id="${dato.id}"><span class="material-symbols-outlined">close</span></button></td>`
            bodyTabla.append(fila)
            numerador++
        })
        tabla.append(bodyTabla)
    } else {
        tabla.innerHTML = 'No se encontraron datos.'
        tabla.classList.add("centrar-texto-tabla")
    }
    let balance = document.getElementById("balance")
    balance.innerHTML = `$${balanceTotal(datos).toFixed(2)}`

    let fechasInicioFin = obtenerRangoMensual(obtenerFechaActual())
    let salario = obtenerSueldo(datos)
    let gastos = sumarGastos(filtrarPorRangoFechas(datos, fechasInicioFin.primerDia, fechasInicioFin.ultimoDia))
    crearGraficoSalario(salario, gastos)


    

    console.log(agruparRegistrosPorFecha("mensual", filtrarPorRangoFechas(datos, fechasInicioFin.primerDia, fechasInicioFin.ultimoDia)))
    crearGraficoPorFecha(agruparRegistrosPorFecha("mensual", filtrarPorRangoFechas(datos, fechasInicioFin.primerDia, fechasInicioFin.ultimoDia)))
    //Mostrar grafico diario, luego con botones llamar nuevamente a la funcion para mostrar otros

    // let fechaInicio = new Date()
    // fechaInicio.setHours(0, 0, 0)
    // let fechaFin = new Date()
    // fechaFin.setHours(23, 59, 59)
    // let fechaSieteDiasAntes = fechaSieteDiasAntes.setDate(fechaActual.getDate() - 7);
    //crearGraficoPorFecha(agruparRegistrosPorFecha("mensual", filtrarPorRangoFechas(datos, fechaInicio, fechaFin), fechaFin))

}

let graficoSalario
function crearGraficoSalario(salario, gastos) {
    if (graficoSalario) {
        graficoSalario.destroy()
    }
    graficoSalario = new Chart(
        document.getElementById('chartUsoSueldo'),
        {
            type: 'doughnut',
            data: {
                labels: [
                    'Sueldo disponible',
                    'Sueldo gastado'
                ],
                datasets: [{
                    data: [salario + gastos, gastos], // pasar cantidad de sueldo de un lado a otro
                    backgroundColor: [
                        'rgba(25, 135, 84, 0.8)',
                        'rgb(240, 240, 240, 0.3)'
                    ],
                    borderColor: [
                        'rgba(25, 135, 84)',
                        'rgb(230, 230, 230)'
                    ],
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,  // Asegura la responsividad
                maintainAspectRatio: false  // Permite cambiar el aspecto según el tamaño del contenedor
            }
        })
}

let graficoPorFecha
function crearGraficoPorFecha(datos) {
    if (graficoPorFecha) {
        graficoPorFecha.destroy()
    }
    // Crear el gráfico
    const ctx = document.getElementById('chartIngresosyGastos')
    graficoPorFecha = new Chart(ctx, {
        type: 'bar', // Gráfico de barras
        data: {
            labels: datos.etiquetas,
            datasets: [
                {
                    label: 'Ingresos',
                    data: datos.ingresos, // Datos de ingresos
                    backgroundColor: 'rgb(25, 135, 84, 0.2)', // Color para las barras de ingresos
                    borderColor: 'rgb(25, 135, 84, 0.8)',
                    borderWidth: 1.5
                },
                {
                    label: 'Gastos',
                    data: datos.gastos, // Datos de gastos
                    backgroundColor: 'rgb(255, 0, 0, 0.2)', // Color para las barras de gastos
                    borderColor: ' rgb(255, 0, 0, 0.8)',
                    borderWidth: 1.5
                }
            ]
        },
        options: {
            responsive: true, // Hace que la gráfica sea responsive
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true // La escala Y comienza desde 0
                }
            }
        }
    })
}

// //Calcular porcentaje gastado a partir de un valor de sueldo ###AUN NO SE USA
// const porcentajeGastadoDelSueldo = (sueldo, datos) => {
//     let gastos = sumarGastos(datos) * -1
//     let porcentaje = (gastos * 100) / sueldo
//     return porcentaje
// }

const collapse = Array.from(document.querySelectorAll('.collapse-carga-balance'))
const collapse_title = document.getElementById('collapse-title')
const collapse_body = Array.from(document.querySelectorAll('.collapse-body'))
const btnCargar = document.getElementById("btnCargar")
let estadoCollapse = collapse[0].classList.contains("show")
let btnCargaBalance = Array.from(document.querySelectorAll(".btn-carga-balance"))
let lastBtn = null


const toggleCategoria = (tipo) => {
    let contenedorCategoria = document.getElementById("contenedor-categoria")
    if (tipo == "gasto") {
        contenedorCategoria.classList.add("ocultar-elemento")
        document.getElementById("categoria").value = 0
    } else {
        contenedorCategoria.classList.remove("ocultar-elemento")
        document.getElementById("categoria").value = -1
    }
}

btnCargaBalance.forEach(btn => {
    btn.onclick = (e) => {
        estadoCollapse = collapse[0].classList.contains("show")
        if (estadoCollapse) {
            if (e.currentTarget.id == lastBtn) {
                //SI SE HACE CLICK EN EL MISMO BOTON SE OCULTA
                new bootstrap.Collapse(collapse[0])
                estadoCollapse = collapse[0].classList.contains("show")
            }
        } else {
            new bootstrap.Collapse(collapse[0])
            estadoCollapse = collapse[0].classList.contains("show")
        }
        //AL DAR CLICK EN UNO DE LOS BOTONES SE MUESTRA CON ESA OPCION
        toggleCategoria(e.currentTarget.id)
        collapse_title.innerHTML = e.currentTarget.id.toUpperCase()
        lastBtn = e.currentTarget.id
        btnCargar.name = e.currentTarget.id
    }
})

document.addEventListener("click", (event) => {
    //CERRAR COLLAPSE PARA INGRESO DE DATOS CUANDO SE HACE CLIC FUERA DE ÉL
    estadoCollapse = collapse[0].classList.contains("show")
    if (!collapse[0].contains(event.target) && !btnCargaBalance[0].contains(event.target) && !btnCargaBalance[1].contains(event.target) && estadoCollapse) {
        new bootstrap.Collapse(collapse[0])
        estadoCollapse = collapse[0].classList.contains("show")
    }
})

//INGRESAR NUEVOS DATOS
btnCargar.addEventListener("click", (e) => {
    let concepto = document.getElementById("concepto").value
    let monto = document.getElementById("monto").value
    let categoria = document.getElementById("categoria").value
    //FALTA VALIDAR SI TENGO MONTO SUFICIENTE PARA REALIZAR GASTO
    if (validarNoVacio(concepto) && validarNumerico(monto) && categoria != -1) {
        cargarIngresosOGastos(obtenerFechaActual(), concepto, parseFloat(monto), e.currentTarget.name, categoria)
        document.getElementById("concepto").value = ''
        document.getElementById("monto").value = ''
        document.getElementById("categoria").value = -1
    } else {
        //GENERAR CODIGO VALIDACION MOSTRANDO LOS DIVs invalid-feedback AGREGANDO LA CLASE mensaje-validacion
        //ERROR - Error campo Concepto
        //ERROR - Error no ingresar categoria
        //ERROR - Error monto no valido
        //ERROR - Gasto supera el balance actual
    }
})