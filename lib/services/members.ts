import { API_CONFIG } from "../constants/api";
import { apiClient } from "../utils/api";

export interface PaymentMethod {
  id: number;
  name: string;
  logo: string;
  // is_active: boolean; // Supprimé car pas dans la structure fournie
}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  paiementMethodeId: number;
  paiement_identicator: string;
  montant_paiement: number;
  company_identificator: string;
  town: string | null;
  is_active: boolean;
  paiementMethode: PaymentMethod;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMemberRequest {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  paiementMethodeId: number;
  paiement_identicator: string;
  montant_paiement: number;
  company_identificator: string;
  town: string | null;
  is_active: boolean;
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
  id: number;
}

export interface ImportMembersRequest {
  file: File;
}

export interface MembersResponse {
  success: boolean;
  message: string;
  data: {
    members: Member[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
    filters: {
      search: string;
      is_active: boolean | null;
      paiementMethodeId: number | null;
    };
    company: {
      id: number;
      name: string;
    };
  };
  newToken?: string;
}

export interface MemberResponse {
  success: boolean;
  message: string;
  data: Member;
  newToken?: string;
}

export interface ImportMembersResponse {
  success: boolean;
  message: string;
  imported: number;
  errors: string[];
  newToken?: string;
}

export interface DeleteMemberResponse {
  success: boolean;
  message: string;
  newToken?: string;
}

// export interface MembersCountResponse {
//   success: boolean
//   message: string
//   data: {
//     count: number
//   }
//   newToken?: string
// }

class MembersService {
  // Récupérer tous les membres avec pagination et filtres
  async getMembers(page = 1, limit = 10, search?: string): Promise<MembersResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        try {
          const filters = JSON.parse(search);
          if (filters.search) params.append('search', filters.search);
          if (filters.is_active !== null) params.append('is_active', filters.is_active.toString());
          if (filters.paiementMethodeId) params.append('paiementMethodeId', filters.paiementMethodeId.toString());
        } catch (e) {
          params.append('search', search);
        }
      }

      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.MEMBERS}?${params}`);
      console.log('📋 Members fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching members:', error);
      throw error;
    }
  }

  // Récupérer un membre par ID
  async getMember(id: string): Promise<MemberResponse> {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.MEMBERS}/${id}`);
      console.log('📋 Member fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching member:', error);
      throw error;
    }
  }

  // Créer un nouveau membre
  async createMember(data: CreateMemberRequest): Promise<MemberResponse> {
    try {
      console.log('🔍 Creating member:', data);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.MEMBERS_ADD, data);
      console.log('✅ Member created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating member:', error);
      throw error;
    }
  }

  // Mettre à jour un membre
  async updateMember(data: UpdateMemberRequest): Promise<MemberResponse> {
    try {
      const { id, ...updateData } = data;
      const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.MEMBERS}/${id}`, updateData);
      console.log('✅ Member updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating member:', error);
      throw error;
    }
  }

  // Supprimer un membre
  async deleteMember(id: string): Promise<DeleteMemberResponse> {
    try {
      const response = await apiClient.delete(`${API_CONFIG.ENDPOINTS.MEMBERS}/${id}`);
      console.log('✅ Member deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting member:', error);
      throw error;
    }
  }

  // Importer des membres en masse
  async importMembers(file: File): Promise<ImportMembersResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(`${API_CONFIG.ENDPOINTS.MEMBERS}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('✅ Members imported:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error importing members:', error);
      throw error;
    }
  }

  // Exporter les membres
  async exportMembers(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.MEMBERS}/export?format=${format}`, {
        responseType: 'blob'
      });
      console.log('✅ Members exported:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error exporting members:', error);
      throw error;
    }
  }

  // Récupérer le nombre total de membres
  // getMembersCount: async (): Promise<MembersCountResponse> => {
  //   const response = await apiClient.get('/api/members/count')
  //   return response.data
  // }
}

export const membersService = new MembersService();