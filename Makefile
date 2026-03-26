# ==============================================
# 🚀 Makefile Profesional - Cimientos Admin (Refine)
# ==============================================

# 🧱 Variables de configuración
SERVICE          := cr-admin
IMAGE_NAME       := cimientos-admin
COMPOSE_BASE     := docker-compose.yml
COMPOSE_DEV      := docker-compose.override.yml

# 🎨 Colores para los mensajes
GREEN   := \033[0;32m
YELLOW  := \033[1;33m
BLUE    := \033[1;34m
RED     := \033[1;31m
RESET   := \033[0m

# ==============================================
# 🧩 Funciones internas
# ==============================================

check-docker:
	@command -v docker > /dev/null 2>&1 || (echo "$(RED)❌ Docker no está instalado.$(RESET)" && exit 1)
	@docker info > /dev/null 2>&1 || (echo "$(RED)❌ Docker no está corriendo.$(RESET)" && exit 1)

# ==============================================
# 🔧 Comandos principales
# ==============================================

# 🧩 Desarrollo (Vite Dev Server, Hot Reload, Puerto 5174)
dev: check-docker
	@echo "$(BLUE)🚧 Iniciando entorno de DESARROLLO (Refine)...$(RESET)"
	@docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) up --build

# 🚀 PRODUCCIÓN TOTAL: Un solo comando para todo el flujo
# Al poner los nombres después de 'prod:', le decimos a Make que los ejecute en orden.
prod: check-docker clean-local build-local prune-docker up-prod

clean-local:
	@echo "$(YELLOW)🧹 1. Limpiando build anterior y caché de yarn...$(RESET)"
	@rm -rf dist
	@yarn cache clean

build-local:
	@echo "$(BLUE)📦 2. Generando build de producción en la Mac...$(RESET)"
	@yarn build

prune-docker:
	@echo "$(RED)🧼 3. Limpiando caché de construcción de Docker...$(RESET)"
	@docker builder prune -f

up-prod:
	@echo "$(YELLOW)🏗️ 4. Construyendo imagen y levantando contenedor de PRODUCCIÓN...$(RESET)"
	@export DOCKER_BUILDKIT=1; \
	docker compose -f $(COMPOSE_BASE) build --no-cache --build-arg VITE_API_URL=http://localhost:8081/api/v1 cr-admin
	@docker compose -f $(COMPOSE_BASE) up -d cr-admin
	@echo "$(GREEN)✨ ¡Todo listo! Admin disponible en http://localhost:3001 $(RESET)"

# 🔄 Reiniciar servicios
restart: stop dev

# 🛑 Detener contenedores
stop:
	@echo "$(RED)🛑 Deteniendo contenedores...$(RESET)"
	@docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) stop

# 🧹 Limpiar todo (contenedores y volúmenes)
down:
	@echo "$(RED)🗑️ Eliminando contenedores y redes...$(RESET)"
	@docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_DEV) down

# 🧼 Limpieza profunda (imágenes huérfanas y caché)
clean:
	@echo "$(RED)⚠️ Limpieza profunda de Docker...$(RESET)"
	@docker compose down --rmi all --volumes --remove-orphans

# 📋 Ver logs
logs:
	@docker compose logs -f $(SERVICE)

# 🧪 Entrar al contenedor (Shell)
shell:
	@docker exec -it $(SERVICE) sh

# ==============================================
# 📘 Ayuda
# ==============================================
help:
	@echo ""
	@echo "$(GREEN)📘 Comandos disponibles para Admin:$(RESET)"
	@echo ""
	@echo "$(YELLOW)make dev$(RESET)       - Levanta Refine en modo desarrollo"
	@echo "$(YELLOW)make prod$(RESET)      - Flujo completo: Limpieza + Build Mac + Docker Prod"
	@echo "$(YELLOW)make stop$(RESET)      - Detiene los contenedores"
	@echo "$(YELLOW)make logs$(RESET)      - Muestra logs en tiempo real"
	@echo "$(YELLOW)make down$(RESET)      - Elimina contenedores y redes"
	@echo ""