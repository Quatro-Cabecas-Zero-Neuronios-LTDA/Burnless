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
- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (via NativeWind)
- [pnpm](https://pnpm.io/) como gerenciador de pacotes

**Backend**
- Python (API REST — ex.: FastAPI)
- Modelos de ML (scikit-learn) para sono e sobrecarga
- Integração com LLM para a IA Conselheira

**Infra**
- Docker para facilitar o deploy
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

### Estrutura de pastas (proposta)

```
burnless/
├── apps/
│   └── mobile/          # App Expo / React Native
├── backend/
│   ├── api/             # Rotas e controllers
│   ├── domain/          # Regras de negócio
│   ├── ml/              # Modelos de sono e sobrecarga
│   └── advisor/         # IA Conselheira + guardrails
├── docker-compose.yml
└── README.md
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 20+ e pnpm
- Python 3.11+
- Docker (opcional)
- App **Expo Go** no celular ou um emulador

### Mobile

```bash
cd apps/mobile
pnpm install
pnpm expo start
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # configure as chaves (ex.: LLM_API_KEY)
uvicorn api.main:app --reload
```

### Com Docker

```bash
docker compose up --build
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
