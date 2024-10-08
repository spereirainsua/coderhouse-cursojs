//Cargar nuevos montos
const datosIngresosyGastos = []

//Validación de campos de datos
const validarNoVacio = (dato) => dato.trim() !== '';
const validarNumerico = (dato) => !isNaN(dato) && dato.trim() !== '';

class Registro {
    static id = 0
    constructor(fecha, concepto, monto, iog) {
        this.id = ++Registro.id
        this.fecha = fecha
        this.concepto = concepto
        if (iog == "gasto") {
            monto = monto * -1
        }
        this.monto = monto
    }
    // enPesos = () => {
    //     return this.precio * precioDolar
    // }
}

//Sumar valores positivos de un array
const sumarIngresos = (ingresos) => {
    let total = 0
    ingresos.forEach(registro => {
        if (registro.monto > 0) {
            total += parseFloat(registro.monto)
        }
        // console.log(registro.monto)
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

//Calcular el total de todos los valores ingresados
const balanceTotal = (datos) => sumarIngresos(datos) + sumarGastos(datos)

const cargarIngresosOGastos = (fecha, concepto, monto, iog) => {
    let dato = new Registro(fecha, concepto, monto, iog)
    datosIngresosyGastos.push(dato)
    localStorage.setItem("Montos", JSON.stringify(datosIngresosyGastos))
    actualizarDatosMostrados(datosIngresosyGastos)
}

function obtenerFechaActual() {
    let fechaActual = new Date();
    let dia = fechaActual.getDate().toString().padStart(2, '0'); // Agrega un 0 si es necesario
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
    let año = fechaActual.getFullYear();

    let horas = fechaActual.getHours().toString().padStart(2, '0');
    let minutos = fechaActual.getMinutes().toString().padStart(2, '0');

    // Formato DD/MM/AAAA hh:mm
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
}

document.addEventListener("DOMContentLoaded", () => {
    let validarDatos = localStorage.getItem("Montos")
    if (validarDatos) {
        JSON.parse(validarDatos).forEach(dato => {
            datosIngresosyGastos.push(dato)
        })
        Registro.id = datosIngresosyGastos.slice(-1)[0].id
    }
    actualizarDatosMostrados(datosIngresosyGastos)
})





//Quitar ultimo monto cargado ###AUN NO SE USA
const quitarUltimoMontoCargado = (datosIngresosyGastos) => {
    datosIngresosyGastos.pop()
}

function decimalAdjust(type, value, exp) {
    // Si el exp no está definido o es cero...
    if (typeof exp === "undefined" || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split("e");
    value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

// Decimal round
if (!Math.round10) {
    Math.round10 = function (value, exp) {
        return decimalAdjust("round", value, exp);
    };
}

//Mostrar datos almacenados
const actualizarDatosMostrados = (datos) => {
    let tabla = document.getElementById("tabla-dashboard")
    if (datos.length > 0) {
        if (tabla.classList.contains("centrar-texto-tabla")) {
            tabla.classList.remove("centrar-texto-tabla")
        }
        tabla.innerHTML = `<thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Concepto</th>
                            <th scope="col">Monto $</th>
                        </tr>
                    </thead>`
        let bodyTabla = document.createElement("tbody")
        let numerador = 1
        datos.forEach((dato) => {
            // console.log(dato)
            let fila = document.createElement("tr")
            if (dato.monto > 0) {
                fila.classList.add("fila-positiva")
            } else {
                fila.classList.add("fila-negativa")
            }
            fila.innerHTML = `<th scope="row">${numerador}</th>
                            <td>${dato.fecha}</td>
                            <td>${dato.concepto}</td>
                            <td>${dato.monto}</td>
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
    balance.innerHTML = `$${Math.round10(balanceTotal(datos), -2)}`
}

//Calcular porcentaje gastado a partir de un valor de sueldo ###AUN NO SE USA
const porcentajeGastadoDelSueldo = (sueldo, datos) => {
    let gastos = sumarGastos(datos) * -1
    let porcentaje = (gastos * 100) / sueldo
    return porcentaje
}

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

//INGRESAR NUEVOS DATOS
btnCargar.addEventListener("click", (e) => {
    let concepto = document.getElementById("concepto").value
    let monto = document.getElementById("monto").value
    if (validarNoVacio(concepto) && validarNumerico(monto)) {
        cargarIngresosOGastos(obtenerFechaActual(), concepto, monto, e.currentTarget.name)
        document.getElementById("concepto").value = ''
        document.getElementById("monto").value = ''
    } else {
        //GENERAR CODIGO VALIDACION MOSTRANDO LOS DIVs invalid-feedback AGREGANDO LA CLASE mensaje-validacion
    }
})
