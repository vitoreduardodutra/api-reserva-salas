const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Informe um nome com pelo menos 2 caracteres.'),
    email: z.string().trim().email('Informe um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.')
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Informe um e-mail válido.'),
    password: z.string().min(1, 'Informe a senha.')
  })
});

module.exports = { registerSchema, loginSchema };
