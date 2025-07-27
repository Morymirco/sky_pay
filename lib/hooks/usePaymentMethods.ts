import { useQuery } from '@tanstack/react-query';
import { PaymentMethodsResponse, paymentMethodsService } from '../services/paymentMethods';

// Hook pour récupérer toutes les méthodes de paiement
export const usePaymentMethods = () => {
  return useQuery<PaymentMethodsResponse, Error>({
    queryKey: ['paymentMethods'],
    queryFn: () => paymentMethodsService.getPaymentMethods(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer une méthode de paiement par ID
export const usePaymentMethod = (id: number) => {
  return useQuery<PaymentMethodsResponse, Error>({
    queryKey: ['paymentMethod', id],
    queryFn: () => paymentMethodsService.getPaymentMethod(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 