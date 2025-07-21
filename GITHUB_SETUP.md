# 🐙 Instruções para Criar Repositório GitHub

## 📋 Passos para Publicar o Projeto

### 1. Criar Repositório no GitHub.com

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"** (botão verde)
3. Configure o repositório:
   ```
   Repository name: sistema-gestao-eventos
   Description: 🎯 Sistema completo de gestão de eventos com Spring Boot 3.3.1, Bootstrap 5.3.2 e PostgreSQL
   ☑️ Public
   ☐ Add a README file (já temos um)
   ☐ Add .gitignore (já temos um)
   ☐ Choose a license (já temos MIT)
   ```
4. Clique em **"Create repository"**

### 2. Conectar Repositório Local ao GitHub

Execute os comandos no terminal do projeto:

```powershell
# PASSO 1: Substitua SEU_USERNAME pelo seu usuário real do GitHub
# Exemplo: se seu usuário é "joaosilva", use:
# git remote add origin https://github.com/joaosilva/sistema-gestao-eventos.git

# Adicionar o remote origin (SUBSTITUA SEU_USERNAME)
git remote add origin https://github.com/claudiogil2022/sistema-gestao-eventos.git

# Verificar se o remote foi adicionado
git remote -v

# Push inicial do master
git push -u origin master

# Push de todas as feature branches
git push origin feature/backend-spring-boot
git push origin feature/frontend-bootstrap
git push origin feature/docker-infrastructure  
git push origin feature/audit-fields

# Push de todas as tags
git push origin --tags
```

### 3. Verificar Upload no GitHub

Após o push, verifique se apareceu no seu GitHub:
- ✅ Branch `master` com todos os commits
- ✅ 4 feature branches preservadas
- ✅ Tags `v1.0.0`, `v1.1.0` e `v1.2.0`
- ✅ README.md renderizado na página inicial
- ✅ Todos os arquivos do projeto

### 4. Configurar Repositório (Opcional)

#### 4.1 Configurar Branch Protection
No GitHub, vá em **Settings > Branches**:
```
Branch name pattern: master
☑️ Require a pull request before merging
☑️ Require status checks to pass before merging  
☑️ Require branches to be up to date before merging
☑️ Include administrators
```

#### 4.2 Configurar Issues e PR Templates
Criar arquivo `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
## 📋 Descrição
Breve descrição das mudanças

## 🎯 Tipo de Mudança
- [ ] 🐛 Bug fix
- [ ] ✨ Nova feature
- [ ] 📚 Documentação
- [ ] 🔧 Configuração

## ✅ Checklist
- [ ] Código testado
- [ ] Documentação atualizada
- [ ] Commits seguem padrão
```

#### 4.3 Configurar GitHub Pages (Para documentação)
**Settings > Pages**:
```
Source: Deploy from a branch
Branch: master
Folder: / (root)
```

### 5. Comandos Úteis Pós-Setup

```powershell
# Ver histórico completo
git log --oneline --graph --all

# Ver tags
git tag -l

# Ver branches remotas
git branch -r

# Ver status do repositório
git status

# Ver commits de uma feature
git log feature/backend-spring-boot --oneline
```

## �️ Troubleshooting

### ❌ Erro: "repository not found"
```
fatal: repository 'https://github.com/SEU_USERNAME/sistema-gestao-eventos.git/' not found
```

**Soluções:**
1. **Verifique se substituiu SEU_USERNAME** pelo seu usuário real do GitHub
2. **Verifique se o repositório foi criado** no GitHub.com
3. **Verifique se o nome está correto**: `sistema-gestao-eventos`

**Comandos para corrigir:**
```powershell
# Remover remote incorreto
git remote remove origin

# Adicionar com nome correto (exemplo: joaosilva)
git remote add origin https://github.com/joaosilva/sistema-gestao-eventos.git

# Tentar push novamente
git push -u origin master
```

### ❌ Erro: "Permission denied"
Se receber erro de permissão, configure autenticação:

**Opção 1 - Token Personal (Recomendado):**
1. GitHub.com > Settings > Developer settings > Personal access tokens
2. Generate new token com permissões de repo
3. Use o token como senha no push

**Opção 2 - SSH Key:**
```powershell
# Gerar nova chave SSH
ssh-keygen -t ed25519 -C "seu.email@example.com"

# Adicionar ao SSH agent
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública e adicionar no GitHub
cat ~/.ssh/id_ed25519.pub

# Usar URL SSH em vez de HTTPS
git remote set-url origin git@github.com:SEU_USERNAME/sistema-gestao-eventos.git
```

### 🔍 Verificar Configuração
```powershell
# Verificar remote configurado
git remote -v

# Verificar status
git status

# Verificar branches
git branch -a

# Verificar tags
git tag -l
```

## �📊 Resultado Final Esperado

Seu repositório GitHub deve mostrar:

```
📁 sistema-gestao-eventos
├── 📋 README.md (com badges e instruções)
├── 🐳 docker-compose.yml (orquestração)
├── 📄 LICENSE (MIT)
├── 📝 GIT_WORKFLOW.md (este workflow)
├── 📁 backend/ (Spring Boot)
├── 📁 frontend/ (Bootstrap SPA)
├── 📁 scripts/ (PowerShell e dados)
└── 📚 docs/ (DATABASE_SCHEMA.md, etc.)

🌳 Branches:
├── master (principal)
├── feature/backend-spring-boot
├── feature/frontend-bootstrap  
├── feature/docker-infrastructure
└── feature/audit-fields

🏷️ Releases:
├── v1.0.0 (sistema completo)
├── v1.1.0 (primeira atualização)
└── v1.2.0 (documentação Git)
```

## 🎉 Pronto!

Após seguir estes passos, você terá um repositório GitHub profissional demonstrando:

- ✅ **Git Flow** com feature branches e merges organizados
- ✅ **Commits Atômicos** com mensagens convencionais  
- ✅ **Pull Requests** simulados com histórico preservado
- ✅ **Release Management** com tags versionadas
- ✅ **Documentação Completa** para desenvolvedores
- ✅ **Projeto Full-Stack** pronto para produção

**🚀 Seu portfólio agora tem um exemplo profissional de Git workflow em ação!**
