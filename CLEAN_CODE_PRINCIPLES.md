# Princípios do Clean Code - Guia Prático

## 📚 Principais Princípios de Robert C. Martin (Uncle Bob)

### 1. **Nomes Significativos**
- Use nomes que revelem a intenção
- Evite desinformação
- Faça distinções significativas
- Use nomes pronunciáveis e pesquisáveis

**❌ Ruim:**
```java
public class E {
    private String t;  // título
    private String d;  // descrição
    private LocalDateTime dt; // data/hora
    
    public void sv() { // save
        // código...
    }
}
```

**✅ Bom (Como seu código atual):**
```java
public class Evento {
    private String titulo;
    private String descricao;
    private LocalDateTime dataHoraEvento;
    
    public void salvarEvento() {
        // código...
    }
}
```

### 2. **Funções Pequenas**
- Funções devem ser pequenas (máximo 20 linhas)
- Façam apenas uma coisa
- Um nível de abstração por função

**✅ Exemplo do seu EventoService:**
```java
// Cada método faz apenas uma coisa
public Optional<EventoResponseDTO> buscarEventoPorId(Long id) {
    return eventoRepository.findById(id)
            .map(this::convertToResponseDTO);
}

public long getEventosCreatedCount() {
    return eventosCreatedCounter.get();
}
```

### 3. **Comentários Mínimos**
- Código bom é autodocumentado
- Comentários devem explicar "por que", não "o que"
- Evite comentários redundantes

**❌ Ruim:**
```java
// Incrementa o contador de eventos
eventosCreatedCounter.incrementAndGet();
```

**✅ Bom:**
```java
// Rastreia eventos criados desde o startup para métricas de performance
eventosCreatedCounter.incrementAndGet();
```

### 4. **Formatação Consistente**
- Indentação consistente
- Espaçamento padronizado
- Organização lógica do código

### 5. **Tratamento de Erros**
- Use exceções ao invés de códigos de erro
- Seja específico com as exceções
- Não ignore exceções

### 6. **Classes Pequenas**
- Responsabilidade única (SRP)
- Coesas
- Baixo acoplamento

### 7. **Sistemas**
- Separação de responsabilidades
- Arquitetura limpa
- Dependências gerenciadas

## 🔧 Aplicando Clean Code no Seu Projeto

### Análise do Código Atual

**✅ Pontos Fortes do seu código:**

1. **Nomes Significativos:**
   ```java
   private final AtomicLong eventosCreatedCounter;
   public Optional<EventoResponseDTO> buscarEventoPorId(Long id)
   ```

2. **Separação de Responsabilidades:**
   - `Entity`: Apenas dados e anotações
   - `Service`: Lógica de negócio
   - `Controller`: Interface REST
   - `Repository`: Acesso a dados

3. **Uso de Anotações Declarativas:**
   ```java
   @SQLDelete(sql = "UPDATE events SET deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
   @Where(clause = "deleted = false")
   ```

### 🚀 Melhorias Sugeridas

#### 1. **Extrair Constantes Mágicas**

**❌ Antes:**
```java
@Column(nullable = false, length = 100)
private String titulo;

@Column(nullable = false, length = 1000) 
private String descricao;
```

**✅ Depois:**
```java
public class Evento {
    public static final int TITULO_MAX_LENGTH = 100;
    public static final int DESCRICAO_MAX_LENGTH = 1000;
    public static final int LOCAL_MAX_LENGTH = 200;
    
    @Column(nullable = false, length = TITULO_MAX_LENGTH)
    private String titulo;

    @Column(nullable = false, length = DESCRICAO_MAX_LENGTH)
    private String descricao;
}
```

#### 2. **Extrair SQL Queries para Constantes**

```java
public class EventoEntity {
    private static final String SOFT_DELETE_SQL = 
        "UPDATE events SET deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    private static final String ACTIVE_RECORDS_WHERE = "deleted = false";
    
    @SQLDelete(sql = SOFT_DELETE_SQL)
    @Where(clause = ACTIVE_RECORDS_WHERE)
    public class Evento {
        // ...
    }
}
```

#### 3. **Validator Personalizado para Regras de Negócio**

```java
@Component
public class EventoValidator {
    
    public void validateEventDateTime(LocalDateTime dataHoraEvento) {
        if (dataHoraEvento.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                "Data do evento não pode ser no passado"
            );
        }
    }
    
    public void validateEventCapacity(Integer capacidade) {
        if (capacidade != null && capacidade <= 0) {
            throw new IllegalArgumentException(
                "Capacidade deve ser maior que zero"
            );
        }
    }
}
```

#### 4. **Factory Pattern para DTOs**

```java
@Component
public class EventoDTOFactory {
    
    public EventoResponseDTO createResponseDTO(Evento evento) {
        return EventoResponseDTO.builder()
                .id(evento.getId())
                .titulo(evento.getTitulo())
                .descricao(evento.getDescricao())
                .dataHoraEvento(evento.getDataHoraEvento())
                .local(evento.getLocal())
                .deleted(evento.isDeleted())
                .createdAt(evento.getCreatedAt())
                .updatedAt(evento.getUpdatedAt())
                .build();
    }
}
```

#### 5. **Enum para Status do Evento**

```java
public enum EventoStatus {
    ATIVO(false),
    DELETADO(true);
    
    private final boolean deleted;
    
    EventoStatus(boolean deleted) {
        this.deleted = deleted;
    }
    
    public boolean isDeleted() {
        return deleted;
    }
}
```

## 🏗️ Princípios SOLID Aplicados

### **S - Single Responsibility Principle (SRP)**
```java
// ✅ Cada classe tem uma responsabilidade
public class EventoController {    // Apenas controle HTTP
public class EventoService {       // Apenas lógica de negócio  
public class EventoRepository {    // Apenas acesso a dados
public class Evento {              // Apenas representação de dados
```

### **O - Open/Closed Principle (OCP)**
```java
// ✅ Aberto para extensão, fechado para modificação
public interface NotificationService {
    void sendNotification(String message);
}

public class EmailNotificationService implements NotificationService {
    public void sendNotification(String message) { /* implementação */ }
}

public class SmsNotificationService implements NotificationService {
    public void sendNotification(String message) { /* implementação */ }
}
```

### **L - Liskov Substitution Principle (LSP)**
```java
// ✅ Subtipos devem ser substituíveis por seus tipos base
public abstract class EventoProcessor {
    public abstract void process(Evento evento);
}

public class EventoEmailProcessor extends EventoProcessor {
    public void process(Evento evento) { /* enviar email */ }
}
```

### **I - Interface Segregation Principle (ISP)**
```java
// ✅ Interfaces específicas ao invés de uma grande interface
public interface EventoReader {
    Optional<Evento> findById(Long id);
    List<Evento> findAll();
}

public interface EventoWriter {
    Evento save(Evento evento);
    void delete(Long id);
}
```

### **D - Dependency Inversion Principle (DIP)**
```java
// ✅ Dependa de abstrações, não de implementações
public class EventoService {
    private final EventoRepository repository;  // Interface, não implementação
    private final NotificationService notification;  // Interface
    
    public EventoService(EventoRepository repository, 
                        NotificationService notification) {
        this.repository = repository;
        this.notification = notification;
    }
}
```

## 📊 Métricas de Clean Code

### **Complexidade Ciclomática**
- Máximo 10 por método
- Prefira 1-4 para melhor legibilidade

### **Cobertura de Testes**
- Mínimo 80%
- 100% para código crítico

### **Linhas por Método**
- Máximo 20 linhas
- Prefira 5-10 linhas

### **Dependências por Classe**
- Máximo 7 dependências
- Prefira 3-5 dependências

## 🧪 Testes Limpos

```java
@Test
@DisplayName("Deve incrementar contador ao criar evento")
void deveIncrementarContadorAoCriarEvento() {
    // Given (Arrange)
    EventoRequestDTO request = createValidEventoRequest();
    long contadorInicial = eventoService.getEventosCreatedCount();
    
    // When (Act)
    eventoService.criarEvento(request);
    
    // Then (Assert)
    long contadorFinal = eventoService.getEventosCreatedCount();
    assertThat(contadorFinal).isEqualTo(contadorInicial + 1);
}

private EventoRequestDTO createValidEventoRequest() {
    return EventoRequestDTO.builder()
            .titulo("Evento Teste")
            .descricao("Descrição do evento")
            .dataHoraEvento(LocalDateTime.now().plusDays(1))
            .local("Local do evento")
            .build();
}
```

## 🎯 Checklist de Clean Code

### ✅ **Nomes**
- [ ] Nomes revelam intenção
- [ ] Nomes são pronunciáveis
- [ ] Nomes são pesquisáveis
- [ ] Evitam desinformação

### ✅ **Funções**
- [ ] Fazem apenas uma coisa
- [ ] São pequenas (< 20 linhas)
- [ ] Têm poucos parâmetros (< 3)
- [ ] Não têm efeitos colaterais

### ✅ **Classes**
- [ ] Têm responsabilidade única
- [ ] São coesas
- [ ] Têm baixo acoplamento
- [ ] Seguem convenções de nomenclatura

### ✅ **Comentários**
- [ ] Explicam "por que", não "o que"
- [ ] São precisos e atualizados
- [ ] Não são redundantes
- [ ] Adicionam valor real

### ✅ **Formatação**
- [ ] Indentação consistente
- [ ] Espaçamento padronizado
- [ ] Organização lógica
- [ ] Linhas curtas (< 120 caracteres)

### ✅ **Tratamento de Erros**
- [ ] Usa exceções específicas
- [ ] Não ignora exceções
- [ ] Falha rápido
- [ ] Mensagens de erro claras

## 🚀 Ferramentas Recomendadas

### **Análise Estática:**
- **SonarQube**: Qualidade de código
- **SpotBugs**: Detecção de bugs
- **PMD**: Regras de código
- **Checkstyle**: Formatação

### **IDEs e Plugins:**
- **IntelliJ IDEA**: Inspeções automáticas
- **SonarLint**: Análise em tempo real
- **Save Actions**: Formatação automática

### **Métricas:**
- **JaCoCo**: Cobertura de testes
- **JDepend**: Análise de dependências
- **Metrics**: Complexidade ciclomática

## 📖 Livros Recomendados

1. **"Clean Code"** - Robert C. Martin
2. **"Clean Architecture"** - Robert C. Martin  
3. **"Refactoring"** - Martin Fowler
4. **"Design Patterns"** - Gang of Four
5. **"Effective Java"** - Joshua Bloch

---

## 💡 Resumo dos Benefícios

### **Clean Code resulta em:**
- ✅ **Menor custo de manutenção**
- ✅ **Menos bugs em produção**
- ✅ **Desenvolvimento mais rápido**
- ✅ **Código mais testável**
- ✅ **Melhor colaboração em equipe**
- ✅ **Facilita refatoração**
- ✅ **Reduz dívida técnica**
