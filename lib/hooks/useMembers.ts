import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateMemberRequest, membersService, UpdateMemberRequest } from '../services/members'
import { handleApiError } from '../utils/api'

export function useMembers(page = 1, limit = 10, search?: string) {
  return useQuery({
    queryKey: ['members', page, limit, search],
    queryFn: () => membersService.getMembers(page, limit, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}

export function useMember(id: string) {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => membersService.getMember(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateMemberRequest) => membersService.createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (error) => {
      console.error('❌ Error creating member:', error)
      throw handleApiError(error)
    }
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateMemberRequest) => membersService.updateMember(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['members', variables.id] })
    },
    onError: (error) => {
      console.error('❌ Error updating member:', error)
      throw handleApiError(error)
    }
  })
}

export function useDeleteMember() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => membersService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (error) => {
      console.error('❌ Error deleting member:', error)
      throw handleApiError(error)
    }
  })
}

export function useImportMembers() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (file: File) => membersService.importMembers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
    onError: (error) => {
      console.error('❌ Error importing members:', error)
      throw handleApiError(error)
    }
  })
}

export function useExportMembers() {
  return useMutation({
    mutationFn: (format: 'csv' | 'xlsx' = 'csv') => membersService.exportMembers(format),
    onError: (error) => {
      console.error('❌ Error exporting members:', error)
      throw handleApiError(error)
    }
  })
}

// export function useMembersCount() {
//   return useQuery({
//     queryKey: ['members-count'],
//     queryFn: () => membersService.getMembersCount(),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   })
// } 