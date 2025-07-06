import axios from "axios";
import { API_ROUTES } from "../constants/api";

export const fetchMembers = async () => {
  const { data } = await axios.get(API_ROUTES.members);
  return data;
};

export const createMember = async (member: any) => {
  const { data } = await axios.post(API_ROUTES.members, member);
  return data;
};

export const updateMember = async (id: string, member: any) => {
  const { data } = await axios.put(`${API_ROUTES.members}/${id}`, member);
  return data;
};

export const deleteMember = async (id: string) => {
  const { data } = await axios.delete(`${API_ROUTES.members}/${id}`);
  return data;
}; 