import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useNavbar() {
  const route = useRoute()
  const router = useRouter()

  // Estado reactivo
  const drawer = ref(false)
  const searchTerm = ref('')
  const notificaciones = ref([
    {
      titulo: "📢 Oferta especial en Estuche con 50 cuchillas SKA",
      mensaje: "Precio público: $125 | Precio Mayoreo: $90.52. ¡Aprovecha la promoción esta semana!",
      fecha: "01/03",
    },
    {
      titulo: "🔄 Reposición de stock: Martillo de uña",
      mensaje: "Clave: H-UÑA-16 | Código: 100102. ¡Ya está disponible nuevamente en tienda!",
      fecha: "02/03",
    },
    {
      titulo: "⚡ Descuento en Destornilladores de punta plana",
      mensaje: "Clave: DST-PLANA-6 | Código: 100103. Obtén un 15% de descuento en tu compra.",
      fecha: "03/03",
    },
    {
      titulo: "🚀 Últimas piezas disponibles: Llave ajustable 10”",
      mensaje: "Clave: LLAVE-AJ-10 | Código: 100104. ¡Solo quedan 5 unidades en stock!",
      fecha: "04/03",
    },
    {
      titulo: "🛠️ Nueva herramienta en catálogo: Serrucho profesional",
      mensaje: "Clave: SERR-PRO-12 | Código: 100105. ¡Ya disponible en nuestra tienda!",
      fecha: "05/03",
    },
    {
      titulo: "🎯 Promoción en taladros industriales",
      mensaje: "Clave: TAL-IND-20 | Código: 100106. ¡Descuento del 20% esta semana!",
      fecha: "06/03",
    },
  ])

  // Datos del cliente desde localStorage
  const clientName = ref(localStorage.getItem("clientName") || "Sin nombre")
  const clientRole = ref(localStorage.getItem("clientRole") || "Cliente")
  const clientId = ref(localStorage.getItem("clientId") || "")
  const clientEmail = ref(localStorage.getItem("clientEmail") || "")
  const clientPhone = ref(localStorage.getItem("clientPhone") || "")
  const clientAddress = ref(localStorage.getItem("clientAddress") || "")

  // Computed
  const isMobile = computed(() => window.innerWidth <= 960)
  const avatarSize = computed(() => isMobile.value ? 35 : 45)

  const clientFullName = computed(() =>
    clientName.value
      .split(" ")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ")
  )

  const clientFormattedRole = computed(() =>
    clientRole.value
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  )

  // Menú dinámico según el rol
  const menuItems = computed(() => {
    switch (clientRole.value) {
      case "admin":
        return [
          { text: "Inicio", icon: "mdi-home-outline", route: "/admin/Index_Admin" },
          { text: "Usuarios", icon: "mdi-account-outline", route: "/admin/Users_Admin" },
          { text: "Productos", icon: "mdi-shopping-outline", route: "/admin/Orders_Admin" },
          { text: "Catálogos", icon: "mdi-book-open-outline", route: "/admin/UploadFiles_Admin" },
          { text: "Salir", icon: "mdi-logout", route: "/logout" },
        ]
      case "preventista":
        return [
          { text: "Inicio", icon: "mdi-home-outline", route: "/preventive/Shopping_Pre" },
          { text: "Notificaciones", icon: "mdi-bell-outline", route: "/preventive/Notifications_Pre" },
          { text: "Ver Pedidos", icon: "mdi-shopping-outline", route: "/preventive/Orders_Pre" },
          { text: "Historial", icon: "mdi-clipboard-text-clock-outline", route: "/preventive/History_Pre" },
          { text: "Catálogo", icon: "mdi-book-open-outline", route: "/preventive/Catalog_Pre" },
          { text: "Ofertas", icon: "mdi-tag-outline", route: "/preventive/Offers_Pre" },
          { text: "Salir", icon: "mdi-logout", route: "/logout" },
        ]
      case "cliente":
      default:
        return [
          { text: "Inicio", icon: "mdi-home-outline", route: "/client/Home_Cli" },
          { text: "Notificaciones", icon: "mdi-bell-outline", route: "/client/Notifications_Cli" },
          { text: "Ver Pedidos", icon: "mdi-shopping-outline", route: "/client/Orders_Cli" },
          { text: "Historial", icon: "mdi-clipboard-text-clock-outline", route: "/client/History_Cli" },
          { text: "Catálogo", icon: "mdi-book-open-outline", route: "/client/Catalog_Cli" },
          { text: "Ofertas", icon: "mdi-tag-outline", route: "/client/Ofertas_Cli" },
          { text: "Salir", icon: "mdi-logout", route: "/logout" },
        ]
    }
  })

  const currentTitle = computed(() => {
    const path = route.path
    const match = menuItems.value.find(item => path.startsWith(item.route))
    return match ? match.text : "Inicio"
  })

  // Métodos
  function searchProducts() {
    const path = "/client/Home_Cli"
    if (searchTerm.value.trim() !== "") {
      router.replace({ path, query: { term: searchTerm.value.trim() } })
    } else {
      router.replace({ path })
    }
  }

  return {
    isMobile,
    clientFullName,
    clientFormattedRole,
    avatarSize,
    menuItems,
    notificaciones,
    currentTitle,
    searchTerm,
    searchProducts,
    drawer,
    clientRole,
    clientId,
    clientEmail,
    clientPhone,
    clientAddress,
  }
}