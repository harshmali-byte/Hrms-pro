export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export function assertFound(entity, label = "Resource") {
  if (!entity) throw new AppError(`${label} not found`, 404);
}
