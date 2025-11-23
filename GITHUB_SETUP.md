# Instruções para Criar o Repositório no GitHub

Como o GitHub CLI não está instalado, você precisa criar o repositório manualmente:

## Opção 1: Via Interface Web do GitHub

1. **Acesse GitHub**
   - Vá para https://github.com/new
   - Faça login se necessário

2. **Configure o Repositório**
   - Repository name: `USMLE-questions`
   - Description: "USMLE Question Bank with Supabase Authentication"
   - Visibility: Public
   - **NÃO** marque "Initialize this repository with a README"
   - Click "Create repository"

3. **Conecte o Repositório Local**
   Execute estes comandos no terminal:
   ```bash
   git remote add origin https://github.com/SEU-USERNAME/USMLE-questions.git
   git branch -M main
   git push -u origin main
   ```

## Opção 2: Instalar GitHub CLI (Recomendado)

1. **Instale o GitHub CLI**
   - Baixe de: https://cli.github.com/
   - Ou use: `winget install --id GitHub.cli`

2. **Autentique**
   ```bash
   gh auth login
   ```

3. **Crie o Repositório**
   ```bash
   gh repo create USMLE-questions --public --source=. --remote=origin --push
   ```

---

## Status Atual

✅ Git inicializado
✅ Arquivos adicionados ao staging
✅ Commit criado localmente
✅ Configuração do Git definida
⏳ Aguardando criação do repositório no GitHub

## Próximos Passos Após Criar o Repositório

1. **Configurar GitHub Pages**
   - Settings → Pages
   - Source: "GitHub Actions"

2. **Adicionar Secrets**
   - Settings → Secrets and variables → Actions
   - Add: `VITE_SUPABASE_URL`
   - Add: `VITE_SUPABASE_ANON_KEY`

3. **Verificar Deploy**
   - Actions tab → Aguardar build
   - Site estará em: `https://SEU-USERNAME.github.io/USMLE-questions/`
