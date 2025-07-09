import axios, { AxiosError, AxiosResponse } from 'axios'

// Configuration axios par défaut
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://corporate.eazykash.com",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le store Zustand
    const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
    const token = authState.state?.token
    
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'none'
    })
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn('⚠️ No token found for authenticated request:', config.url)
    }
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  (error: AxiosError) => {
    console.error('🔴 Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      console.warn('🔑 Unauthorized - Token expired or invalid')
      
      // Éviter de nettoyer plusieurs fois
      const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
      if (authState.state?.isAuthenticated) {
        console.log('🔄 Clearing auth data due to 401')
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('temp_auth_data')
      }
    }
    return Promise.reject(error)
  }
)

// Fonction utilitaire pour gérer les erreurs API
export const handleApiError = (error: unknown): string => {
  console.error('🔴 API Error:', error)
  
  if (axios.isAxiosError(error)) {
    console.error('📡 Request Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.config?.headers
    })
    
    const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue'
    console.error('💬 Error Message:', errorMessage)
    
    return errorMessage
  }
  
  console.error('❌ Unknown Error Type:', typeof error, error)
  return 'Une erreur inattendue est survenue'
}

// Fonction utilitaire pour formater les données de réponse
export const formatApiResponse = <T>(response: AxiosResponse<T>) => {
  return {
    data: response.data,
    status: response.status,
    headers: response.headers,
  }
} 