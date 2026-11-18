function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return res.status(422).json({
        status: 422,
        message: 'Dados inválidos.',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'request',
          message: issue.message
        }))
      });
    }

    req.validated = result.data;
    next();
  };
}

module.exports = validate;
