# Anotações Hibernate para Soft Delete

## 1. @SQLDelete + @Where (Implementado)

```java
@Entity
@SQLDelete(sql = "UPDATE events SET deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted = false")
public class Evento {
    // ...
}
```

**Vantagens:**
- Automático: ao chamar `repository.delete()`, executa UPDATE ao invés de DELETE
- Simples de implementar
- Funciona com todos os métodos padrão do repository

## 2. @SQLRestriction (Hibernate 6+)

```java
@Entity
@SQLDelete(sql = "UPDATE events SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class Evento {
    // Substitui @Where que foi depreciado
}
```

## 3. @Filter + @FilterDef (Mais flexível)

```java
@Entity
@FilterDef(name = "deletedEventFilter", parameters = @ParamDef(name = "isDeleted", type = Boolean.class))
@Filter(name = "deletedEventFilter", condition = "deleted = :isDeleted")
@SQLDelete(sql = "UPDATE events SET deleted = true WHERE id = ?")
public class Evento {
    // ...
}
```

**Como usar no Repository:**
```java
@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    
    @Modifying
    @Query("UPDATE Evento e SET e.deleted = false WHERE e.id = :id")
    void enableFilter(@Param("id") Long id);
}
```

## 4. @SoftDelete (Hibernate 6.4+) - Mais Recente

```java
@Entity
@SoftDelete(columnName = "deleted")
public class Evento {
    // O Hibernate gerencia automaticamente o soft delete
    // Não precisa do campo deleted explícito
}
```

## 5. Usando EntityListeners (JPA)

```java
@Entity
@EntityListeners(EventoEntityListener.class)
public class Evento {
    // ...
}

@Component
public class EventoEntityListener {
    
    @PreRemove
    public void preRemove(Evento evento) {
        evento.setDeleted(true);
        // Cancela o delete real
    }
}
```

## 6. Interceptor Hibernate (Avançado)

```java
@Component
public class SoftDeleteInterceptor implements Interceptor {
    
    @Override
    public boolean onDelete(Object entity, Serializable id, Object[] state, 
                           String[] propertyNames, Type[] types) {
        if (entity instanceof Evento) {
            ((Evento) entity).setDeleted(true);
            return true; // Cancela o delete
        }
        return false;
    }
}
```

## Recomendação

Para seu projeto, a **combinação @SQLDelete + @Where** (já implementada) é ideal porque:

1. ✅ **Simples**: Apenas 2 anotações
2. ✅ **Automático**: Funciona com `repository.delete()`
3. ✅ **Transparente**: Consultas automáticamente filtram registros deletados
4. ✅ **Compatível**: Funciona com todas as versões do Hibernate/Spring Data

## Testando a Implementação

```bash
# Antes: DELETE FROM events WHERE id = ?
# Agora: UPDATE events SET deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = ?
```

As consultas automáticamente adicionam `WHERE deleted = false` graças ao @Where.
