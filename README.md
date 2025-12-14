# Deusanagatoro - Pérolas da Call

Este projeto é uma aplicação web estática construída com React e CSS moderno.

## Como fazer Deploy na Vercel

O projeto está pronto para ser hospedado na Vercel. Siga os passos abaixo:

### Opção 1: Via GitHub (Recomendado)
1. Crie um repositório no GitHub e suba este código.
2. Acesse [vercel.com](https://vercel.com) e faça login.
3. Clique em "Add New..." -> "Project".
4. Selecione o repositório do GitHub.
5. Clique em "Deploy". A Vercel detectará automaticamente que é um site estático.

### Opção 2: Drag & Drop
1. Acesse o dashboard da Vercel.
2. Se você tiver a Vercel CLI instalada, pode rodar `vercel` no terminal desta pasta.
3. Caso contrário, use a integração com Git descrita acima.

## Estrutura do Projeto
- `index.html`: Arquivo principal.
- `css/`: Estilos CSS.
- `js/`: Lógica da aplicação dividida em componentes.
- `api/`: Funções Serverless para conectar ao Banco de Dados.

## Variáveis de Ambiente (Neon DB)

Para que o banco de dados funcione, você precisa garantir que a variável de ambiente `DATABASE_URL` esteja configurada no painel da Vercel.

Se você utilizou a aba "Storage" da Vercel para adicionar o Neon, isso já deve estar configurado automaticamente.
