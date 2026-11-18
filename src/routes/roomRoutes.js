const express = require('express');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { authenticate, requireAdmin } = require('../middlewares/auth');
const {
  createRoomSchema,
  updateRoomSchema,
  roomIdSchema,
  listRoomsSchema
} = require('../schemas/roomSchemas');

const router = express.Router();

// Consulta pública com paginação.
router.get('/', validate(listRoomsSchema), asyncHandler(async (req, res) => {
  const { page, size } = req.validated.query;
  const skip = (page - 1) * size;

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      skip,
      take: size,
      orderBy: { id: 'asc' }
    }),
    prisma.room.count()
  ]);

  res.json({
    status: 200,
    data: rooms,
    pagination: {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size)
    }
  });
}));

// Consulta de uma sala pelo ID.
router.get('/:id', validate(roomIdSchema), asyncHandler(async (req, res) => {
  const room = await prisma.room.findUnique({
    where: { id: req.validated.params.id }
  });

  if (!room) {
    return res.status(404).json({ status: 404, message: 'Sala não encontrada.' });
  }

  res.json({ status: 200, data: room });
}));

// A partir daqui, somente administrador pode alterar as salas.
router.post('/', authenticate, requireAdmin, validate(createRoomSchema), asyncHandler(async (req, res) => {
  const room = await prisma.room.create({ data: req.validated.body });
  res.status(201).json({ status: 201, message: 'Sala cadastrada com sucesso.', data: room });
}));

router.put('/:id', authenticate, requireAdmin, validate(updateRoomSchema), asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const room = await prisma.room.findUnique({ where: { id } });

  if (!room) {
    return res.status(404).json({ status: 404, message: 'Sala não encontrada.' });
  }

  const updatedRoom = await prisma.room.update({
    where: { id },
    data: req.validated.body
  });

  res.json({ status: 200, message: 'Sala atualizada com sucesso.', data: updatedRoom });
}));

router.delete('/:id', authenticate, requireAdmin, validate(roomIdSchema), asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const room = await prisma.room.findUnique({ where: { id } });

  if (!room) {
    return res.status(404).json({ status: 404, message: 'Sala não encontrada.' });
  }

  try {
    await prisma.room.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    // A sala não pode ser removida se já estiver vinculada a uma reserva.
    if (error.code === 'P2003') {
      return res.status(409).json({ status: 409, message: 'Não é possível excluir uma sala que possui reservas.' });
    }
    throw error;
  }
}));

module.exports = router;
