# Sport Data Angola — Frontend do Atleta

[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg)](https://vitejs.dev/)

Frontend público para atletas da plataforma Sport Data Angola. Permite registo, autenticação, gestão de perfil, inscrições em campeonatos, pagamentos, documentos e muito mais.

## Tecnologias

- **React 19** com TypeScript
- **Vite 7** para build e dev server
- **Zustand** para gestão de estado
- **React Router v6** para navegação
- **Axios** para chamadas HTTP com refresh token automático
- **Tailwind CSS** para estilos
- **Framer Motion** para animações
- **React Hot Toast** para notificações
- **React Helmet Async** para SEO

## Setup

```bash
yarn install
yarn dev
```

O servidor de desenvolvimento inicia em `http://localhost:3000`.

## Funcionalidades

- Autenticação (login, registo, recuperação de senha)
- Dashboard do atleta com estatísticas
- Perfil com edição de dados e documentos
- Inscrição em campeonatos e eventos
- Pagamentos e histórico
- Notificações em tempo real
- Rankings e classificações
- Tema dark/light
