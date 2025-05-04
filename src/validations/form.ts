import { z } from "zod";

export const createPurchaseSchema = z.object({
    category: z.string().min(1, "Choose one").trim(),
    item_name: z.string().min(3, "Name atleast 3 characters").trim(),
    quantity: z.number(),
    total: z.number(),
    price: z.number().min(1, "Price atleast 1"),
    created_at: z.string().optional()
})

export type TCreatePurchaseSchema = z.infer<typeof createPurchaseSchema>;

export const enterBalanceSchema = z.object({
    balance: z.number().min(1, "Add atleast 1"),
    created_at: z.string().optional()
})

export type TEnterBalanceSchema = z.infer<typeof enterBalanceSchema>