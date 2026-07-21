export interface JWTPayload {
  userId: string;
  organizationId: string;
  email: string;
}

// Hono context variables set by middleware
export type AppVariables = {
  user: JWTPayload;
};
