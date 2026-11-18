function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === 'P2002') {
    return res.status(409).json({ status: 409, message: 'Já existe um cadastro com esse e-mail.' });
  }

  if (error.code === 'P2003') {
    return res.status(409).json({ status: 409, message: 'Não foi possível concluir a operação por causa de um relacionamento existente.' });
  }

  console.error(error);
  return res.status(500).json({ status: 500, message: 'Erro interno do servidor.' });
}

module.exports = errorHandler;
