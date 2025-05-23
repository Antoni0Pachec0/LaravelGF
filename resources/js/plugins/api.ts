// resources/js/plugins/api.ts
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://gf-app.onrender.com/api'

const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar el token de autorización
apiInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores y refrescar el token
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error
    if (response && response.status === 401) {
      try {
        const refreshToken =
          localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken')
        const refreshResponse = await apiInstance.post('/clientes/refresh-token', null, {
          headers: {
            'x-refresh-token': refreshToken,
          },
        })
        const newAccessToken = refreshResponse.data.accessToken
        if (localStorage.getItem('accessToken')) {
          localStorage.setItem('accessToken', newAccessToken)
        } else {
          sessionStorage.setItem('accessToken', newAccessToken)
        }
        error.config.headers.Authorization = `Bearer ${newAccessToken}`
        return apiInstance.request(error.config)
      } catch (refreshError) {
        console.error('Error al refrescar token:', refreshError)
      }
    }
    return Promise.reject(error)
  }
)

// API personalizada
const api = {
  getProductos: (params: any) => apiInstance.get('/productos/productos', { params }),
  searchProductos: (term: string, params: any) =>
    apiInstance.post('/productos/buscarByname', { term }, { params }),
  getUserById: (id: string | number) => apiInstance.get(`/clientes/${id}`),
  getLocalidadById: (id: string | number) => apiInstance.get(`/clientes/localidades/${id}`),
  getRutaById: (id: string | number) => apiInstance.get(`/clientes/rutas/${id}`),
  login: (credentials: Record<string, any>) => apiInstance.post('/clientes/login', credentials),
  refreshToken: () => apiInstance.post('/clientes/refresh-token'),

// Agrega al final de tu objeto api
createOrder: (data: Record<string, any>) => apiInstance.post('/pedidos', data),
addProductToOrder: (data: Record<string, any>) => apiInstance.post('/pedidos/add-product', data),
}

export default api
