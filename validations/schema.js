import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string()
        .min(8, { message: 'Debe tener al menos 8 caracteres' })
        .refine((val) => /[A-Z]/.test(val), { message: 'Debe tener al menos una mayúscula' })
        .refine((val) => /[0-9]/.test(val), { message: 'Debe tener al menos un número' })
        .refine((val) => /[^A-Za-z0-9]/.test(val), { message: 'Debe tener al menos un símbolo' }),
});

const loginSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string(),
});

const createProductSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    description: z.string().optional(),
    stock: z.number().min(1, { message: "El stock es requerido" }),
    price: z.number().min(1, { message: "El precio es requerido" }),
    image_url: z.string().url({ message: "URL inválida" }),
});

export default {
    registerSchema,
    loginSchema,
    createProductSchema,
};
