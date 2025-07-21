# 🏗️ Arquitetura Modular Angular - Event Manager

## 📋 **Visão Geral da Arquitetura**

Este projeto segue as **melhores práticas do Angular** para projetos empresariais, implementando uma arquitetura modular bem estruturada com separação clara de responsabilidades.

## 📁 **Estrutura de Módulos**

```
src/app/
├── core/                    # Módulo Core (Singleton)
│   ├── models/             # Interfaces e tipos
│   ├── services/           # Serviços singleton
│   ├── interceptors/       # HTTP Interceptors
│   ├── guards/             # Route Guards
│   └── core.module.ts      # Core Module
│
├── shared/                 # Módulo Shared (Reutilizável)
│   ├── components/         # Componentes compartilhados
│   ├── directives/         # Diretivas compartilhadas
│   ├── pipes/             # Pipes compartilhados
│   └── shared.module.ts    # Shared Module
│
├── features/               # Feature Modules
│   └── events/            # Módulo de Eventos
│       ├── components/     # Componentes específicos
│       ├── pages/         # Páginas/Containers
│       ├── services/      # Serviços de feature
│       └── events.module.ts # Events Module
│
├── app.ts                 # Componente principal
├── app-module.ts          # App Module
└── app-routing-module.ts  # Roteamento principal
```

## 🔧 **Core Module**

### **Responsabilidades:**
- Serviços singleton da aplicação
- HTTP Interceptors
- Route Guards
- Modelos de dados globais
- Configurações centrais

### **Componentes:**

#### **Models:**
- `evento.model.ts` - Interface principal do Evento
- `api.model.ts` - Modelos de resposta da API

#### **Services:**
- `evento.service.ts` - Serviço HTTP para operações CRUD
- `loading.service.ts` - Controle de loading global
- `notification.service.ts` - Serviço de notificações

#### **Interceptors:**
- `loading.interceptor.ts` - Loading automático em requisições
- `error.interceptor.ts` - Tratamento global de erros

#### **Guards:**
- `auth.guard.ts` - Proteção de rotas (placeholder)

### **Características:**
- ✅ Importado apenas no `AppModule`
- ✅ Proteção contra múltiplas importações
- ✅ Serviços `providedIn: 'root'`

## 🔄 **Shared Module**

### **Responsabilidades:**
- Componentes reutilizáveis
- Pipes customizados
- Diretivas compartilhadas
- Módulos Angular Material
- Utilitários comuns

### **Componentes:**
- `LoadingComponent` - Spinner de carregamento
- `ErrorMessageComponent` - Exibição de erros
- `ConfirmationDialogComponent` - Diálogos de confirmação

### **Pipes:**
- `TruncatePipe` - Truncar texto
- `EventoStatusPipe` - Formatação de status

### **Características:**
- ✅ Importado por feature modules
- ✅ Exporta componentes standalone
- ✅ Inclui Angular Material modules

## 🎯 **Feature Module (Events)**

### **Responsabilidades:**
- Funcionalidades específicas de eventos
- Lazy loading
- Roteamento específico
- Lógica de negócio isolada

### **Estrutura:**
```
features/events/
├── components/            # Componentes reutilizáveis do domínio
├── pages/                # Páginas/Containers
│   └── event-list/       # Listagem de eventos
├── services/             # Serviços específicos
│   └── events-facade.service.ts # Facade service
├── events-routing.module.ts # Rotas do módulo
└── events.module.ts      # Events Module
```

### **Pages:**
- `EventListComponent` - Listagem com paginação
- `EventFormComponent` - Formulário de criação/edição
- `EventDetailComponent` - Visualização detalhada

### **Services:**
- `EventsFacadeService` - Facade para operações de eventos

### **Características:**
- ✅ Lazy loading configurado
- ✅ Roteamento filho independente
- ✅ Componentes standalone
- ✅ Facade pattern para encapsular lógica

## 🚀 **Benefícios da Arquitetura**

### **1. Separação de Responsabilidades**
- **Core**: Funcionalidades centrais e singleton
- **Shared**: Componentes reutilizáveis
- **Features**: Lógica de negócio específica

### **2. Escalabilidade**
- Facilita adição de novos módulos
- Código organizado e previsível
- Manutenção simplificada

### **3. Performance**
- Lazy loading de feature modules
- Tree shaking otimizado
- Bundle splitting automático

### **4. Testabilidade**
- Injeção de dependências clara
- Mocks facilitados
- Testes isolados por módulo

### **5. Reutilização**
- Componentes shared reutilizáveis
- Serviços centralizados
- Pipes e diretivas compartilhados

## 📦 **Lazy Loading**

### **Configuração:**
```typescript
const routes: Routes = [
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule)
  }
];
```

### **Benefícios:**
- ✅ Carregamento sob demanda
- ✅ Menor bundle inicial
- ✅ Melhor performance

## 🔒 **Padrões Implementados**

### **1. Facade Pattern**
- `EventsFacadeService` encapsula operações complexas
- Interface simplificada para componentes

### **2. Singleton Pattern**
- Core services são singleton
- Estado global centralizado

### **3. Module Pattern**
- Organização por responsabilidade
- Encapsulamento de funcionalidades

### **4. Observer Pattern**
- RxJS para comunicação reativa
- Observables para dados dinâmicos

## 🛠️ **Como Adicionar Novos Módulos**

### **1. Feature Module:**
```bash
ng generate module features/nova-feature --routing
ng generate service features/nova-feature/services/nova-feature-facade
ng generate component features/nova-feature/pages/lista --standalone
```

### **2. Shared Component:**
```bash
ng generate component shared/components/novo-componente --standalone
```

### **3. Core Service:**
```bash
ng generate service core/services/novo-service
```

## 📚 **Referências e Best Practices**

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Architecture Patterns](https://angular.io/guide/architecture)
- [Feature Modules](https://angular.io/guide/feature-modules)
- [Lazy Loading](https://angular.io/guide/lazy-loading-ngmodules)

---

**🎯 Esta arquitetura segue as melhores práticas para projetos Angular enterprise, garantindo escalabilidade, manutenibilidade e performance otimizada.**
