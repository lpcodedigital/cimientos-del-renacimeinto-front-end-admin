export const i18nProvider = {
    translate: (key: string, params: any, defaultMessage?: string) => {
        const translations: Record<string, string> = {
            // Login & Auth
            "pages.login.signin": "Iniciar Sesión",
            "pages.login.fields.email": "Correo electrónico",
            "pages.login.fields.password": "Contraseña",
            "pages.login.fields.rememberMe": "Recordarme",
            "pages.login.title": "Ingreso SIB",
            "pages.login.buttons.forgotPassword": "¿Olvidaste tu contraseña?",
            "pages.login.buttons.noAccount": "¿No tienes cuenta?",
            "pages.login.buttons.signup": "Registrarse",

            // Botones y Acciones Globales (Cruciales)
            "buttons.create": "Crear Nuevo",
            "buttons.save": "Guardar",
            "buttons.edit": "Editar",
            "buttons.delete": "Eliminar",
            "buttons.cancel": "Cancelar",
            "buttons.logout": "Cerrar Sesión",
            "buttons.show": "Ver Detalle",
            "buttons.refresh": "Actualizar",
            "buttons.list": "Volver a la lista", // Llave estándar
            "buttons.back": "Volver",

            // Títulos de Páginas (Esto quita los puntos tipo obra.titles.list)
            "obra.titles.list": "Lista de Obras Públicas",
            "obra.titles.show": "Detalle de Obra",
            "obra.titles.create": "Nueva Obra",
            "obra.titles.edit": "Editar Obra",

            "curso.titles.list": "Lista de Cursos",
            "curso.titles.show": "Detalle del Curso",
            "curso.titles.create": "Nuevo Curso",
            "curso.titles.edit": "Editar Curso",

            "user.titles.list": "Lista de Usuarios",
            "user.titles.show": "Detalle del Usuario",
            "user.titles.create": "Nuevo Usuario",
            "user.titles.edit": "Editar Usuario",

            // Nombres de Recursos (Refine los usa para construir los botones de "Volver a Obras")
            "obras": "Obras",
            "cursos": "Cursos",
            "users": "Usuarios",

            // Específicos para botones que a veces piden el nombre del recurso
            "obra.obra": "Obras",
            "curso.curso": "Cursos",
            "user.user": "Usuarios",

            // Notificaciones y Tablas
            "notifications.success": "Éxito",
            "notifications.error": "Error",
            "table.actions": "Acciones",
            "info.noData": "No hay registros disponibles",
            "dashboard.title": "Panel Principal",
            "undefined.undefined": "CR Admin",

            // Dashboard / Inicio
            "inicio.titles.list": "Dashboard", // Esto corregirá el inicio.inicio.list
            "inicio.inicio": "Panel Principal",

            // Por si acaso Refine busca el nombre del recurso solo
            "inicio": "Inicio",

        };

        if (!translations[key]) {
            console.log("Refine busca esta llave:", key); // <--- Esto te dirá el nombre exacto en la consola (F12)
        }

        // Retorna la traducción o la llave si no existe
        return translations[key] || defaultMessage || key;
    },

    changeLocale: (lang: string) => Promise.resolve(),
    getLocale: () => "es",
};