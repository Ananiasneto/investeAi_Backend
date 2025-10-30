# 📈 InvesteAi - Backend

API para simulação de operações na bolsa de valores brasileira (B3).

## 🚀 Link:deploy https://investeai-backend-1.onrender.com

## 🚀 Tecnologias Utilizadas

- **Node.js** (≥ 20.X LTS)
- **Express** 
- **TypeScript**
- **Prisma** (ORM)
- **PostgreSQL**
- **JWT** para autenticação
- **Jest** & **Supertest** para testes
- **Brapi API** para cotações em tempo real

## 📋 Pré-requisitos

- Node.js (≥ 18.X)
- PostgreSQL
- npm 

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <https://github.com/Ananiasneto/InvesteAi_Backend>
cd investeai-backend
```

### 2. Instale as dependências

```bash
npm install
```
### 3. Configure as variáveis de ambiente


DATABASE_URL="postgresql://usuario:senha@localhost:5432/investeai"
JWT_SECRET="sua-chave-secreta-jwt"
PORT=3000
NODE_ENV=development

###  4. Configure o banco de dados

```bash
# Gerar cliente do Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev

```
### 5. Execute o projeto

```bash
# Gerar cliente do Prisma
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start

```

🏗️ Arquitetura 
src/
├── index.ts              # Inicialização dos middlewares e rotas
├── server.ts             # Inicialização do servidor
├── router/               # Definição de rotas
│   ├── auth-router.ts
│   ├── operation-router.ts
│   ├── ative-router.ts
│   └── home-router.ts
├── controller/           # Controladores - lógica de requisições
├── service/              # Regras de negócio
├── repository/           #repositorios

## 🎯 Funcionalidades

### 💵 **APORTE**
Adiciona saldo à conta do investidor.

- 💰 **Limite máximo:** R$ 10.000,00 por operação  
- 🔄 Atualiza saldo disponível  

---

### 📈 **COMPRA**
Compra de ações listadas na **B3**.

- 🔍 Busca automática do valor atual via **Brapi API**  
- 📊 **Limite:** 1000 papéis por operação  
- ✅ Validação de saldo suficiente  
- 💼 Atualiza carteira e patrimônio  

---

### 📉 **VENDA**
Venda de ações da carteira do investidor.

- 🔎 Validação de quantidade disponível  
- 💵 Venda pelo valor atual de mercado  
- 🔄 Atualiza saldo e patrimônio  

---

## ⚙️ **Regras de Negócio**

- 💸 **Saldo inicial:** R$ 0,00  
- 💰 **Limite de aporte:** R$ 10.000,00  
- 📊 **Limite de compra:** 1000 papéis por operação  
- 📈 **Cálculo automático de lucro/prejuízo**  
- 🔠 **Ordenação de ativos por nome (A-Z)**  
- 🌐 **Integração em tempo real com B3 via Brapi API**  

