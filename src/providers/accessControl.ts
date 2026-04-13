// src/providers/accessControl.ts
import { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const userStr = localStorage.getItem("sib-user-data");
    if (!userStr) return { can: false };

    const { role } = JSON.parse(userStr);

    // Estrategia por Rol
    switch (role) {
      case "ROLE_ADMIN":
        return { can: true };

      case "ROLE_USER":
        // El usuario puede hacer todo excepto borrar
        if (action === "delete") {
          return { can: false, reason: "No tienes permisos para eliminar" };
        }
        return { can: true };

      case "ROLE_GUEST":
        // Invitado solo lectura
        if (action === "list" || action === "show") {
          return { can: true };
        }
        return {
          can: false,
          reason: "Acceso de solo lectura para invitados",
        };

      default:
        return { can: false };
    }
  },
};