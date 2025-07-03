const { z } = require('zod');

exports.registerSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string()
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
        .refine((val) => /[A-Z]/.test(val), {
            message: 'Debe tener al menos una mayúscula',
        })
        .refine((val) => /[0-9]/.test(val), {
            message: 'Debe tener al menos un número',
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
            message: 'Debe tener al menos un símbolo',
        }),
});

exports.loginSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string(),
});
