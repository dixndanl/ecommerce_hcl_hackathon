import { ZodError } from 'zod';

function formatZodError(error) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
}

export function validate({ body, query, params } = {}) {
  return (req, res, next) => {
    try {
      if (body) {
        const parsed = body.parse(req.body ?? {});
        req.body = parsed;
      }
      if (query) {
        const parsed = query.parse(req.query ?? {});
        req.query = parsed;
      }
      if (params) {
        const parsed = params.parse(req.params ?? {});
        req.params = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: 'ValidationError', details: formatZodError(err) });
      }
      return res.status(400).json({ error: 'ValidationError', details: err?.message || 'Invalid input' });
    }
  };
}


