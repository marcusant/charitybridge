# 📋 Plano Detalhado de Tarefas - Charity Bridge

Este documento divide o plano de ação em tarefas de desenvolvimento específicas, indicando os arquivos impactados, a complexidade de cada item e o critério de aceitação técnica.

---

## 🎯 Fase 1: Fundação, Acessibilidade e Modularização

### Tarefa 1.1: Extração e Criação do Sistema de Design (CSS)
*   **Descrição**: Criar um arquivo CSS externo unificado para remover estilos inline e centralizar as definições visuais.
*   **Arquivos Impactados**:
    *   `[NEW]` `style.css` (Criação do arquivo)
    *   `[MODIFY]` `NGO Portal.html` (Remoção da tag `<style>` e inclusão da tag `<link>`)
*   **Especificações**:
    *   Definir variáveis CSS (`:root`) para paleta de cores, tipografia, transições e espaçamentos.
    *   Implementar a classe `.sr-only` para ocultação visual acessível.
    *   Manter e aprimorar a responsividade existente.

### Tarefa 1.2: Ajustes de Semântica e Acessibilidade (a11y)
*   **Descrição**: Adaptar a estrutura HTML para cumprir com as diretrizes de acessibilidade e semântica moderna.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `NGO Portal.html`
*   **Especificações**:
    *   Adicionar `<main>` em volta do contêiner principal.
    *   Adicionar `<fieldset>` e `<legend>` no grupo de botões de urgência.
    *   Substituir `display: none` do input de rádio de urgência por `.sr-only` e ajustar os estilos dos labels para focar visualmente quando o input correspondente for selecionado via teclado.
    *   Envolver todos os emojis em `<span role="img" aria-label="...">`.

### Tarefa 1.3: Otimizações de SEO e Metadados
*   **Descrição**: Adicionar tags fundamentais na seção `<head>` para otimização em motores de busca e compartilhamento social.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `NGO Portal.html`
*   **Especificações**:
    *   Adicionar tag `<meta name="description">` descritiva.
    *   Adicionar tags essenciais Open Graph (`og:title`, `og:description`, `og:image`).

---

## 🎨 Fase 2: Refinamento de UI/UX e Validação

### Tarefa 2.1: Validação de Formulário Inline (JS)
*   **Descrição**: Substituir a validação via `alert()` por mensagens visuais acopladas aos inputs do formulário.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `NGO Portal.html`
*   **Especificações**:
    *   Criar contêineres de erro (`<span class="error-msg">`) ocultos sob cada input obrigatório.
    *   Ao submeter, se houver erro, exibir a mensagem apropriada em vermelho, focar no primeiro campo inválido e impedir a submissão.
    *   Limpar o estado de erro assim que o usuário começar a digitar no campo inválido.

### Tarefa 2.2: Implementação da Função de Demonstração (Preenchimento Rápido)
*   **Descrição**: Evitar que o formulário venha pré-preenchido permanentemente. Usar placeholders e disponibilizar um botão para preencher exemplos automaticamente.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `NGO Portal.html`
*   **Especificações**:
    *   Remover os valores pré-definidos (`value="..."` e textos internos das tags `<textarea>`) do formulário inicial.
    *   Adicionar um botão discreto de estilo elegante "Preencher Exemplo" no topo do formulário.
    *   Ao clicar, preencher dinamicamente os campos com dados de teste.

### Tarefa 2.3: Micro-animações e Transições CSS
*   **Descrição**: Adicionar toques visuais refinados para tornar a interface mais dinâmica e viva.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `style.css`
*   **Especificações**:
    *   Efeito de elevação suave (`transform: translateY(-4px)`) nos cards e pílulas ao passar o mouse.
    *   Efeito de *pulse* aprimorado no ponto indicador de status do ticket.
    *   Aparência de revelação suave (fade-in) nos resultados.

---

## 👥 Fase 3: Portal do Voluntário (`volunteer.html`)

### Tarefa 3.1: Redesenho Estrutural da Visão do Voluntário
*   **Descrição**: Transformar o arquivo duplicado em uma aplicação totalmente focada na experiência do voluntário.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `volunteer.html` (Sobrescrever a cópia idêntica)
*   **Especificações**:
    *   Substituir o formulário de cadastro por um painel de controle do voluntário (*Dashboard*).
    *   Exibir estatísticas (Ex: chamados aceitos, horas acumuladas, competências cadastradas).

### Tarefa 3.2: Fila de Chamados e Filtros
*   **Descrição**: Implementar a listagem de chamados abertos das ONGs e controles para triagem.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `volunteer.html`
*   **Especificações**:
    *   Listar chamados com cartões informativos (ONG, descrição resumida, urgência e afinidade de habilidades).
    *   Criar botões de filtro por categoria (Ex: "Cybersecurity", "Finance").
    *   Permitir a busca textual por palavras-chave na fila de chamados.

### Tarefa 3.3: Visualização do Chamado e Candidatura
*   **Descrição**: Permitir ao voluntário ver os detalhes completos de um problema e aceitar a tarefa.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `volunteer.html`
*   **Especificações**:
    *   Criar uma área ou modal de visualização expandida contendo o diagnóstico inicial da IA e os passos de mitigação sugeridos.
    *   Adicionar um botão proeminente "Aceitar Ticket e Contatar ONG".
    *   Ao aceitar, atualizar o status do chamado e exibir informações de contato direto.

---

## 🧠 Fase 4: Inteligência Local e Integração de Fluxos

### Tarefa 4.1: Extração e Criação da Lógica Dinâmica (JS)
*   **Descrição**: Mover todo o código JavaScript para um arquivo separado e centralizado.
*   **Arquivos Impactados**:
    *   `[NEW]` `app.js`
    *   `[MODIFY]` `NGO Portal.html` (Remoção da tag `<script>` interna e importação de `app.js`)
    *   `[MODIFY]` `volunteer.html` (Importação de `app.js`)

### Tarefa 4.2: Classificador de IA Dinâmico baseado em Conteúdo
*   **Descrição**: Criar um motor de classificação simples em JavaScript que analise o texto digitado pelas ONGs em vez de depender estritamente do dropdown manual.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `app.js`
*   **Especificações**:
    *   Pesquisar por palavras-chave na descrição do problema (Ex: "hacked", "vírus", "senha", "roubo" direcionam para *Cybersecurity*; "servidor", "internet", "nuvem", "lento" direcionam para *IT Infrastructure*).
    *   Selecione o cenário correspondente de forma automatizada no motor de diagnósticos se a opção "Let AI decide" estiver ativa.

### Tarefa 4.3: Sincronização em Tempo Real via localStorage
*   **Descrição**: Conectar o fluxo de criação de chamados da ONG com a fila do voluntário de forma persistente.
*   **Arquivos Impactados**:
    *   `[MODIFY]` `app.js`
*   **Especificações**:
    *   Ao submeter um chamado com sucesso no Portal da ONG, salvar o objeto do ticket criado no `localStorage` sob uma chave `charity_bridge_tickets`.
    *   No Portal do Voluntário, carregar a lista de chamados diretamente do `localStorage` para exibição na fila.
    *   Ao aceitar um ticket no Portal do Voluntário, atualizar o estado dele no `localStorage` (alterando o status de "Aberto" para "Em Andamento" e vinculando o voluntário) de forma que essa mudança persista ao retornar à visualização.

---

## 🚀 Fase 5: Integração GitHub & Deploy Vercel

### Tarefa 5.1: Criação da Landing Splash Hub (`index.html`)
*   **Descrição**: Desenvolver uma página inicial de entrada atraente que direcione os usuários para as três principais visões da aplicação, atendendo ao requisito padrão de servidores como GitHub Pages e Vercel.
*   **Arquivos Impactados**:
    *   `[NEW]` `index.html` (Criação da Landing Page central)
*   **Especificações**:
    *   Layout responsivo e premium, utilizando glassmorfismo e o mesmo sistema de design de `style.css`.
    *   Seções de chamada para ação direcionando para: Portal da ONG, Portal do Voluntário e Apresentação do Projeto.
    *   Introdução rápida dos objetivos do Charity Bridge.

### Tarefa 5.2: Arquivo de Configuração da Vercel (`vercel.json`)
*   **Descrição**: Criar regras de reescrita para habilitar URLs amigáveis sem a necessidade de exibir a extensão `.html`.
*   **Arquivos Impactados**:
    *   `[NEW]` `vercel.json`
*   **Especificações**:
    *   Habilitar `cleanUrls: true`.
    *   Definir regras básicas de roteamento estático.

### Tarefa 5.3: Preparação do Repositório Git & Deploy
*   **Descrição**: Inicializar o repositório git local, estruturar commits semânticos em inglês e realizar a publicação no GitHub conectada ao deploy automático da Vercel.
*   **Arquivos Impactados**:
    *   Criação de `.gitignore` (excluindo arquivos de cache do IDE).
*   **Especificações**:
    *   Garantir a ausência de quaisquer referências absolutas de disco local antes do push final.

