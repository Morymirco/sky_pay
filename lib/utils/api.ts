import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import {
    showAuthErrorToast,
    showSessionExpiredToast,
    showTokenRefreshToast
} from '../services/sessionToast'
import { useAuthStore } from '../stores/authStore'

// Variable pour éviter les requêtes simultanées pendant la mise à jour du token
let isUpdatingToken = false
// Variable pour stocker le dernier token reçu
let lastReceivedToken: string | null = null
// Variable pour indiquer si c'est la première requête /api/users/me
let isFirstUsersMeRequest = true

// Fonction pour vérifier si c'est la première requête /api/users/me de cette session
const isFirstUsersMeRequestOfSession = () => {
  if (typeof window === 'undefined') return true
  
  // Vérifier si c'est la première requête de cette session
  const isFirst = isFirstUsersMeRequest
  
  console.log('🔍 isFirstUsersMeRequestOfSession check:', {
    isFirstUsersMeRequest,
    isFirst
  })
  
  return isFirst
}

// Fonction pour essayer de récupérer le token de réponse de toutes les façons possibles
const extractTokenFromResponse = (response: AxiosResponse): string | null => {
  let token = null
  
  console.log('🔍 🔍 🔍 DÉBUT extractTokenFromResponse 🔍 🔍 🔍')
  console.log('🔍 Response object structure:', {
    hasHeaders: !!response.headers,
    headersType: typeof response.headers,
    headersKeys: Object.keys(response.headers || {}),
    hasData: !!response.data,
    dataType: typeof response.data,
    dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : []
  })
  
  // NOUVELLE LOGIQUE: Chercher le token dans le body de la réponse
  if (response.data && typeof response.data === 'object') {
    console.log('🔍 Checking response.data for newToken:')
    console.log('🔍 response.data keys:', Object.keys(response.data))
    
    const responseData = response.data as any
    
    // Méthode 1: Vérifier directement response.data.newToken
    if (responseData.newToken && typeof responseData.newToken === 'string') {
      token = responseData.newToken
      console.log('🔍 Found token in response.data.newToken:', token.substring(0, 20) + '...')
      return token
    }
    
    // Méthode 2: Vérifier dans response.data.data.newToken
    if (responseData.data && typeof responseData.data === 'object') {
      console.log('🔍 response.data.data keys:', Object.keys(responseData.data))
      if (responseData.data.newToken && typeof responseData.data.newToken === 'string') {
        token = responseData.data.newToken
        console.log('🔍 Found token in response.data.data.newToken:', token.substring(0, 20) + '...')
        return token
      }
    }
    
    // Méthode 3: Vérifier dans response.data.token (fallback)
    if (responseData.token && typeof responseData.token === 'string') {
      token = responseData.token
      console.log('🔍 Found token in response.data.token (fallback):', token.substring(0, 20) + '...')
      return token
    }
    
    // Méthode 4: Vérifier dans response.data.data.token (fallback)
    if (responseData.data && responseData.data.token && typeof responseData.data.token === 'string') {
      token = responseData.data.token
      console.log('🔍 Found token in response.data.data.token (fallback):', token.substring(0, 20) + '...')
      return token
    }
    
    // Méthode 5: Vérifier dans response.data.access_token (fallback)
    if (responseData.access_token && typeof responseData.access_token === 'string') {
      token = responseData.access_token
      console.log('🔍 Found token in response.data.access_token (fallback):', token.substring(0, 20) + '...')
      return token
    }
  }
  
  // ANCIENNE LOGIQUE (gardée comme fallback): Headers directs
  console.log('🔍 No newToken found in response body, checking headers as fallback...')
  token = response.headers['authorization'] || response.headers['Authorization']
  if (token) {
    console.log('🔍 Found token via headers direct (fallback):', token.substring(0, 20) + '...')
    return token
  }
  
  // Parcourir tous les headers avec plus de détails
  console.log('🔍 Iterating through all headers:')
  for (const [key, value] of Object.entries(response.headers)) {
    console.log(`🔍 Header: "${key}" = "${value}" (type: ${typeof value})`)
    if (key.toLowerCase().includes('authorization') && typeof value === 'string') {
      token = value
      console.log('🔍 Found token via headers iteration (fallback):', token.substring(0, 20) + '...')
      return token
    }
  }
  
  // Headers.get() native (si disponible)
  if (typeof response.headers.get === 'function') {
    console.log('🔍 Trying headers.get() method:')
    const authHeader = response.headers.get('authorization') || 
                      response.headers.get('Authorization') ||
                      response.headers.get('x-authorization') ||
                      response.headers.get('X-Authorization')
    if (authHeader && typeof authHeader === 'string') {
      token = authHeader
      console.log('🔍 Found token via headers.get() (fallback):', token.substring(0, 20) + '...')
      return token
    }
  }
  
  console.log('❌ ❌ ❌ FIN extractTokenFromResponse - Aucun token trouvé ❌ ❌ ❌')
  return null
}

// Fonction pour nettoyer le token temporaire
export const clearLastReceivedToken = () => {
  console.log('🧹 clearLastReceivedToken called - clearing lastReceivedToken')
  lastReceivedToken = null
  console.log('🧹 Last received token cleared')
}

// Fonction pour nettoyer tous les tokens temporaires (appelée lors du logout)
export const clearAllTemporaryTokens = () => {
  console.log('🧹 clearAllTemporaryTokens called - clearing all temporary tokens')
  lastReceivedToken = null
  isFirstUsersMeRequest = true
  requestCounter = 0
  previousRequestToken = null
  
  // Nettoyer les tokens temporaires du localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('first_auth_me')
    localStorage.removeItem('temp_auth_data')
    localStorage.removeItem('temp_reset_data')
  }
  
  console.log('🧹 All temporary tokens cleared')
}

// Fonction pour réinitialiser l'état de la première requête
export const resetFirstUsersMeRequest = () => {
  console.log('🔄 resetFirstUsersMeRequest called - setting isFirstUsersMeRequest to true')
  console.log('🔄 Previous value of isFirstUsersMeRequest:', isFirstUsersMeRequest)
  isFirstUsersMeRequest = true
  requestCounter = 0
  console.log('🔄 Reset first /api/users/me request flag and request counter')
  console.log('🔄 New value of isFirstUsersMeRequest:', isFirstUsersMeRequest)
}

// Variable pour stocker le token de la requête précédente
let previousRequestToken: string | null = null
// Compteur de requêtes pour le debugging
let requestCounter = 0

// Fonction pour comparer les tokens entre les requêtes
export const compareTokens = (currentToken: string | null) => {
  requestCounter++
  if (previousRequestToken && currentToken) {
    console.log(`🔄 Request #${requestCounter} - Token comparison:`, {
      previousToken: `${previousRequestToken.substring(0, 20)}...`,
      currentToken: `${currentToken.substring(0, 20)}...`,
      tokensAreDifferent: previousRequestToken !== currentToken,
      previousLength: previousRequestToken.length,
      currentLength: currentToken.length
    })
  } else {
    console.log(`🚀 Request #${requestCounter} - First request with token:`, currentToken ? `${currentToken.substring(0, 20)}...` : 'none')
  }
  previousRequestToken = currentToken
}

// Fonction pour forcer la persistance du token dans localStorage
export const forceTokenPersistence = (token: string) => {
  if (typeof window !== 'undefined') {
    const currentState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
    const updatedState = {
      ...currentState,
      state: {
        ...currentState.state,
        token: token
      }
    }
    localStorage.setItem('auth-storage', JSON.stringify(updatedState))
    console.log('💾 Token force-persisted to localStorage:', token.substring(0, 20) + '...')
    
    // Vérification immédiate
    const verificationState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
    const verificationToken = verificationState.state?.token
    console.log('🔍 Force persistence verification:', {
      success: verificationToken === token,
      storedToken: verificationToken ? `${verificationToken.substring(0, 20)}...` : 'none'
    })
  }
}

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
    // Attendre si une mise à jour de token est en cours
    if (isUpdatingToken) {
      console.log('⏳ Waiting for token update to complete...')
      return new Promise((resolve) => {
        const checkToken = () => {
          if (!isUpdatingToken) {
            resolve(config)
          } else {
            setTimeout(checkToken, 100)
          }
        }
        checkToken()
      })
    }

    // Récupérer le token depuis le store Zustand (toujours le plus récent)
    const { token } = useAuthStore.getState()
    
    // Récupérer le token depuis localStorage si lastReceivedToken n'est pas disponible
    let localStorageToken = null
    
    if (!lastReceivedToken && typeof window !== 'undefined') {
      const persistedState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
      localStorageToken = persistedState.state?.token
      if (localStorageToken) {
        console.log('🔍 Retrieved token from localStorage:', localStorageToken.substring(0, 20) + '...')
      }
    }
    
    // Priorité des tokens : lastReceivedToken > localStorageToken > storeToken
    const tokenToUse = lastReceivedToken || localStorageToken || token
    
    // Debug: Comparer les tokens disponibles
    console.log('🔍 Token selection for request:', {
      storeToken: token ? `${token.substring(0, 20)}...` : 'none',
      lastReceivedToken: lastReceivedToken ? `${lastReceivedToken.substring(0, 20)}...` : 'none',
      localStorageToken: localStorageToken ? `${localStorageToken.substring(0, 20)}...` : 'none',
      selectedToken: tokenToUse ? `${tokenToUse.substring(0, 20)}...` : 'none',
      usingLastReceived: !!lastReceivedToken,
      usingLocalStorage: !lastReceivedToken && !!localStorageToken,
      usingStore: !lastReceivedToken && !localStorageToken && !!token,
      requestNumber: previousRequestToken ? 'subsequent' : 'first'
    })
    
    // Log clair pour montrer le flux de rotation des tokens
    if (lastReceivedToken) {
      console.log('🔄 Using token from previous request for:', config.url)
    } else if (localStorageToken) {
      console.log('💾 Using token from localStorage for:', config.url)
    } else {
      console.log('🚀 Using initial token for:', config.url)
    }
    
    // Comparer avec le token de la requête précédente
    compareTokens(tokenToUse)
    
    // Vérifier si le token est expiré
    const tokenExpired = tokenToUse ? isTokenExpired(tokenToUse) : true
    const tokenPayload = tokenToUse ? decodeToken(tokenToUse) : null
    
    // Vérifier si c'est la première requête /api/users/me
    const isUsersMeRequest = config.url?.includes('/api/users/me')
    console.log('🔍 URL check for /api/users/me:', {
      url: config.url,
      isUsersMeRequest,
      includesCheck: config.url?.includes('/api/users/me')
    })
    
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!tokenToUse,
      tokenPreview: tokenToUse ? `${tokenToUse.substring(0, 10)}...` : 'none',
      tokenLength: tokenToUse ? tokenToUse.length : 0,
      tokenExpired,
      tokenExp: tokenPayload?.exp ? new Date(tokenPayload.exp * 1000).toISOString() : 'unknown',
      currentTime: new Date().toISOString(),
      usingLastReceivedToken: !!lastReceivedToken,
      isUsersMeRequest,
      isFirstUsersMeRequest: isUsersMeRequest && isFirstUsersMeRequest,
      globalIsFirstUsersMeRequest: isFirstUsersMeRequest
    })
    
    // Marquer que ce n'est plus la première requête /api/users/me
    if (isUsersMeRequest && isFirstUsersMeRequestOfSession()) {
      console.log('🎯 First /api/users/me request - this should return company data')
      // On ne met pas isFirstUsersMeRequest à false ici, on attend la réponse
    }
    
    if (tokenToUse) {
      if (tokenExpired) {
        console.warn('⚠️ Token is expired, but sending request anyway (server may return new token)')
        
        // Si c'est la première requête /api/users/me et que le token est expiré,
        // on peut essayer de faire la requête quand même car le serveur peut retourner un nouveau token
        if (isUsersMeRequest && isFirstUsersMeRequestOfSession()) {
          console.log('🎯 First /api/users/me request with expired token - server may return new token')
        }
      }
      config.headers.Authorization = `Bearer ${tokenToUse}`
      console.log('🔑 Authorization header set:', `Bearer ${tokenToUse.substring(0, 20)}...`)
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

// Intercepteur pour gérer les réponses et la rotation des tokens
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const isUsersMeRequest = response.config.url?.includes('/api/users/me')
    
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      hasCompanyData: isUsersMeRequest ? !!response.data?.company : 'N/A',
      companyName: isUsersMeRequest ? response.data?.company?.name : 'N/A',
      dataKeys: Object.keys(response.data || {}),
      isFirstUsersMeRequest: isUsersMeRequest && isFirstUsersMeRequest
    })
    
    // Debug: Vérifier tous les headers de la réponse
    console.log('🔍 Response headers:', {
      authorization: response.headers['authorization'] ? 'present' : 'missing',
      Authorization: response.headers['Authorization'] ? 'present' : 'missing',
      authorizationValue: response.headers['authorization'] || 'none',
      AuthorizationValue: response.headers['Authorization'] || 'none',
      allHeaders: Object.keys(response.headers),
      allHeadersWithValues: Object.entries(response.headers).map(([key, value]) => `${key}: ${value}`)
    })
    
    // Essayer de récupérer le token de réponse de toutes les façons possibles
    const newToken = extractTokenFromResponse(response)
    if (newToken) {
      console.log('🔄 New token received in response body:', newToken.substring(0, 20) + '...')
      
      // Extraire le token (enlever "Bearer " si présent)
      const tokenValue = newToken.startsWith('Bearer ') ? newToken.substring(7) : newToken
      
      // Stocker le dernier token reçu pour les requêtes suivantes
      lastReceivedToken = tokenValue
      console.log('💾 Token stored for next request:', tokenValue.substring(0, 20) + '...')
      
      // Mettre à jour le token dans le store Zustand
      const { isAuthenticated, setToken } = useAuthStore.getState()
      if (isAuthenticated) {
        setToken(tokenValue)
        console.log('💾 Token updated in auth store and persisted to localStorage')
        
        // Forcer la persistance du token dans localStorage
        forceTokenPersistence(tokenValue)
        
        // Afficher un toast de renouvellement de session
        showTokenRefreshToast()
      }
      
      // Si c'est la première requête /api/users/me, marquer que ce n'est plus la première
      if (isUsersMeRequest && isFirstUsersMeRequestOfSession()) {
        console.log('🎯 First /api/users/me request completed - marking as not first anymore')
        isFirstUsersMeRequest = false
        console.log('🔄 isFirstUsersMeRequest set to false')
      }
    } else {
      console.log('⚠️ No new token in response for:', response.config.url)
      
      // Si c'est la première requête /api/users/me et qu'il n'y a pas de nouveau token,
      // marquer quand même que ce n'est plus la première requête
      if (isUsersMeRequest && isFirstUsersMeRequestOfSession()) {
        console.log('🎯 First /api/users/me request completed (no new token) - marking as not first anymore')
          isFirstUsersMeRequest = false
        console.log('🔄 isFirstUsersMeRequest set to false (no new token)')
      }
    }
    
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
      
      // NOUVELLE LOGIQUE: Vérifier si un nouveau token est présent dans le body de la réponse d'erreur
      let newToken = null
      
      if (error.response.data && typeof error.response.data === 'object') {
        const responseData = error.response.data as any
        // Vérifier response.data.newToken en premier
        if (responseData.newToken && typeof responseData.newToken === 'string') {
          newToken = responseData.newToken
        } else if (responseData.data && responseData.data.newToken && typeof responseData.data.newToken === 'string') {
          newToken = responseData.data.newToken
        } else if (responseData.token && typeof responseData.token === 'string') {
          newToken = responseData.token
        } else if (responseData.data && responseData.data.token && typeof responseData.data.token === 'string') {
          newToken = responseData.data.token
        }
      }
      
      // Fallback vers les headers si pas trouvé dans le body
      if (!newToken) {
        newToken = error.response.headers['authorization'] || error.response.headers['Authorization']
      }
      
      if (newToken) {
        console.log('🔄 New token received in 401 response:', newToken.substring(0, 20) + '...')
        
        // Extraire le token (enlever "Bearer " si présent)
        const tokenValue = newToken.startsWith('Bearer ') ? newToken.substring(7) : newToken
        
        // Stocker le dernier token reçu pour les requêtes suivantes
        lastReceivedToken = tokenValue
        console.log('💾 Last received token stored from 401 response')
        
        // Mettre à jour le token dans le store Zustand
        const { isAuthenticated, setToken } = useAuthStore.getState()
        if (isAuthenticated) {
          setToken(tokenValue)
          console.log('💾 Token updated from 401 response')
          
          // Forcer la persistance du token dans localStorage
          forceTokenPersistence(tokenValue)
          
          // Afficher un toast de renouvellement de session
          showTokenRefreshToast()
        }
      } else {
        // Aucun nouveau token reçu - session expirée
        showSessionExpiredToast()
        
        // Rediriger automatiquement vers la page de login après un délai
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }, 3000) // 3 secondes de délai
      }
      
      // Si c'est une requête /api/users/me et qu'on n'a pas reçu de nouveau token,
      // déconnecter l'utilisateur car le token n'est plus valide
      if (error.config?.url?.includes('/api/users/me') && error.config?.method === 'get' && !newToken) {
        console.log('🚨 /api/users/me returned 401 without new token - logging out user')
        const { logout } = useAuthStore.getState()
        logout()
        // Rediriger vers la page de login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return
      }
    } else if (error.response?.status === 403) {
      // Erreur d'autorisation
      showAuthErrorToast('Vous n\'avez pas les permissions nécessaires pour cette action.')
    } else if (error.response?.status === 400) {
      console.warn('🔴 Bad Request - Vérifier si un nouveau token est présent')
      
      // Vérifier si un nouveau token est présent dans le body de la réponse d'erreur 400
      let newToken = null
      
      if (error.response.data && typeof error.response.data === 'object') {
        const responseData = error.response.data as any
        // Vérifier response.data.newToken en premier
        if (responseData.newToken && typeof responseData.newToken === 'string') {
          newToken = responseData.newToken
        } else if (responseData.data && responseData.data.newToken && typeof responseData.data.newToken === 'string') {
          newToken = responseData.data.newToken
        } else if (responseData.token && typeof responseData.token === 'string') {
          newToken = responseData.token
        } else if (responseData.data && responseData.data.token && typeof responseData.data.token === 'string') {
          newToken = responseData.data.token
        }
      }
      
      // Fallback vers les headers si pas trouvé dans le body
      if (!newToken) {
        newToken = error.response.headers['authorization'] || error.response.headers['Authorization']
      }
      
      if (newToken) {
        console.log('🔄 New token received in 400 response:', newToken.substring(0, 20) + '...')
        
        // Extraire le token (enlever "Bearer " si présent)
        const tokenValue = newToken.startsWith('Bearer ') ? newToken.substring(7) : newToken
        
        // Stocker le dernier token reçu pour les requêtes suivantes
        lastReceivedToken = tokenValue
        console.log('💾 Last received token stored from 400 response')
        
        // Mettre à jour le token dans le store Zustand
        const { isAuthenticated, setToken } = useAuthStore.getState()
        if (isAuthenticated) {
          setToken(tokenValue)
          console.log('💾 Token updated from 400 response')
          
          // Forcer la persistance du token dans localStorage
          forceTokenPersistence(tokenValue)
          
          // Afficher un toast de renouvellement de session
          showTokenRefreshToast()
        }
      }
      
      // Ne pas déconnecter l'utilisateur pour les erreurs 400, même sans newToken
      // car ce sont généralement des erreurs de validation et non d'authentification
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

// Fonction utilitaire pour vérifier si un token JWT est expiré
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    console.error('❌ Error parsing JWT token:', error)
    return true // Considérer comme expiré si on ne peut pas le parser
  }
}

// Fonction utilitaire pour décoder un token JWT
export const decodeToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (error) {
    console.error('❌ Error decoding JWT token:', error)
    return null
  }
}

/**
 * Crée une instance axios avec le token temporaire pour la connexion OTP
 */
export function createOTPApiClient(): AxiosInstance {
  const tempData = localStorage.getItem('temp_auth_data')
  if (!tempData) {
    throw new Error('No temporary auth data found')
  }
  
  const authData = JSON.parse(tempData)
  const tempToken = authData.token
  
  console.log('🔢 Creating OTP API client with temp token:', tempToken ? `${tempToken.substring(0, 20)}...` : 'none')
  
  const otpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://corporate.eazykash.com",
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${tempToken}`
    }
  })

  // Intercepteur pour gérer la rotation des tokens pour OTP
  otpClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // NOUVELLE LOGIQUE: Chercher le token dans le body de la réponse
      let newToken = null
      
      if (response.data && typeof response.data === 'object') {
        const responseData = response.data as any
        // Vérifier response.data.newToken en premier
        if (responseData.newToken && typeof responseData.newToken === 'string') {
          newToken = responseData.newToken
        } else if (responseData.data && responseData.data.newToken && typeof responseData.data.newToken === 'string') {
          newToken = responseData.data.newToken
        } else if (responseData.token && typeof responseData.token === 'string') {
          newToken = responseData.token
        } else if (responseData.data && responseData.data.token && typeof responseData.data.token === 'string') {
          newToken = responseData.data.token
        }
      }
      
      // Fallback vers les headers si pas trouvé dans le body
      if (!newToken) {
        newToken = response.headers['authorization'] || response.headers['Authorization']
      }
      
      if (newToken) {
        console.log('🔄 New OTP token received:', newToken.substring(0, 20) + '...')
        const tokenValue = newToken.startsWith('Bearer ') ? newToken.substring(7) : newToken
        
        // Mettre à jour le token temporaire
        const updatedTempData = {
          ...authData,
          token: tokenValue
        }
        localStorage.setItem('temp_auth_data', JSON.stringify(updatedTempData))
        console.log('💾 OTP temp token updated')
      }
      return response
    },
    (error) => Promise.reject(error)
  )

  return otpClient
}

/**
 * Crée une instance axios avec le token temporaire pour la réinitialisation de mot de passe
 */
export function createResetApiClient(): AxiosInstance {
  const tempData = localStorage.getItem('temp_reset_data')
  if (!tempData) {
    throw new Error('No temporary reset data found')
  }
  
  const resetData = JSON.parse(tempData)
  const tempToken = resetData.token
  
  console.log('🔑 Creating reset API client with temp token:', tempToken ? `${tempToken.substring(0, 20)}...` : 'none')
  
  const resetClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://corporate.eazykash.com",
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${tempToken}`
    }
  })

  // Intercepteur pour gérer la rotation des tokens pour Reset
  resetClient.interceptors.response.use(
    (response: AxiosResponse) => {
      // NOUVELLE LOGIQUE: Chercher le token dans le body de la réponse
      let newToken = null
      
      if (response.data && typeof response.data === 'object') {
        const responseData = response.data as any
        // Vérifier response.data.newToken en premier
        if (responseData.newToken && typeof responseData.newToken === 'string') {
          newToken = responseData.newToken
        } else if (responseData.data && responseData.data.newToken && typeof responseData.data.newToken === 'string') {
          newToken = responseData.data.newToken
        } else if (responseData.token && typeof responseData.token === 'string') {
          newToken = responseData.token
        } else if (responseData.data && responseData.data.token && typeof responseData.data.token === 'string') {
          newToken = responseData.data.token
        }
      }
      
      // Fallback vers les headers si pas trouvé dans le body
      if (!newToken) {
        newToken = response.headers['authorization'] || response.headers['Authorization']
      }
      
      if (newToken) {
        console.log('🔄 New reset token received:', newToken.substring(0, 20) + '...')
        const tokenValue = newToken.startsWith('Bearer ') ? newToken.substring(7) : newToken
        
        // Mettre à jour le token temporaire
        const updatedTempData = {
          ...resetData,
          token: tokenValue
        }
        localStorage.setItem('temp_reset_data', JSON.stringify(updatedTempData))
        console.log('💾 Reset temp token updated')
      }
      return response
    },
    (error) => Promise.reject(error)
  )

  return resetClient
} 