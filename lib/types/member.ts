export interface Member {
  id: string
  name: string
  email: string
  phone: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface CreateMemberRequest {
  name: string
  email: string
  phone: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  status: "active" | "inactive"
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
  id: string
}

export interface MemberResponse {
  success: boolean
  data: Member | Member[]
  message?: string
  errors?: string[]
} 