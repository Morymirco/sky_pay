import { apiClient } from "../utils/api";
import { API_CONFIG } from "../constants/api";

export const fetchMembers = async () => {
  const { data } = await apiClient.get(API_CONFIG.ENDPOINTS.MEMBERS);
  return data;
};

export const createMember = async (member: any) => {
  const { data } = await apiClient.post(API_CONFIG.ENDPOINTS.MEMBERS, member);
  return data;
};

export const updateMember = async (id: string, member: any) => {
  const { data } = await apiClient.put(`${API_CONFIG.ENDPOINTS.MEMBERS}/${id}`, member);
  return data;
};

export const deleteMember = async (id: string) => {
  const { data } = await apiClient.delete(`${API_CONFIG.ENDPOINTS.MEMBERS}/${id}`);
  return data;
}; 