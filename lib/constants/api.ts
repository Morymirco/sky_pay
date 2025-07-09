// Configuration de l'API Smart Pay
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://corporate.eazykash.com',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me',
      CHANGE_PASSWORD: '/api/auth/change-password',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      VERIFY_EMAIL: '/api/auth/verify-email',
      RESEND_VERIFICATION: '/api/auth/resend-verification',
      PROFILE: '/api/auth/profile',
      ACCOUNT: '/api/auth/account',
    },
    USERS: '/api/users',
    MEMBERS: '/api/members',
    RECHARGE_REQUESTS: '/api/recharge-requests',
    DOCS: '/api/docs',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const

// Messages d'erreur personnalisés
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Identifiants incorrects. Veuillez réessayer.',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'Ressource non trouvée.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  VALIDATION_ERROR: 'Données invalides. Veuillez vérifier vos informations.',
  TIMEOUT: 'Délai d\'attente dépassé. Veuillez réessayer.',
  UNKNOWN: 'Une erreur inattendue est survenue.',
} as const

// Codes de statut HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://corporate.eazykash.com";

export const API_ROUTES = {
  members: `${API_BASE_URL}/api/members`,
  users: `${API_BASE_URL}/api/users`,
  rechargeRequests: `${API_BASE_URL}/api/recharge-requests`,
  docs: `${API_BASE_URL}/api/docs`,
  // Ajoute ici d'autres routes (paiements, comptes, etc.)
}; 