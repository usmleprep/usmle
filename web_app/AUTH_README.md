# Sistema de Autenticação via Supabase

Este sistema utiliza o Supabase para gerenciar o acesso à aplicação. Apenas e-mails cadastrados na tabela `authorized_users` podem acessar o sistema.

## Como Gerenciar Usuários

O gerenciamento de usuários é feito diretamente no painel do Supabase.

### Adicionar Novo Usuário

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com/dashboard).
2. Vá para o **Table Editor** e selecione a tabela `authorized_users`.
3. Clique em **Insert row**.
4. Preencha os campos:
   - `email`: O e-mail do usuário (ex: `usuario@exemplo.com`)
   - `active`: `true` (marcado)
   - `expires_at`: (Opcional) Data de expiração do acesso. Deixe em branco para acesso permanente.
5. Clique em **Save**.

### Remover/Desativar Usuário

1. No Table Editor, encontre o usuário na tabela `authorized_users`.
2. Para desativar temporariamente:
   - Edite a linha e desmarque a opção `active` (`false`).
3. Para remover permanentemente:
   - Selecione a linha e clique em **Delete**.

## Configuração do Banco de Dados

A tabela `authorized_users` deve ter a seguinte estrutura:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | Identificador único (Primary Key) |
| `email` | text | E-mail do usuário (Unique) |
| `active` | boolean | Se o usuário está ativo (Default: true) |
| `created_at` | timestamptz | Data de criação |
| `expires_at` | timestamptz | Data de expiração (Nullable) |

## Segurança

- ✅ **Validação em Tempo Real**: O login verifica diretamente no banco de dados.
- ✅ **Revogação Imediata**: Se você desativar um usuário no Supabase, ele perderá o acesso no próximo login ou revalidação.
- ✅ **Logs**: O Supabase mantém logs de acesso ao banco de dados.

## Variáveis de Ambiente

Para que o sistema funcione, as seguintes variáveis de ambiente (Secrets) devem estar configuradas no GitHub:

- `VITE_SUPABASE_URL`: A URL do seu projeto Supabase.
- `VITE_SUPABASE_ANON_KEY`: A chave pública (anon) do seu projeto.
