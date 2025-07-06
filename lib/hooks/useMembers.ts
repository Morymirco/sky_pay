import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMembers, createMember, updateMember, deleteMember } from "../services/members";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...member }: any) => updateMember(id, member),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
} 