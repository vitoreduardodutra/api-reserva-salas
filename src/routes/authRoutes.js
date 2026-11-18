const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const createToken = require('../utils/createToken');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');

const router = express.Router();

// Cadastro básico de usuário comum.
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { name, email, password } = req.validated.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'USER' },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  res.status(201).json({ status: 201, message: 'Usuário cadastrado com sucesso.', data: user });
}));

// Login incluído para permitir testar as rotas administrativas.
router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ status: 401, message: 'E-mail ou senha incorretos.' });
  }

  const token = createToken(user);
  res.json({
    status: 200,
    message: 'Login realizado com sucesso.',
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }
  });
}));

module.exports = router;
