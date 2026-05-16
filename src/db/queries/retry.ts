function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function isRetryableDatabaseError(error: unknown) {
  const message = getErrorMessage(error);
  const cause = error instanceof Error ? error.cause : undefined;
  const causeMessage = cause instanceof Error ? cause.message : "";

  return `${message} ${causeMessage}`.includes("fetch failed");
}

export async function retryDatabaseRead<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (!isRetryableDatabaseError(error)) {
      throw error;
    }
  }

  return operation();
}

export function getDatabaseErrorMessage(error: unknown) {
  return getErrorMessage(error instanceof Error && error.cause instanceof Error ? error.cause : error);
}
