# 📜 Regras e Diretrizes de Desenvolvimento - Charity Bridge

Este documento reúne os padrões, boas práticas e requisitos de qualidade obrigatórios para o desenvolvimento do projeto **Charity Bridge**. Qualquer modificação no código deve aderir estritamente a estas diretrizes para assegurar que a plataforma seja acessível, performática e fácil de manter.

> [!IMPORTANT]
> **Idioma da Aplicação (Language)**: Todo o conteúdo da interface do usuário (textos de exibição, rótulos, botões, mensagens de erro, placeholders, feedbacks simulados e descrições de acessibilidade) deve ser implementado **estritamente em Inglês (en)**.

---

## ♿ 1. Acessibilidade (WCAG 2.1 Nível AA)

A acessibilidade não é opcional. A aplicação deve ser totalmente navegável e compreensível por qualquer pessoa, incluindo aquelas que utilizam tecnologias assistivas.

*   **Navegação por Teclado**:
    *   **Proibido**: Usar `display: none` ou `visibility: hidden` em elementos focáveis reais (como inputs de rádio ou checkbox) para fins de estilização, pois isso os remove da árvore de foco.
    *   **Solução**: Para ocultar visualmente botões de rádio e manter a acessibilidade, utilize a técnica de ocultação visual (classe `.sr-only` ou similar):
        ```css
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        ```
    *   Elementos interativos modificados devem possuir estilos claros para o estado `:focus-visible`.
*   **Emojis e Ícones**:
    *   Todos os emojis inseridos diretamente no HTML devem ser envolvidos em um elemento `<span>` contendo os atributos `role="img"` e `aria-label="short description in English"`.
    *   *Exemplo correto*: `<span role="img" aria-label="handshake">🤝</span>`
*   **Semântica HTML5**:
    *   Use elementos estruturais apropriados: `<header>`, `<main>`, `<section>`, `<footer >`, `<nav>`, e `<aside>`.
    *   Formulários devem agrupar controles logicamente relacionados com `<fieldset>` e fornecer uma legenda com `<legend>`.
*   **Contraste de Cores**:
    *   Garanta uma relação de contraste de pelo menos **4.5:1** para texto normal e **3:1** para texto grande em relação ao fundo.

---

## 🎨 2. Estilo e Design (CSS)

A interface deve passar uma imagem profissional, moderna e confiável.

*   **Modularidade e Fonte Única da Verdade (Single Source of Truth)**:
    *   Todo o CSS deve ser centralizado em um único arquivo externo (`style.css`), proibindo o uso de blocos `<style>` internos nas páginas HTML.
    *   Toda a identidade visual (como cores, layouts, estruturas de botões, cards e alertas) deve residir estritamente neste arquivo unificado. Quaisquer novas páginas (como `volunteer.html`) devem obrigatoriamente importar e reutilizar as classes padrão do `style.css`, garantindo consistência visual e facilidade de manutenção em um único lugar.
*   **Variáveis CSS (Custom Properties)**:
    *   Cores, fontes, arredondamentos e espaçamentos padrão devem ser definidos como variáveis na pseudo-classe `:root` para garantir consistência e facilitar a criação de um futuro Modo Escuro (*Dark Mode*).
*   **Design Responsivo (Mobile-First)**:
    *   Construa layouts flexíveis usando CSS Grid e Flexbox.
    *   Não utilize larguras fixas em pixels (`px`) para contêineres principais; prefira porcentagens (`%`), `max-width`, ou unidades dinâmicas (`rem`, `vw`).
*   **Interações Fluidas**:
    *   Botões, links e cards interativos devem possuir transições suaves (`transition: all 0.2s ease`) para estados de `:hover`, `:active` e `:focus`.

---

## ⚙️ 3. Lógica e Arquitetura de Código (JavaScript)

O código script deve ser limpo, limítrofe e livre de redundâncias.

*   **Separação de Preocupações**:
    *   Toda a lógica JavaScript deve ser movida para um arquivo externo (`app.js`).
*   **Não Poluição do Escopo Global**:
    *   Encapsule a lógica da aplicação em módulos ou utilize estruturas que limitem o escopo global.
*   **Validação de Formulários**:
    *   **Proibido**: Usar `alert()` nativo para validação de campos obrigatórios.
    *   **Solução**: Implementar mensagens de feedback inline diretamente abaixo dos inputs afetados e usar a API de Validação de Formulários do HTML5 (`setCustomValidity`).
*   **Persistência Local**:
    *   Use `localStorage` para simular uma base de dados local onde as ações tomadas no portal da ONG (como criar um ticket) reflitam em tempo real no portal do voluntário.
*   **Links de Verificação Local**:
    *   **Obrigatório**: Ao final de cada resposta envolvendo a edição ou criação de arquivos visíveis (páginas HTML), o assistente de IA deve fornecer links absolutos clicáveis no formato `file:///` para permitir que o usuário verifique e teste o resultado localmente de forma imediata.

---

## 🚀 4. Diretrizes de Publicação (GitHub & Vercel)

Para garantir que a aplicação possa ser empacotada, publicada no GitHub e hospedada com sucesso na Vercel sem falhas de carregamento de arquivos:

*   **Caminhos Relativos Estritos**:
    *   **Proibido**: Utilizar rotas locais absolutas (como `file:///C:/dev/...`) ou caminhos de disco no código do web app.
    *   **Solução**: Todos os links (`href`), carregamentos de script (`src`) e importações de recursos devem utilizar caminhos relativos (ex: `style.css`, `app.js`, `volunteer.html`).
*   **Ponto de Entrada Padrão (`index.html`)**:
    *   A plataforma Vercel e o GitHub Pages buscam por um arquivo `index.html` na raiz do diretório para servir como página inicial pública.
    *   Devemos manter um arquivo `index.html` unificado atuando como painel central de boas-vindas (*Landing Splash Hub*) que conecte elegantemente os três portais do ecossistema.
*   **Controle de Estado no Navegador**:
    *   A persistência de dados continuará utilizando `localStorage`. Devemos garantir compatibilidade com contextos seguros (HTTPS) exigidos pela Vercel.
*   **Clean URLs via vercel.json**:
    *   Configurar um arquivo `vercel.json` se necessário para gerenciar rotas limpas, removendo a necessidade de exibir extensões `.html` na URL final do navegador.

---

## 📊 5. Lista de Verificação (Checklist) para Commits

Antes de concluir qualquer tarefa e dar a atividade como encerrada, verifique:
1. [ ] O HTML é válido e sem erros de sintaxe estrutural?
2. [ ] É possível preencher o formulário e ativar todas as funções utilizando **apenas** o teclado (`Tab`, `Space`, `Enter`, `Setas`)?
3. [ ] Todos os emojis possuem atributos `aria-label` e `role="img"`?
4. [ ] O CSS está em um arquivo separado e usa variáveis para a paleta de cores?
5. [ ] O layout continua harmônico e legível em resoluções mobile (ex: 375px de largura)?
6. [ ] Há alguma chamada à função `alert()` restante no código? (Se sim, remova e troque por validação em tela).
7. [ ] Todos os links internos e referências a arquivos utilizam caminhos relativos válidos compatíveis com o deploy na Vercel?

