.PHONY: install start stop dev setup db-push seed clean help migrate-deploy

# Cores para output
YELLOW=\033[1;33m
NC=\033[0m # No Color
GREEN=\033[0;32m
RED=\033[0;31m

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-30s$(NC) %s\n", $$1, $$2}'

install: ## Instala todas as dependências do projeto
	@echo "$(GREEN)Instalando dependências...$(NC)"
	npm install

start: ## Inicia o container do PostgreSQL e o servidor de desenvolvimento
	@echo "$(GREEN)Iniciando o PostgreSQL...$(NC)"
	docker compose up -d
	@echo "$(GREEN)Iniciando o servidor de desenvolvimento...$(NC)"
	npm run dev

stop: ## Para o container do PostgreSQL
	@echo "$(RED)Parando o PostgreSQL...$(NC)"
	docker compose down

dev: ## Inicia apenas o servidor de desenvolvimento
	@echo "$(GREEN)Iniciando o servidor de desenvolvimento...$(NC)"
	npm run dev

setup: install ## Configura o projeto do zero (instala dependências e configura banco)
	@echo "$(GREEN)Configurando o banco de dados...$(NC)"
	make db-push
	make seed

db-push: ## Atualiza o banco de dados com o schema do Prisma
	@echo "$(GREEN)Atualizando o banco de dados...$(NC)"
	npx prisma db push

migrate-deploy: ## Aplica migrações em produção
	@echo "$(GREEN)Aplicando migrações...$(NC)"
	npx prisma migrate deploy

seed: ## Executa o seed para popular o banco de dados
	@echo "$(GREEN)Populando o banco de dados...$(NC)"
	npx prisma db seed

clean: stop ## Remove módulos node e limpa caches
	@echo "$(RED)Limpando o projeto...$(NC)"
	rm -rf node_modules
	rm -rf .next
	docker compose down -v