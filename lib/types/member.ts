export interface Member {
  id: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  paiement_methode: 'kulu' | 'orange_money' | 'soutra_money' | 'mobile_money'
  paiement_identicator: string
  montant_paiement?: number
  town: string
  custom_attributes: Record<string, string>
  is_active: boolean
  companyId: number
  createdAt: string
  updatedAt: string
}

export interface CreateMemberRequest {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  paiement_methode: 'kulu' | 'orange_money' | 'soutra_money' | 'mobile_money'
  paiement_identicator: string
  montant_paiement?: number
  town: string
  custom_attributes: Record<string, string>
}

export interface UpdateMemberRequest {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  paiement_methode?: 'kulu' | 'orange_money' | 'soutra_money' | 'mobile_money'
  paiement_identicator?: string
  montant_paiement?: number
  town?: string
  custom_attributes?: Record<string, string>
  is_active?: boolean
}

export interface MembersResponse {
  success: boolean
  message: string
  data: {
    members: Member[]
    pagination: PaginationInfo
    filters: {
      search?: string
      is_active?: boolean
      paiement_methode?: string
    }
    company: {
      id: number
      name: string
    }
  }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number
  prevPage?: number
}

export interface SearchFilters {
  page?: number
  limit?: number
  search?: string
  is_active?: boolean
  paiement_methode?: 'kulu' | 'orange_money' | 'soutra_money' | 'mobile_money'
  customFieldName?: string
  customFieldValue?: string
} 