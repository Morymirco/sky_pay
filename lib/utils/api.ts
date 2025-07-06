import axios, { AxiosError, AxiosResponse } from 'axios'

// Configuration axios par défaut
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.skypay.sn",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sky_pay_auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('sky_pay_auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Fonction utilitaire pour gérer les erreurs API
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Une erreur est survenue'
  }
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