import { ref, computed, onMounted, nextTick } from 'vue'
import { usePage } from '@inertiajs/vue3'
import api from '../../plugins/api'

const page = usePage()
const dialog = ref(false)
const mostrarPedidos = ref(false)
const marcas = ref([
  "Todo", "Truper", "Expert", "Hermex", "Fiero", "Foset", "Klintek", "Pretul", "Ultracraft", "Volteck"
])
const productos = ref<any[]>([])
const carrito = ref<any[]>([])
const marcaSeleccionada = ref("Todo")

// Paginación productos
const paginaActual = ref(1)
const totalPaginas = ref(1)
// Paginación carrito
const paginaCarrito = ref(1)
const itemsPorPaginaCarrito = ref(10)

const isMobile = computed(() => window.innerWidth <= 600)
const totalCarrito = computed(() =>
  carrito.value.reduce((acc, item) => acc + (item.precio_publico_con_IVA || 0) * item.cantidad, 0)
)
const totalPaginasCarrito = computed(() =>
  Math.ceil(carrito.value.length / itemsPorPaginaCarrito.value)
)
const inicioCarrito = computed(() =>
  (paginaCarrito.value - 1) * itemsPorPaginaCarrito.value
)
const carritoPaginado = computed(() =>
  carrito.value.slice(inicioCarrito.value, inicioCarrito.value + itemsPorPaginaCarrito.value)
)

function filtrarMarca(marca: string) {
  marcaSeleccionada.value = marca
  paginaActual.value = 1

  // Forzar recarga manual si es necesario, sin vue-router
  if (marca === "Todo") {
    obtenerProductos()
  } else {
    obtenerProductosBusqueda(marca)
  }

  nextTick(() => {
    const scroll = document.querySelector('.productos-scroll') as HTMLElement
    if (scroll) scroll.scrollTop = 0
  })
}

function toggleDetalles(index: number) {
  productos.value[index].mostrarDetalles = !productos.value[index].mostrarDetalles
}

function agregarACarrito(producto: any) {
  const idx = carrito.value.findIndex((p) => p.clave === producto.clave)
  if (idx !== -1) {
    carrito.value[idx].cantidad++
    const item = carrito.value.splice(idx, 1)[0]
    carrito.value.unshift(item)
  } else {
    carrito.value.unshift({ ...producto, cantidad: 1 })
  }
  mostrarPedidos.value = true
}

function modificarCantidad(index: number, cantidad: number) {
  carrito.value[index].cantidad += cantidad
  if (carrito.value[index].cantidad <= 0) {
    carrito.value.splice(index, 1)
  }
  if (carrito.value.length === 0) {
    mostrarPedidos.value = false
  }
  if (inicioCarrito.value >= carrito.value.length && paginaCarrito.value > 1) {
    paginaCarrito.value--
  }
}

async function obtenerProductos() {
  try {
    const res = await api.getProductos({ page: paginaActual.value, limit: 50 })
    productos.value = res.data.data.map((p: any) => ({ ...p, mostrarDetalles: false }))
    const limit = res.data.per_page || 50
    totalPaginas.value = Math.ceil(res.data.total / limit)
    nextTick(() => {
      const scroll = document.querySelector('.productos-scroll') as HTMLElement
      if (scroll) scroll.scrollTop = 0
    })
  } catch (error) {
    console.error("Error al obtener productos:", error)
  }
}

async function obtenerProductosBusqueda(term: string) {
  try {
    const res = await api.searchProductos(term, { page: paginaActual.value, limit: 50 })
    productos.value = res.data.data.map((p: any) => ({ ...p, mostrarDetalles: false }))
    const limit = res.data.per_page || 50
    totalPaginas.value = Math.ceil(res.data.total / limit)
    nextTick(() => {
      const scroll = document.querySelector('.productos-scroll') as HTMLElement
      if (scroll) scroll.scrollTop = 0
    })
  } catch (error) {
    console.error("Error al obtener productos por búsqueda:", error)
  }
}

function cambiarPagina(pagina: number) {
  if (pagina < 1 || pagina > totalPaginas.value) return
  paginaActual.value = pagina
  const term = (page.props.value as Record<string, any>)?.term as string || ''
  if (term && term.trim() !== "") {
    obtenerProductosBusqueda(term.trim())
  } else if (marcaSeleccionada.value === "Todo") {
    obtenerProductos()
  } else {
    obtenerProductosBusqueda(marcaSeleccionada.value)
  }
}

function cambiarPaginaCarrito(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginasCarrito.value) {
    paginaCarrito.value = pagina
  }
}

async function encargarPedido() {
  if (carrito.value.length === 0) return
  const userId = localStorage.getItem("userId")
  if (!userId) {
    console.error("El usuario debe iniciar sesión")
    return
  }
  const direccion = localStorage.getItem("direccion") || "Dirección no definida"
  const metodo_de_pago = "efectivo"

  try {
    const userResponse = await api.getUserById(userId)
    const id_localidad = userResponse.data.id_localidad

    const localidadResponse = await api.getLocalidadById(id_localidad)
    const id_ruta = localidadResponse.data.id_ruta
    const rutaResponse = await api.getRutaById(id_ruta)
    const dia_entrega_raw = rutaResponse.data.dia_entrega

    const stripAccents = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const diasSemana = [
      "domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"
    ]
    const hoy = new Date()
    const hoyDia = hoy.getDay()
    const entregaDia = diasSemana.indexOf(stripAccents(dia_entrega_raw).toLowerCase())
    const diasHastaEntrega = (entregaDia - hoyDia + 7) % 7 || 7
    const fechaTentativa = new Date(hoy)
    fechaTentativa.setDate(hoy.getDate() + diasHastaEntrega)
    const horasDeMargen = (fechaTentativa.getTime() - hoy.getTime()) / (1000 * 60 * 60)
    if (horasDeMargen < 48) {
      fechaTentativa.setDate(fechaTentativa.getDate() + 7)
    }
    const fecha_entrega_estimada = new Date(
      fechaTentativa.getFullYear(),
      fechaTentativa.getMonth(),
      fechaTentativa.getDate()
    ).toISOString().slice(0, 10)

    const newOrder = {
      estado: "enviado",
      total: totalCarrito.value,
      metodo_de_pago,
      fecha_entrega_estimada,
      direccion,
      id_usuario: userId,
    }
    const createOrderResponse = await api.createOrder(newOrder)
    const orderId = createOrderResponse.data.id

    for (const item of carrito.value) {
      await api.addProductToOrder({
        id_pedido: orderId,
        id_producto: item.id_producto,
        cantidad: item.cantidad,
      })
    }

    carrito.value = []
    mostrarPedidos.value = false
  } catch (error) {
    console.error("Error al enviar el pedido:", error)
  }
}

export default function useHomeCli() {
  onMounted(() => {
    const term = (page.props.value as any)?.term as string || ''
    if (term && term.trim() !== "") {
      obtenerProductosBusqueda(term.trim())
    } else {
      obtenerProductos()
    }
  })

  function handleImageError(event: Event) {
    // Establecer una imagen por defecto cuando falla la carga
    const imgElement = event.target as HTMLImageElement
    imgElement.src = '/img/no-image.jpg' // Asegúrate de tener una imagen por defecto
  }

  return {
    handleImageError,
    dialog,
    mostrarPedidos,
    marcas,
    productos,
    carrito,
    marcaSeleccionada,
    paginaActual,
    totalPaginas,
    paginaCarrito,
    totalPaginasCarrito,
    carritoPaginado,
    isMobile,
    inicioCarrito,
    totalCarrito,
    filtrarMarca,
    toggleDetalles,
    agregarACarrito,
    modificarCantidad,
    obtenerProductos,
    obtenerProductosBusqueda,
    cambiarPagina,
    cambiarPaginaCarrito,
    encargarPedido
  }
}
