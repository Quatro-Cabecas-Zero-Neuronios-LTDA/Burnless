# 🌱 Burnless

> Acompanhe seu dia, entenda seus hábitos e evite o esgotamento — com uma IA Conselheira que lê suas notas e sugere pequenos ajustes na rotina.

O **Burnless** é um app mobile de saúde e bem-estar focado em prevenir sobrecarga e burnout. A pessoa registra o que fez no dia (sono, estudo, exercício, pausas, cafeína, telas…), acompanha seu histórico de "feitos" em um dashboard simples e escreve notas livres sobre como se sentiu. A partir dessas notas, a **IA Conselheira** sugere mudanças práticas na rotina e, quando faz sentido, orienta a buscar ajuda profissional.

> ⚠️ **O Burnless não é um serviço médico e não faz diagnóstico.** As sugestões têm caráter informativo e não substituem acompanhamento de profissionais de saúde.

---

## 📑 Sumário

- [Funcionalidades](#-funcionalidades)
- [IA Conselheira](#-ia-conselheira-nosso-diferencial)
- [Inteligência por trás dos dados](#-inteligência-por-trás-dos-dados)
- [Segurança e limites](#-segurança-e-limites)
- [Stack](#-stack)
- [Arquitetura](#-arquitetura)
- [Como rodar localmente](#-como-rodar-localmente)
- [Roadmap](#-roadmap)
- [Licença](#-licença)

---

## ✨ Funcionalidades

### 📊 Dashboard de feitos
- Registro rápido das atividades do dia (check-ins de hábitos)
- Visão diária, semanal e mensal do histórico
- Gráficos interativos de evolução: sono, estudo/trabalho, exercício, pausas
- Sequências (streaks) e marcos para reforçar hábitos positivos

### 😴 Coach de sono
- Registro de horário de dormir/acordar, cafeína, tempo de tela e exercício
- O app aponta **quais hábitos mais afetam o sono daquela pessoa**
- Insights personalizados com base no próprio histórico

### 🔥 Indicador de sobrecarga
- Questionário periódico curto (como você está se sentindo, nível de energia, estresse)
- Cruzamento com hábitos de estudo/trabalho e sono
- Alertas de sobrecarga com sugestões de pausas e organização da rotina

### 📝 Notas + IA Conselheira
- Espaço livre para escrever como foi o dia
- A IA lê as notas (com consentimento) e devolve sugestões de atitudes concretas
- Veja detalhes na seção abaixo 👇

---

## 🤖 IA Conselheira (nosso diferencial)

A aba **Notas** é o coração do Burnless. A pessoa escreve livremente sobre o seu dia e a IA Conselheira:

1. **Entende o contexto** — relaciona o que foi escrito com os dados do dashboard (ex.: "dormi mal" + 3 cafés depois das 18h).
2. **Sugere atitudes pequenas e práticas** — uma pausa, ajustar horário de tela, reorganizar tarefas, retomar uma caminhada.
3. **Acompanha a evolução** — percebe padrões recorrentes nas notas ao longo das semanas.
4. **Orienta a buscar ajuda quando necessário** — se as notas indicam sinais de sofrimento, a Conselheira sugere o tipo de serviço adequado (ex.: UBS, teleconsulta, UPA ou emergência) e exibe canais de apoio como o **CVV (188)**.

Exemplo:

> **Nota:** "Semana de provas, estudei até 2h da manhã de novo e acordei sem energia nenhuma."
>
> **Conselheira:** "Notei que nos últimos 4 dias você dormiu menos de 6h. Que tal definir um horário-limite de estudo hoje e trocar a última hora por revisão leve? Blocos de 50 min com 10 min de pausa costumam render mais que madrugadas longas."

---

## 🧠 Inteligência por trás dos dados

| Módulo | Abordagem | Dados para treino/validação |
|---|---|---|
| Coach de sono | Regressão / árvores de decisão para **importância de features** (quais hábitos mais impactam o sono) | [Sleep Health and Lifestyle Dataset](https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset) (Kaggle, sintético) + histórico do próprio usuário |
| Indicador de sobrecarga | Classificação (ex.: baixo / moderado / alto risco) | Dados sintéticos e datasets públicos de estresse estudantil |
| IA Conselheira | LLM com regras de segurança e prompts guiados | Casos sintéticos para avaliação de respostas |
| Encaminhamento | Classificação de urgência **inspirada** no Protocolo de Manchester | Casos sintéticos |

---

## 🛡️ Segurança e limites

- **Não diagnostica.** A Conselheira sugere hábitos e, no máximo, o *tipo* de serviço a procurar.
- **Guardrails no LLM:** respostas filtradas para evitar recomendações médicas, de medicação ou conteúdo arriscado.
- **Sinais de risco:** quando detectados, a resposta prioriza canais de apoio (CVV 188, SAMU 192) em vez de sugestões de rotina.
- **Privacidade (LGPD):** notas são dados sensíveis — criptografia em trânsito e em repouso, consentimento explícito para análise por IA e opção de exportar/excluir os dados a qualquer momento.

---

## 🧰 Stack

**Mobile**
- [React Native](https://reactnative.dev/) 0.88 + [Expo](https://expo.dev/) SDK 58 (expo-router), TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 3.4 via [NativeWind](https://www.nativewind.dev/) 4.2 (o NativeWind 5, que usa Tailwind 4, ainda é RC)
- TypeScript 6.0 para editor/ESLint e **TypeScript 7** para o `typecheck` (o typescript-eslint ainda não suporta o TS 7)
- ESLint 9 (o `eslint-config-expo` ainda não roda no ESLint 10) + Prettier
- [pnpm](https://pnpm.io/) 12 como gerenciador de pacotes (Node 26 LTS)

**Backend**
- Python 3.15 + FastAPI, SQLAlchemy 2.1 (async), Alembic, PostgreSQL 18, uv
- Modelos de ML (scikit-learn) para sono e sobrecarga
- Integração com LLM para a IA Conselheira

**Infra**
- Docker (só backend): compose de dev com hot reload + imagem multi-stage de produção
- EAS (Expo Application Services) para builds mobile

---

## 🏗️ Arquitetura

```
┌──────────────────────┐        HTTPS        ┌──────────────────────────┐
│   App (Expo / RN)    │ ──────────────────▶ │      API (Python)        │
│                      │                     │                          │
│  • Dashboard         │                     │  • Registros e histórico │
│  • Check-ins         │ ◀────────────────── │  • Modelos de ML         │
│  • Notas             │                     │  • IA Conselheira (LLM)  │
└──────────────────────┘                     │  • Guardrails            │
                                             └────────────┬─────────────┘
                                                          │
                                                   ┌──────▼──────┐
                                                   │  Banco de   │
                                                   │   dados     │
                                                   └─────────────┘
```

### Camadas (DDD horizontal)

Backend e mobile seguem as mesmas quatro camadas. A dependência sempre aponta
para dentro (para o domínio):

```
presentation  →  infrastructure  →  application  →  domain
(rotas/telas)    (banco, HTTP, LLM)  (casos de uso)    (regras de negócio puras)
```

- **domain**: entidades, value objects e interfaces de repositório. Não conhece framework nenhum.
- **application**: casos de uso (um por intenção do usuário) e *ports* para serviços externos.
- **infrastructure**: implementações dos ports (SQLAlchemy, cliente HTTP, LLM, modelos de ML).
- **presentation**: FastAPI (backend) e telas/rotas (mobile). Uma *composition root* liga cada interface à sua implementação.

Novos contextos (`checkins`, `notes`, `sleep`, `advisor`…) entram como subpasta **dentro de cada camada**.
No backend, o `import-linter` quebra o build se alguém violar a regra.

### Estrutura de pastas

```
burnless/
├── apps/mobile/                     # App Expo / React Native (pnpm workspace)
│   └── src/
│       ├── app/                     # rotas expo-router (finas)
│       ├── domain/  application/  infrastructure/  presentation/
│       └── di/                      # composition root
├── backend/                         # API FastAPI (uv)
│   ├── src/burnless/
│   │   ├── domain/                  # shared/: Entity, ValueObject, Repository
│   │   ├── application/             # shared/: UseCase, UnitOfWork · health/
│   │   ├── infrastructure/          # config/, database/
│   │   ├── presentation/api/        # dependencies.py (DI), v1/
│   │   └── main.py
│   ├── alembic/                     # migrações
│   ├── tests/
│   └── Dockerfile                   # multi-stage: dev | prod
├── docker-compose.yml               # dev (hot reload)
└── docker-compose.prod.yml          # produção
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- **Node.js 26 LTS** e **pnpm 12**: `mise use -g node@26 pnpm@12.18.0` (o Node 26 não traz mais o corepack)
- **Docker** com Compose (o backend roda só em container, então Python no host é opcional)
- App **Expo Go** no celular, ou um *development build* (veja abaixo)

> **Por que só o backend fica em Docker?** O app mobile não roda em container:
> o Metro precisa falar com o celular/emulador pela rede local. Em produção, o app
> vira um binário (`.apk`/`.aab`/`.ipa`) gerado pelo **EAS Build** e publicado nas lojas.

### Backend (Docker)

```bash
docker compose up --build                  # API em http://localhost:8000 (docs em /docs)
docker compose exec api alembic upgrade head

# qualidade
docker compose run --rm api uv run pytest
docker compose run --rm api uv run ruff check .
docker compose run --rm api uv run mypy
docker compose run --rm api uv run lint-imports   # regras de arquitetura
```

Dependências: `docker compose run --rm api uv add <pacote>` (atualiza `pyproject.toml` e `uv.lock`).

### Backend em produção

```bash
cp backend/.env.example backend/.env       # troque senhas e DATABASE_URL
docker compose -f docker-compose.prod.yml --env-file backend/.env up -d --build
docker compose -f docker-compose.prod.yml --env-file backend/.env run --rm api alembic upgrade head
```

A imagem de produção roda como usuário não-root, sem `/docs`, com HEALTHCHECK em `/api/v1/health`.

### Mobile

```bash
pnpm install                               # na raiz do repositório
pnpm mobile                                # expo start (Expo Go) → escaneie o QR code ou aperte "a"
pnpm --filter mobile start:dev-client      # quando tiver um development build instalado
pnpm typecheck                             # TypeScript 7 (tsc nativo)
pnpm lint
```

**URL da API:** em desenvolvimento, o app usa sozinho o IP da máquina que roda o Metro
(o mesmo do QR code), na porta 8000. Funciona no emulador e no celular na mesma rede Wi-Fi.
Só defina `EXPO_PUBLIC_API_URL` em `apps/mobile/.env` para forçar outra URL (staging ou `--tunnel`).
Nunca use `localhost`: no Android, ele aponta para o próprio aparelho.

### Builds do app (EAS)

```bash
pnpm dlx eas-cli login
pnpm dlx eas-cli init                      # vincula o projeto à sua conta Expo
pnpm dlx eas-cli build --profile development --platform android   # dev client
pnpm dlx eas-cli build --profile production --platform all        # lojas
```

---

## 🗺️ Roadmap

- [ ] MVP: check-ins diários + dashboard de histórico
- [ ] Aba Notas com IA Conselheira
- [ ] Coach de sono com importância de hábitos
- [ ] Questionário periódico e alerta de sobrecarga
- [ ] Sugestão de encaminhamento (UBS / UPA / emergência / teleconsulta)
- [ ] Notificações e lembretes de pausa
- [ ] Exportação de dados e conformidade com LGPD

---

## 📄 Licença

_A definir._

---

<p align="center">Feito com 💚 para quem quer render sem se queimar.</p>
