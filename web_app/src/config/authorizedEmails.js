// Lista de e-mails autorizados a acessar o sistema
// Para adicionar novos usuários, basta adicionar o e-mail à lista abaixo

export const authorizedEmails = [
    'example@email.com',
    'user@example.com',
    // Adicione mais e-mails aqui
];

// Função para verificar se um e-mail está autorizado
export const isEmailAuthorized = (email) => {
    if (!email) return false;

    const normalizedEmail = email.toLowerCase().trim();
    return authorizedEmails.some(
        authorizedEmail => authorizedEmail.toLowerCase() === normalizedEmail
    );
};
