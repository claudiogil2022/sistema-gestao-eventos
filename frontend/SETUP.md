# Event Manager Frontend

Este é o frontend da aplicação Event Manager, desenvolvido em Angular 20.

## Pré-requisitos

Para executar este projeto localmente, você precisa ter instalado:

### Opção 1: Instalação Local
- **Node.js** versão 18 ou superior
- **npm** (vem com o Node.js)
- **Angular CLI** versão 12 ou superior

### Opção 2: Docker
- **Docker**
- **Docker Compose**

## Instalação e Configuração

### Usando Node.js (Desenvolvimento Local)

1. **Instalar Node.js**
   - Baixe e instale o Node.js do site oficial: https://nodejs.org/
   - Escolha a versão LTS (18.x ou superior)

2. **Instalar Angular CLI globalmente**
   ```bash
   npm install -g @angular/cli
   ```

3. **Instalar dependências do projeto**
   ```bash
   cd frontend
   npm install
   ```

4. **Executar em modo de desenvolvimento**
   ```bash
   npm start
   ```
   ou
   ```bash
   ng serve
   ```

   A aplicação estará disponível em `http://localhost:4200`

5. **Build para produção**
   ```bash
   npm run build --configuration=production
   ```

### Usando Docker

1. **Instalar Docker Desktop**
   - Windows: https://docs.docker.com/desktop/install/windows/
   - Certifique-se de que o Docker está rodando

2. **Executar com Docker Compose (recomendado)**
   
   Na raiz do projeto (onde está o docker-compose.yml):
   ```bash
   docker-compose up --build
   ```

   A aplicação estará disponível em `http://localhost:4200`

3. **Executar apenas o frontend com Docker**
   ```bash
   cd frontend
   docker build -t event-manager-frontend .
   docker run -p 4200:80 event-manager-frontend
   ```

## Configuração da API

O frontend está configurado para se comunicar com a API backend:

- **Desenvolvimento**: `http://localhost:8080/api`
- **Produção**: `/api` (proxy através do nginx)

Se precisar alterar a URL da API, edite os arquivos:
- `src/environments/environment.ts` (desenvolvimento)
- `src/environments/environment.prod.ts` (produção)

## Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm test` - Executa os testes unitários
- `npm run watch` - Build em modo watch para desenvolvimento

## Estrutura do Projeto

```
src/
├── app/
│   ├── events/           # Módulo de eventos
│   │   ├── event-list/   # Componente de listagem
│   │   ├── event.ts      # Serviço e interface
│   │   └── ...
│   ├── app.ts            # Componente principal
│   ├── app-module.ts     # Módulo principal
│   └── app-routing-module.ts # Configuração de rotas
├── environments/         # Configurações de ambiente
└── ...
```

## Funcionalidades

- ✅ Listagem de eventos
- ✅ Visualização de detalhes
- ✅ Criação de eventos
- ✅ Edição de eventos
- ✅ Exclusão de eventos
- ✅ Interface responsiva com Bootstrap
- ✅ Angular Material components

## Tecnologias Utilizadas

- **Angular 20** - Framework principal
- **TypeScript** - Linguagem de programação
- **Bootstrap 5** - Framework CSS
- **Angular Material** - Componentes UI
- **RxJS** - Programação reativa
- **Nginx** - Servidor web (produção)

## Troubleshooting

### Erro "npm não é reconhecido"
- Instale o Node.js do site oficial
- Reinicie o terminal após a instalação

### Erro "ng não é reconhecido"
- Instale o Angular CLI: `npm install -g @angular/cli`
- Verifique se o Node.js está instalado corretamente

### Problemas de CORS
- Certifique-se de que o backend está configurado para aceitar requisições do frontend
- Verifique se as URLs da API estão corretas nos arquivos de environment

### Docker não funciona
- Verifique se o Docker Desktop está instalado e rodando
- No Windows, certifique-se de que a virtualização está habilitada no BIOS
