const { z } = require('zod');

const roomFields = {
  name: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  capacity: z.coerce.number().int().positive('A capacidade deve ser um número inteiro maior que zero.'),
  location: z.string().trim().min(2, 'Informe a localização da sala.')
};

const createRoomSchema = z.object({
  body: z.object(roomFields)
});

const updateRoomSchema = z.object({
  body: z.object(roomFields).partial().refine(
    (data) => Object.keys(data).length > 0,
    'Informe ao menos um campo para atualizar.'
  ),
  params: z.object({ id: z.coerce.number().int().positive('ID inválido.') })
});

const roomIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive('ID inválido.') })
});

const listRoomsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).max(100).default(10)
  })
});

module.exports = { createRoomSchema, updateRoomSchema, roomIdSchema, listRoomsSchema };
