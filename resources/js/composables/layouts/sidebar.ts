import { ref, computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

export default function useSidebar() {
  const page = usePage()
  const currentPath = computed(() => page.url)

  const role = ref(localStorage.getItem('clientRole') || 'cliente')
  const selectedItem = ref(null)
  const isCollapsed = ref(false)
  const isLargeScreen = computed(() => window.innerWidth >= 1280)

  const menuItems = computed(() => {
    switch (role.value) {
      case 'admin':
        return [
          { text: 'Inicio', icon: 'mdi-home', route: '/admin/Index_Admin' },
          { text: 'Productos', icon: 'mdi-shopping', route: '/admin/Orders_Admin' },
          { text: 'Usuarios', icon: 'mdi-account', route: '/admin/Users_Admin' },
          { text: 'Catálogos', icon: 'mdi-book-open', route: '/admin/UploadFiles_Admin' },
        ]
      case 'cliente':
        return [
          { text: 'Inicio', icon: 'mdi-home', route: '/client/Home_Cli' },
          { text: 'Ver Pedidos', icon: 'mdi-shopping', route: '/client/Orders_Cli' },
          { text: 'Historial', icon: 'mdi-clipboard-text-clock', route: '/client/History_Cli' },
          { text: 'Catálogo', icon: 'mdi-book-open', route: '/client/Catalog_Cli' },
          { text: 'Ofertas', icon: 'mdi-tag-outline', route: '/client/Ofertas_Cli' },
        ]
      case 'preventista':
        return [
          { text: 'Inicio', icon: 'mdi-home', route: '/preventive/Shopping_Pre' },
          { text: 'Ver Pedidos', icon: 'mdi-shopping', route: '/preventive/Orders_Pre' },
          { text: 'Historial', icon: 'mdi-clipboard-text-clock', route: '/preventive/History_Pre' },
          { text: 'Catálogo', icon: 'mdi-book-open', route: '/preventive/Catalog_Pre' },
          { text: 'Ofertas', icon: 'mdi-tag', route: '/preventive/Offers_Pre' },
        ]
      default:
        return []
    }
  })

  const isSelected = (route: string | undefined): boolean => {
    if (!route) return false
    return currentPath.value?.startsWith(route)
  }

  const toggleMenu = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/'
  }

  return {
    isLargeScreen,
    isCollapsed,
    selectedItem,
    menuItems,
    isSelected,
    toggleMenu,
    logout,
  }
}
