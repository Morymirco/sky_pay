import { apiClient } from "../utils/api";

export interface PaymentMethod {
  id: number;
  name: string;
  logo: string;
  // is_active: boolean; // Supprimé car pas dans la structure fournie
  // createdAt: string; // Supprimé car pas dans la structure fournie
  // updatedAt: string; // Supprimé car pas dans la structure fournie
}

export interface PaymentMethodsResponse {
  success: boolean;
  message: string;
  data: PaymentMethod[];
  newToken?: string;
}

class PaymentMethodsService {
  // Récupérer toutes les méthodes de paiement
  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    try {
      const response = await apiClient.get('/api/paiement-methodes');
      console.log('💳 Payment methods fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching payment methods:', error);
      throw error;
    }
  }

  // Récupérer une méthode de paiement par ID
  async getPaymentMethod(id: number): Promise<PaymentMethodsResponse> {
    try {
      const response = await apiClient.get(`/api/paiement-methodes/${id}`);
      console.log('💳 Payment method fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching payment method:', error);
      throw error;
    }
  }
}

export const paymentMethodsService = new PaymentMethodsService(); 