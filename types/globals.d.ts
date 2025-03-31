export {};

// Create a type for the roles
export type Roles = "owner" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
