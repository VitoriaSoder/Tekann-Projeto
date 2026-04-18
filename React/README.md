# Tekann - Front-end

Aplicação React construída com Vite + React Router + Axios.

---

## Tecnologias

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [React Router DOM 6](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

---

## Estrutura de Pastas

```
React/
├── public/                         # Arquivos estáticos servidos diretamente
│   ├── .htaccess                   # Roteamento SPA no Apache (redireciona tudo para index.html)
│   ├── favicon.ico                 # Ícone da aplicação
│   └── robots.txt                  # Instruções para crawlers
│
├── src/                            # Código fonte da aplicação
│   │
│   ├── assets/                     # Imagens, ícones, fontes e outros arquivos de mídia
│   │
│   ├── components/                 # Componentes reutilizáveis (botões, inputs, cards, modais)
│   │                               # Cada componente deve ter sua própria pasta:
│   │                               # components/Button/Button.jsx
│   │
│   ├── helpers/                    # Funções utilitárias e formatadores puros
│   │                               # Ex: formatDate(), formatCurrency(), maskCPF()
│   │
│   ├── hooks/                      # Custom Hooks para encapsular lógica de estado
│   │                               # Ex: useAuth(), useFetch(), useDebounce()
│   │
│   ├── pages/                      # Telas principais da aplicação (uma pasta por página)
│   │                               # Ex: pages/Login/, pages/Dashboard/
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx           # Configuração central do React Router (BrowserRouter + Routes)
│   │
│   ├── services/
│   │   └── api.js                  # Instância do Axios com baseURL via variável de ambiente
│   │                               # Adicione interceptors e demais chamadas à API aqui
│   │
│   ├── styles/
│   │   └── global.css              # Reset e estilos globais da aplicação
│   │
│   ├── App.jsx                     # Componente raiz — renderiza AppRoutes
│   └── index.jsx                   # Ponto de entrada — monta o React no DOM (#root)
│
├── .gitignore                      # Ignora node_modules, dist, .env
├── index.html                      # Template HTML principal do Vite
├── package.json                    # Dependências e scripts do projeto
├── vite.config.js                  # Configurações de build, plugins e servidor de dev
└── Web.config                      # Roteamento SPA para deploy em IIS
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
VITE_API_URL=https://sua-api.com
```

> Todas as variáveis expostas ao front devem começar com `VITE_`.

---

## Scripts

| Comando           | Descrição                              |
|-------------------|----------------------------------------|
| `npm install`     | Instala as dependências                |
| `npm run dev`     | Inicia o servidor de desenvolvimento  |
| `npm run build`   | Gera o build de produção em `dist/`   |
| `npm run preview` | Pré-visualiza o build de produção     |

---

## Convenções

- **Componentes** — nomeados em `PascalCase` (`UserCard.jsx`)
- **Hooks** — prefixados com `use` (`useAuth.js`)
- **Helpers** — nomeados em `camelCase` (`formatDate.js`)
- **Services** — um arquivo por domínio (`userService.js`, `authService.js`)
- **Pages** — uma pasta por página contendo o `.jsx` e estilos locais se necessário
