# Movimento — Diário de Prática

Projeto completo com frontend e backend para registro de treinos e exercícios.

## Estrutura

```
movimento-projeto/
├── academia-backend/    # API Node.js + Express + MongoDB
└── academia-frontend/   # Frontend HTML/CSS/JS (tema Movimento)
```

## Como rodar

### Backend

1. Acesse a pasta do backend:
   ```bash
   cd academia-backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` com base no `.env.example`:
   ```
   MONGODB_URI=sua_string_de_conexao_mongodb
   PORT=3000
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```
   Ou com hot-reload:
   ```bash
   npm run dev
   ```

### Frontend

1. No arquivo `academia-frontend/app.js`, atualize a `BASE_URL` com a URL do seu backend:
   ```js
   const BASE_URL = 'http://localhost:3000';
   ```

2. Abra o `index.html` no navegador, ou sirva com qualquer servidor estático.

## Deploy

O backend inclui `render.yaml` para deploy fácil no [Render.com](https://render.com).
