# Como Configurar um Domínio Personalizado

Para remover o `thioka.github.io` e usar seu próprio endereço (ex: `www.usmle-app.com`), siga estes passos:

## Passo 1: Comprar um Domínio
Você precisa comprar um domínio em sites como:
- [GoDaddy](https://godaddy.com)
- [Namecheap](https://namecheap.com)
- [Google Domains](https://domains.google)
- [Registro.br](https://registro.br) (para .com.br)

## Passo 2: Configurar o DNS
No painel onde você comprou o domínio, procure por **Gerenciamento de DNS** e adicione estes registros:

### Para o domínio principal (ex: usmle-app.com)
Crie 4 registros do tipo **A** apontando para os IPs do GitHub:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### Para o subdomínio www (ex: www.usmle-app.com)
Crie um registro do tipo **CNAME**:
- Nome: `www`
- Destino: `thioka.github.io`

## Passo 3: Configurar no GitHub
1. Vá para o seu repositório no GitHub.
2. Clique em **Settings** > **Pages**.
3. Em **Custom domain**, digite seu domínio (ex: `www.usmle-app.com`).
4. Clique em **Save**.
5. Marque a caixa **Enforce HTTPS** (pode demorar alguns minutos para ficar disponível).

## Passo 4: Ajustar o Código (Importante!)
Como o endereço do site vai mudar de `/usmle/` para a raiz `/`, precisamos ajustar o `vite.config.js`.

**Se você comprar o domínio, me avise para eu fazer este ajuste no código.** O ajuste será mudar `base: '/usmle/'` para `base: '/'`.

---

# Opção Grátis: GitHub Organization

Se não quiser gastar com domínio, você pode criar uma Organização no GitHub:

1. No GitHub, clique no seu avatar > **Your organizations** > **New organization**.
2. Escolha o plano **Free**.
3. Dê um nome profissional (ex: `MedicalPrep2025`).
4. Transfira este repositório para a nova organização.
5. O novo link será: `https://medicalprep2025.github.io/usmle`

Isso ainda mostra "github.io", mas esconde seu usuário pessoal.
