# QuadraFácil

QuadraFácil é uma plataforma para agendamento de quadras esportivas. O projeto oferece uma interface moderna e responsiva, permitindo que usuários realizem reservas e que administradores gerenciem quadras, horários bloqueados e aprovem reservas.

## Funcionalidades

### Para Usuários

*   **Visualização de Quadras:** Exibe uma lista de quadras disponíveis com informações como nome, localização, horários de funcionamento e descrição.
*   **Reserva de Quadras:** Usuários podem realizar reservas diretamente pelo dashboard. Caso não estejam logados, são redirecionados para a página de login.
*   **Cadastro e Login:** Formulários para criação de conta (signup) e autenticação (login), incluindo recuperação de senha.

### Para Administradores

*   **Dashboard Avançado:** Área de administração com diversas funcionalidades extras, como:
    *   **Criação e Atualização de Quadras:** Permite cadastrar novas quadras ou editar as existentes.
    *   **Gestão de Horários Bloqueados:** Formulário para criar bloqueios – tanto para datas específicas quanto de forma recorrente – evitando reservas em horários não disponíveis.
    *   **Gerenciamento de Bloqueios:** Visualiza e exclui bloqueios previamente criados.
    *   **Aprovação de Reservas:** Interface para revisar e aprovar (ou rejeitar) reservas pendentes, com opção de inserir motivo para rejeição.
    *   **Dashboard Customizável:** Por meio de um painel de configurações (ícones com toggles), o administrador pode habilitar ou desabilitar cada componente do dashboard, de forma a personalizar a visualização e o fluxo de trabalho.

## Tecnologias Utilizadas

*   **Next.js & React:** Estrutura e renderização das páginas e componentes.
*   **Tailwind CSS:** Estilização e design responsivo.
*   **Framer Motion:** Animações e transições suaves, especialmente nos dashboards e toggles.
*   **Zod:** Validação de formulários, garantindo dados corretos e consistentes.
*   **Axios:** Comunicação com a API backend para operações de autenticação, reservas, quadras, bloqueios e aprovações.
*   **Context API & Hooks Customizados:** Gerenciamento de estado global para autenticação (AuthProvider) e atualização de reservas (BookingUpdateProvider). Hooks como `useUserData` e `useQuadrasData` facilitam o consumo de dados.

## Estrutura do Projeto

A organização dos arquivos segue uma arquitetura modular, facilitando a manutenção e evolução do código:

*   **/pages:**  Contém as páginas principais, como:
    *   `page.tsx` (redirecionamento da rota raiz e páginas específicas – quadras, dashboard, login, signup, redefinição de senha).
    *   Páginas para login, cadastro, recuperação de senha e dashboard, cada uma com seu respectivo componente.
*   **/components:** Inclui componentes reutilizáveis e específicos do domínio:
    *   **Componentes de UI:** Botões, inputs, cards, toggles, diálogos e áreas de rolagem.
    *   **Formulários:** Componentes como `LoginForm`, `SignupForm`, `ResetPasswordForm`, `CreateCourtForm`, `CreateBlockedTimeForm`, etc.
    *   **Componentes do Dashboard:** Componentes para criação de reservas, bloqueios, gerenciamento de bloqueios, aprovação de reservas e ícones de configuração (`DashboardSettingsIcons`).
*   **/context:** Gerencia estados globais:
    *   **Auth Context:** Controla a autenticação do usuário e redirecionamentos (ex.: `auth-guard.tsx`).
    *   **BookingUpdate Context:** Facilita a atualização e sincronização dos dados de reservas.
*   **/hooks:** Hooks customizados para acesso a dados e lógica de negócio:
    *   Exemplo: `useUserData` para dados do usuário, `useQuadrasData` para carregar informações das quadras.
*   **/services:** Configuração do Axios para comunicação com a API backend, centralizando as requisições HTTP.
*   **/styles & /public:** Arquivos de estilos globais e recursos estáticos, como imagens e ícones.

## Como Executar

1.  **Clone o Repositório:**

    ```bash
    git clone https://github.com/seu-usuario/quadrafacil.git
    cd quadrafacil
    ```

2.  **Instale as Dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente:** Crie um arquivo `.env.local` na raiz do projeto e configure as variáveis necessárias, como a URL da API.

4.  **Execute o Projeto:**

    ```bash
    npm run dev
    # ou
    yarn dev
    ```


## Considerações Finais

O QuadraFácil é pensado para oferecer uma experiência completa de agendamento e gerenciamento de quadras, unindo usabilidade e eficiência. A separação entre as funcionalidades de usuário e de administrador permite uma abordagem focada nas necessidades de cada perfil, enquanto a utilização de tecnologias modernas garante um desempenho robusto e uma interface atraente.

Este código foi criado para aprendizado e atividades da disciplina de Desenvolvimento Web, estando disponível para fins **educativos**.

- (c)[Caio da Silva](https://github.com/CaioSilvaCsv) : 2025.
- (c)[Gabriel Cunha](https://github.com/GahCunha) : 2025.
- (c)[Wender Alves](https://github.com/was8) : 2025.

---
