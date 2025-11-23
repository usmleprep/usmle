# Sistema de Autenticação por E-mail

Este sistema permite que apenas usuários com e-mails autorizados acessem a aplicação.

## Como Adicionar Novos Usuários

1. Abra o arquivo: `src/config/authorizedEmails.js`

2. Adicione o e-mail do novo usuário à lista `authorizedEmails`:

```javascript
export const authorizedEmails = [
    'example@email.com',
    'user@example.com',
    'novousuario@email.com',  // ← Adicione aqui
    // Adicione mais e-mails aqui
];
```

3. Faça commit e push das mudanças:

```bash
git add src/config/authorizedEmails.js
git commit -m "Add new authorized user"
git push
```

4. Aguarde o deploy automático (2-5 minutos)

## Como Remover Usuários

1. Abra `src/config/authorizedEmails.js`
2. Remova ou comente o e-mail da lista
3. Faça commit e push

## Características

- ✅ **Case-insensitive**: `User@Email.com` = `user@email.com`
- ✅ **Validação de formato**: Verifica se é um e-mail válido
- ✅ **Sessão persistente**: Usuário permanece logado até fazer logout
- ✅ **Logout manual**: Botão de logout no dashboard
- ✅ **Validação na inicialização**: Verifica se o e-mail ainda está autorizado ao carregar o app

## Segurança

⚠️ **Importante**: Esta é uma solução básica de controle de acesso. A lista de e-mails autorizados está no código-fonte e pode ser vista por qualquer pessoa que inspecione o código JavaScript.

Para maior segurança, considere:
- Implementar autenticação com backend
- Usar serviços como Firebase Authentication ou Auth0
- Adicionar autenticação de dois fatores (2FA)

## Estrutura de Dados

### localStorage
- `usmle_authenticated`: `'true'` se autenticado
- `usmle_user_email`: E-mail do usuário logado
- `usmle_session_time`: Timestamp do login

## Exemplo de Uso

```javascript
// Verificar se um e-mail está autorizado
import { isEmailAuthorized } from './config/authorizedEmails';

if (isEmailAuthorized('user@example.com')) {
    console.log('Acesso permitido');
} else {
    console.log('Acesso negado');
}
```
