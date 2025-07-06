import { z } from "zod"

export const memberSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  provider: z.enum(["Kulu", "Soutra Money", "Orange Money"], {
    errorMap: () => ({ message: "Fournisseur invalide" })
  }),
  accountNumber: z.string().min(3, "Numéro de compte invalide"),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Statut invalide" })
  })
})

export const createMemberSchema = memberSchema

export const updateMemberSchema = memberSchema.partial().extend({
  id: z.string().min(1, "ID requis")
})

export const importMembersSchema = z.object({
  file: z.instanceof(File, { message: "Fichier requis" }),
  fileType: z.enum([".xlsx", ".xls", ".csv"], {
    errorMap: () => ({ message: "Type de fichier non supporté" })
  })
})

export type MemberFormData = z.infer<typeof memberSchema>
export type CreateMemberFormData = z.infer<typeof createMemberSchema>
export type UpdateMemberFormData = z.infer<typeof updateMemberSchema>
export type ImportMembersFormData = z.infer<typeof importMembersSchema> 