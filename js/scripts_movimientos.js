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
    obtenerMes = () => {
        return this.fecha.getMonth()
    }
    obtenerSemana = () => {
        let dia = this.fecha.getDate() // Extraer el día de la fecha
        return Math.ceil(dia / 7) // Dividir por 7 para obtener la semana
    }
    obtenerDia = () => {
        return this.fecha.getDate() // Extraer el día de la fecha
    }
    obtenerHora = () => {
        let horas = {
            hora: this.fecha.getHours(),
            minutos: this.fecha.getMinutes(),
            segundos: this.fecha.getSeconds()
        }
        return horas
    }
}

function convertirARegistros(datos) {
    return datos.map(dato => {
        const registro = new Registro(
            convertirAFecha(dato.fecha),
            dato.concepto,
            dato.monto,
            dato.iog,
            dato.categoria
        )
        registro.id = dato.id

        if (Registro.id < dato.id) {
            Registro.id = dato.id;
        }
        return registro
    })
}

async function datosDesdeJSON() {
    try {
        const response = await fetch("../db/data.JSON")
        if (!response.ok) {
            throw new Error("Error al cargar los datos")
        }
        return await response.json()
    } catch (error) {
        console.error("Error al cargar los datos:", error)
        return []
    }
}

const cantidadFilas = 12
localStorage.removeItem("filtroMovimientos")

const filtrarRegistros = (registros) => {
    let filtro = localStorage.getItem("filtroMovimientos")
    const registrosFiltrados = registros.filter(registro => { 
        if (filtro === "ingreso") {
            return registro.monto > 0
        } else if (filtro === "gasto") {
            return registro.monto < 0
        } else {
            return registro
        }
    })
    return registrosFiltrados
}

const filtrarPorRangoFechas = (datos, fechaInicio, fechaFin) => {
    return datos.filter((registro) => registro.fecha >= fechaInicio && registro.fecha <= fechaFin)
}

const actualizarDatosMostrados = (registros, paginaActual, cantidadFilas) => {
    
    const datos = filtrarRegistros(registros)

    let tabla = document.getElementById("tabla-movimientos")
    if (datos.length > 0) {
        if (tabla.classList.contains("centrar-texto-tabla")) {
            tabla.classList.remove("centrar-texto-tabla")
        }
        tabla.innerHTML = `<caption class="caption-top">Movimientos realizados</caption>
                        <thead>
                        <tr>
                            <th scope="col" class="col-1">#</th>
                            <th scope="col" class="col-2">Fecha</th>
                            <th scope="col" class="col-6">Concepto</th>
                            <th scope="col" class="col-2">Monto $</th>
                            <th scope="col class="col-1">Eliminar?</th>
                        </tr>
                    </thead>`
        let bodyTabla = document.createElement("tbody")
        let numerador = 1 + ((paginaActual - 1) * cantidadFilas)

        const datosMostrados = datos.slice((-1 * cantidadFilas) * paginaActual, datos.length - ((paginaActual - 1) * cantidadFilas)).reverse()
        // console.log(datosMostrados)
        datosMostrados.forEach((dato) => {
            let fila = document.createElement("tr")
            if (dato.monto > 0) {
                fila.classList.add("fila-positiva")
            } else {
                fila.classList.add("fila-negativa")
            }
            let mostrarMonto = parseFloat(dato.monto).toFixed(2)
            fila.innerHTML = `<th scope="row">${numerador}</th>
                            <td>${convertirFechaAStr(dato.fecha)}</td>
                            <td>${dato.concepto}</td>
                            <td>${mostrarMonto}</td>
                            <td><button type="button" class="btn btn-outline-dark btn-eliminar-registro" id="${dato.id}"><span class="material-symbols-outlined">close</span></button></td>`
            bodyTabla.append(fila)
            numerador++
        })
        tabla.append(bodyTabla)
    } else {
        tabla.innerHTML = 'No se encontraron datos.'
        tabla.classList.add("centrar-texto-tabla")
    }

    let cantidadPaginas = Math.ceil(datos.length / cantidadFilas)
    let contenedorPaginacion = document.getElementById('paginas')
    generarPaginas(cantidadPaginas, contenedorPaginacion, paginaActual)

    let btnEliminarRegistro = Array.from(document.getElementsByClassName('btn-eliminar-registro'))
    btnEliminarRegistro.forEach(btn => {
        btn.addEventListener("click", (e) => {
            eliminarUnRegistro(parseInt(e.currentTarget.id), datosIngresosyGastos, paginaActual)
        })
    })
}

function cargarDatos() {
    return new Promise((resolve, reject) => {
        const datosGuardados = JSON.parse(localStorage.getItem("Montos"))
        if (datosGuardados) {
            const registros = convertirARegistros(datosGuardados)
            actualizarDatosMostrados(registros, 1, cantidadFilas)
            resolve(registros)
        } else {
            datosDesdeJSON()
                .then(data => {
                    const registros = convertirARegistros(data)
                    let datosParaAlmacenar = registros.map(registro => {
                        let copiaRegistro = { ...registro }
                        copiaRegistro.fecha = convertirFechaAStr(copiaRegistro.fecha)
                        return copiaRegistro
                    })
                    localStorage.setItem("Montos", JSON.stringify(datosParaAlmacenar))
                    actualizarDatosMostrados(registros, 1, cantidadFilas)
                    resolve(registros)
                })
                .catch(error => reject(error))
        }
    })
}

function eliminarUnRegistro(id, datos, pagina) {
    const registro = datos.find(registro => registro.id === id)
    Swal.fire({
        title: "Seguro deseas eliminar este registro?",
        text: "No sera posible revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            let indice = datos.indexOf(registro)
            datos.splice(indice, 1)
            const datosParaAlmacenar = datos.map(registro => {
                let copiaRegistro = { ...registro }
                copiaRegistro.fecha = convertirFechaAStr(copiaRegistro.fecha)
                return copiaRegistro
            })
            localStorage.setItem("Montos", JSON.stringify(datosParaAlmacenar))
            actualizarDatosMostrados(datos, pagina, cantidadFilas)

            Swal.fire({
                title: "Eliminado!",
                text: "Tu registro se ha eliminado correctamente.",
                icon: "success"
            })
        }
    })
}

// function validarDatos(almacenamientoLocal) {
//     const datos = JSON.parse(almacenamientoLocal) || []
//     const registros = datos.map(dato => {
//         const registro = new Registro(
//             convertirAFecha(dato.fecha),
//             dato.concepto,
//             dato.monto,
//             dato.iog,
//             dato.categoria
//         )
//         registro.id = dato.id
//         if (Registro.id < dato.id) {
//             Registro.id = dato.id
//         }
//         return registro
//     })
//     return registros
// }

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

function convertirFechaAStr(fechaDate) {
    let dia = fechaDate.getDate().toString().padStart(2, '0') // Agrega un 0 si es necesario
    let mes = (fechaDate.getMonth() + 1).toString().padStart(2, '0') // Los meses empiezan en 0
    let año = fechaDate.getFullYear()

    let horas = fechaDate.getHours().toString().padStart(2, '0')
    let minutos = fechaDate.getMinutes().toString().padStart(2, '0')

    // Formato DD/MM/AAAA hh:mm
    return `${dia}/${mes}/${año} ${horas}:${minutos}`
}

function generarPaginas(cantidad, contenedor, paginaActual) {
    contenedor.innerHTML = ''

    let primerPagina = document.createElement('li')
    primerPagina.classList.add('page-item')
    primerPagina.innerHTML = '<a class="page-link cambiar-de-pagina" href="#" aria-label="Primera" id="1"><span aria-hidden="true">&laquo;</span></a>'
    contenedor.appendChild(primerPagina)

    let paginaAnterior = document.createElement('li')
    paginaAnterior.classList.add('page-item')
    paginaAnterior.innerHTML = '<a class="page-link cambiar-de-pagina" href="#" id="-1">Anterior</a>'
    contenedor.appendChild(paginaAnterior)
    const maxPaginasVisibles = 5
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2))
    let fin = Math.min(cantidad, inicio + maxPaginasVisibles - 1)

    if (fin - inicio + 1 < maxPaginasVisibles) {
        inicio = Math.max(1, fin - maxPaginasVisibles + 1)
    }

    let indice = inicio
    while (indice <= fin) {
        let pagina = document.createElement('li')
        pagina.classList.add('page-item')
        if (indice == paginaActual) {
            pagina.classList.add('active')
        }
        pagina.innerHTML = `<a class="page-link cambiar-de-pagina" href="#" id="${indice}">${indice}</a>`
        contenedor.appendChild(pagina)
        indice++
    }

    let paginaSiguiente = document.createElement('li')
    paginaSiguiente.classList.add('page-item')
    paginaSiguiente.innerHTML = '<a class="page-link cambiar-de-pagina" href="#" id="0">Siguiente</a>'
    contenedor.appendChild(paginaSiguiente)

    let ultimaPagina = document.createElement('li')
    ultimaPagina.classList.add('page-item')
    ultimaPagina.innerHTML = `<a class="page-link cambiar-de-pagina" href="#" aria-label="Primera" id="${cantidad}"><span aria-hidden="true">&raquo;</span></a>`
    contenedor.appendChild(ultimaPagina)

    let linkPaginas = Array.from(document.getElementsByClassName('cambiar-de-pagina'))
    linkPaginas.forEach(link => {
        link.addEventListener("click", (e) => {
            switch (parseInt(e.currentTarget.id)) {
                case -1:
                    if (paginaActual > 1) {
                        paginaActual--
                    }
                    break;
                case 0:
                    if (paginaActual < cantidad) {
                        paginaActual++
                    }
                    break;
                default:
                    paginaActual = e.currentTarget.id
                    break;
            }
            actualizarDatosMostrados(datosIngresosyGastos, paginaActual, cantidadFilas)
            // linkPaginas = Array.from(document.getElementsByClassName('page-link'))
        })
    })
}

let filtroIOG = Array.from(document.getElementsByClassName('filtro-iog'))
filtroIOG.forEach(btn => {
    btn.addEventListener("click", (e) => {
        Array.from(btn.parentElement.parentElement.children).forEach(contenedor => contenedor.classList.remove("active"))
        btn.parentElement.classList.add("active")
        switch (e.currentTarget.id) {
            case "filtroIngresos":
                localStorage.setItem("filtroMovimientos", "ingreso")
                actualizarDatosMostrados(datosIngresosyGastos, 1, cantidadFilas)
                break;
            case "filtroGastos":
                localStorage.setItem("filtroMovimientos", "gasto")
                actualizarDatosMostrados(datosIngresosyGastos, 1, cantidadFilas)
                break;
            default:
                localStorage.removeItem("filtroMovimientos")
                actualizarDatosMostrados(datosIngresosyGastos, 1, cantidadFilas)
                break;
        }
    })
})

let paginaActual = 1

const datosIngresosyGastos = []
cargarDatos().then(result => {
    result.forEach(dato => datosIngresosyGastos.push(dato))
})