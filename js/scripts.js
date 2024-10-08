
//TEST DE FUNCIONES
// const testDeFunciones = () => {
//     solicitarValores()
//     let continuar = true
//     while (continuar) {
//         let menu = parseInt(prompt("Menu para testear las funciones\nSeleccione la opción deseada: \n   1- mostrarDatos()\n   2- cargarIngresosOGastos()\n   3- sumarIngresos()\n   4- sumarGastos()\n   5- porcentajeGastadoDelSueldo()\n   6- balanceTotal()\n   0- Salir"))
//         switch (menu) {
//             case 1:
//                 mostrarDatos(datosIngresosyGastos)
//                 break
//             case 2:
//                 cargarIngresosOGastos(datosIngresosyGastos)
//                 break
//             case 3:
//                 console.log("Ingresos registrados: " + sumarIngresos(datosIngresosyGastos))
//                 break
//             case 4:
//                 console.log("Gastos registrados: " + sumarGastos(datosIngresosyGastos))
//                 break
//             case 5:
//                 console.log("Gastaste " + Math.round(porcentajeGastadoDelSueldo(30000, datosIngresosyGastos)) + "% de tu sueldo.")
//             case 6:
//                 console.log("El balance de tu cuenta es: " + balanceTotal(datosIngresosyGastos))
//             case 0:
//                 break
//             default:
//                 alert("Opción incorrecta")
//                 break
//         }
//         if (menu == 0) {
//             let confirmacion = prompt("¿Seguro desea salir? (si/no)").toLowerCase()
//             if (confirmacion == "si") {
//                 continuar = false
//             }
//         }
//     }
// }

//Cargar nuevos montos
const datosIngresosyGastos = []

document.addEventListener("DOMContentLoaded", () => {
    let validarDatos = localStorage.getItem("Montos")
    if (validarDatos) {
        JSON.parse(validarDatos).forEach(dato => {
            datosIngresosyGastos.push(dato)
        })
        Registro.id = datosIngresosyGastos.slice(-1)[0].id
    }
    mostrarDatosEnDashboard(datosIngresosyGastos)
})

class Registro {
    static id = 0
    constructor(concepto, monto, iog) {
        this.id = ++Registro.id
        this.concepto = concepto
        if (iog == "gasto") {
            this.monto = monto * -1
        } else {
            this.monto = monto
        }
    }
    // enPesos = () => {
    //     return this.precio * precioDolar
    // }
}

const cargarIngresosOGastos = (concepto, monto, iog) => {
    let dato = new Registro(concepto, monto, iog)
    datosIngresosyGastos.push(dato)
    localStorage.setItem("Montos", JSON.stringify(datosIngresosyGastos))
    mostrarDatosEnDashboard(datosIngresosyGastos)
}

//Quitar ultimo monto cargado
const quitarUltimoMontoCargado = (datosIngresosyGastos) => {
    datosIngresosyGastos.pop()
}

//Mostrar datos almacenados
const mostrarDatosEnDashboard = (datos) => {
    let tabla = document.getElementById("tabla-dashboard")
    if (datos.length > 0) {
        if (tabla.classList.contains("centrar-texto-tabla")) {
            tabla.classList.remove("centrar-texto-tabla")
        }
        tabla.innerHTML = `<thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Concepto</th>
                            <th scope="col">Monto $</th>
                        </tr>
                    </thead>`
        let bodyTabla = document.createElement("tbody")
        datos.forEach((dato) => {
            console.log(dato)
            let fila = document.createElement("tr")
            fila.innerHTML = `<th scope="row">${dato.id}</th>
                            <td>${dato.concepto}</td>
                            <td>${dato.monto}</td>`
            console.log(fila)
            bodyTabla.append(fila)
        })
        tabla.append(bodyTabla)
    } else {
        tabla.innerHTML = 'No se encontraron datos.'
        tabla.classList.add("centrar-texto-tabla")
    }
}

//Sumar valores positivos de un array
const sumarIngresos = (ingresos) => {
    let total = 0
    for (let valor of ingresos) {
        if (valor > 0) {
            total += valor
        }
    }
    return total
}

//Sumar valores negativos de un array
const sumarGastos = (gastos) => {
    let total = 0
    for (let valor of gastos) {
        if (valor < 0) {
            total += valor
        }
    }
    return total
}

//Calcular porcentaje gastado a partir de un valor de sueldo
const porcentajeGastadoDelSueldo = (sueldo, datos) => {
    let gastos = sumarGastos(datos) * -1
    let porcentaje = (gastos * 100) / sueldo
    return porcentaje
}

//Calcular el total de todos los valores ingresados
const balanceTotal = (datos) => sumarIngresos(datos) + sumarGastos(datos)



//Llamada a la función de test
// testDeFunciones()




const collapse = Array.from(document.querySelectorAll('.collapse-carga-balance'))
const collapse_title = document.getElementById('collapse-title')
const collapse_body = Array.from(document.querySelectorAll('.collapse-body'))
const btnCargar = document.getElementById("btnCargar")
let estadoCollapse = collapse[0].classList.contains("show")
let btnCargaBalance = Array.from(document.querySelectorAll(".btn-carga-balance"))
let lastBtn = null

btnCargaBalance.forEach(btn => {
    btn.onclick = (e) => {
        estadoCollapse = collapse[0].classList.contains("show")
        if (estadoCollapse) {
            if (e.currentTarget.id == lastBtn) {
                //SI SE HACE CLICK EN EL MISMO BOTON SE OCULTA
                new bootstrap.Collapse(collapse[0])
                estadoCollapse = collapse[0].classList.contains("show")
            } else {
                //SI SE HACE CLICK MIENTRAS ESTA ABIERTO LA OPCION OPUESTA SE CAMBIA SIN OCULTAR
                collapse_title.innerHTML = e.currentTarget.id.toUpperCase()
                lastBtn = e.currentTarget.id
                btnCargar.name = e.currentTarget.id
            }
        } else {
            //AL DAR CLICK EN UNO DE LOS BOTONES SE MUESTRA CON ESA OPCION
            new bootstrap.Collapse(collapse[0])
            estadoCollapse = collapse[0].classList.contains("show")
            collapse_title.innerHTML = e.currentTarget.id.toUpperCase()
            lastBtn = e.currentTarget.id
            btnCargar.name = e.currentTarget.id
        }
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

const validarNoVacio = (dato) => dato.trim() !== '';
const validarNumerico = (dato) => !isNaN(dato) && dato.trim() !== '';

//INGRESAR NUEVOS DATOS
btnCargar.addEventListener("click", (e) => {
    let concepto = document.getElementById("concepto").value
    let monto = document.getElementById("monto").value
    if (validarNoVacio(concepto) && validarNumerico(monto)) {
        cargarIngresosOGastos(concepto, monto, e.currentTarget.name)
        document.getElementById("concepto").value = ''
        document.getElementById("monto").value = ''
    } else {
        //GENERAR CODIGO VALIDACION MOSTRANDO LOS DIVs invalid-feedback AGREGANDO LA CLASE mensaje-validacion
    }
})
