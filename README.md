# 🚌 Sistema de Transporte Escolar

Sistema completo para gerenciamento de transporte escolar, permitindo o controle de viagens, ônibus, rotas, usuários e chamadas de presença.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Regras de Negócio](#regras-de-negócio)
- [Como Executar](#como-executar)
- [Deploy](#deploy)
- [API Endpoints](#api-endpoints)

## 🎯 Visão Geral

Sistema web desenvolvido para gerenciar o transporte escolar de forma eficiente, com três tipos de usuários:

- **Administrador**: Gerencia usuários, ônibus, rotas e viagens
- **Responsável**: Realiza chamadas de presença nas viagens
- **Estudante**: Visualiza e se inscreve em viagens disponíveis

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** - Build tool e dev server
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **React Hook Form** - Gerenciamento de formulários

### Backend
- **FastAPI** - Framework web assíncrono
- **SQLAlchemy** - ORM
- **PostgreSQL** - Banco de dados (Supabase)
- **Pydantic** - Validação de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Uvicorn** - Servidor ASGI

## 📁 Estrutura do Projeto

```
web/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── api/             # Clientes API
│   │   ├── components/      # Componentes reutilizáveis
│   │   │   └── ui/          # Componentes UI (Radix)
│   │   ├── contexts/        # Context API (Auth, etc)
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── admin/       # Páginas administrativas
│   │   │   ├── responsible/ # Páginas do responsável
│   │   │   └── student/     # Páginas do estudante
│   │   └── lib/             # Utilitários
│   ├── vercel.json          # Configuração Vercel
│   └── package.json
│
└── backend/                 # API FastAPI
    ├── core/                # Configurações centrais
    │   ├── config.py        # Configurações e variáveis
    │   ├── database.py      # Conexão com banco
    │   ├── deps.py          # Dependências (auth, roles)
    │   └── security.py      # JWT e hash de senhas
    ├── models/              # Modelos SQLAlchemy
    │   └── entities.py      # Entidades do banco
    ├── schemas/             # Schemas Pydantic
    │   └── all_schemas.py   # Validação de dados
    ├── repositories/        # Camada de acesso a dados
    ├── services/            # Lógica de negócio
    ├── routers/             # Rotas da API
    │   ├── auth.py          # Autenticação
    │   ├── users.py         # Usuários
    │   ├── buses.py         # Ônibus
    │   ├── routes.py        # Rotas
    │   ├── travels.py       # Viagens
    │   └── attendances.py   # Presenças/Chamadas
    ├── render.yaml          # Configuração Render
    └── requirements.txt     # Dependências Python
```

## ✨ Funcionalidades

### 👤 Autenticação e Autorização

- Login com email e senha
- JWT tokens para autenticação
- Três níveis de acesso: Admin, Responsável, Estudante
- Proteção de rotas baseada em roles
- Validação de formulários no frontend e backend

### 👨‍💼 Administrador

#### Gestão de Usuários
- Criar, editar e excluir usuários
- Definir roles (Admin, Responsável, Estudante)
- Alterar senhas de usuários
- Ativar/desativar usuários
- Busca e filtros

#### Gestão de Ônibus
- Cadastrar ônibus com placa e capacidade
- Editar informações
- Excluir ônibus
- Validação de disponibilidade ao criar viagens

#### Gestão de Rotas
- Criar rotas (origem → destino)
- Ativar/desativar rotas
- Editar rotas existentes
- Excluir rotas

#### Gestão de Viagens
- Criar viagens vinculando ônibus e rotas
- Definir data/hora das viagens
- Alterar status (ABERTA, ENCERRADA, CANCELADA)
- Validação de conflitos de horário
- Visualizar viagens com detalhes completos

#### Dashboard Administrativo
- Estatísticas gerais do sistema
- Total de usuários, ônibus, rotas e viagens
- Viagens abertas vs encerradas
- Próximas viagens agendadas

### 👨‍🏫 Responsável

#### Chamada de Viagens
- Visualizar viagens abertas
- Ver lista de estudantes inscritos
- Confirmar presença de estudantes
- Encerrar viagens (oficializa a chamada)
- Status de presença: PENDENTE, CONFIRMADO, CANCELADO

#### Dashboard do Responsável
- Viagens abertas aguardando chamada
- Presenças pendentes
- Presenças confirmadas
- Total de viagens

### 🎓 Estudante

#### Minhas Viagens
- Visualizar viagens disponíveis
- Inscrever-se em viagens abertas
- Confirmar própria presença
- Ver status da inscrição
- Visualizar histórico de viagens

#### Dashboard do Estudante
- Total de viagens inscritas
- Próximas viagens agendadas
- Viagens abertas disponíveis
- Estatísticas pessoais

## 🔐 Regras de Negócio

### Viagens
- **RF13**: Validação de disponibilidade do ônibus (não pode ter duas viagens no mesmo horário)
- **RF17**: Apenas rotas ativas podem ser usadas em viagens
- **RF20**: Viagem deve ter ônibus e rota vinculados obrigatoriamente
- **RF22**: Estudantes só podem se inscrever em viagens com status ABERTA

### Presenças/Chamadas
- **RF09/RF27**: Um estudante pode se inscrever apenas uma vez por viagem
- **RF10**: Apenas estudantes ativos podem se inscrever
- **RF14/RF23/RF24**: Sistema de capacidade e lista de espera
  - Quando a capacidade do ônibus é atingida, novos estudantes vão para lista de espera
- **RF25**: Não é possível alterar presenças após encerramento da viagem
- **RF28/RF30/RF31**: Registro de confirmação com data/hora e responsável
- **RF05/RF32**: Ao encerrar viagem, a chamada é oficializada

### Usuários
- **RF07**: Cadastro de usuários com validação de email único
- Senhas são hasheadas com bcrypt
- Admin pode alterar senhas de qualquer usuário
- Validação de roles nas operações sensíveis

### Ônibus
- Validação de placa única
- Capacidade mínima validada
- Verificação de conflitos de horário ao criar viagens

### Rotas
- Validação de origem e destino
- Rotas podem ser ativadas/desativadas
- Rotas inativas não podem ser usadas em novas viagens

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ e npm
- Python 3.12+
- PostgreSQL (ou Supabase)
- Git

### Backend

1. **Navegue para a pasta do backend:**
```bash
cd backend
```

2. **Crie um ambiente virtual:**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

3. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente:**
Crie um arquivo `.env` na pasta `backend/`:
```env
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
SECRET_KEY=sua_chave_secreta_aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

5. **Execute o servidor:**
```bash
uvicorn main:app --reload --port 8000
```

O backend estará disponível em `http://localhost:8000`

### Frontend

1. **Navegue para a pasta do frontend:**
```bash
cd frontend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure a variável de ambiente:**
Crie um arquivo `.env` na pasta `frontend/`:
```env
VITE_API_URL=http://localhost:8000
```

4. **Execute o servidor de desenvolvimento:**
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📡 API Endpoints

### Autenticação (`/auth`)
- `POST /auth/login` - Login de usuário
- `POST /auth/signup` - Cadastro de usuário (admin)
- `GET /auth/me` - Obter usuário atual

### Usuários (`/users`)
- `GET /users/` - Listar usuários (admin/responsável)
- `PUT /users/{id}` - Atualizar usuário (admin)
- `DELETE /users/{id}` - Excluir usuário (admin)

### Ônibus (`/buses`)
- `GET /buses/` - Listar ônibus
- `GET /buses/{id}` - Obter ônibus específico
- `POST /buses/` - Criar ônibus (admin)
- `PUT /buses/{id}` - Atualizar ônibus (admin)
- `DELETE /buses/{id}` - Excluir ônibus (admin)

### Rotas (`/routes`)
- `GET /routes/` - Listar rotas
- `POST /routes/` - Criar rota (admin)
- `PUT /routes/{id}` - Atualizar rota (admin)
- `DELETE /routes/{id}` - Excluir rota (admin)

### Viagens (`/travels`)
- `GET /travels/` - Listar viagens
- `POST /travels/` - Criar viagem (admin)
- `PATCH /travels/{id}/status` - Atualizar status da viagem (admin)

### Presenças (`/attendances`)
- `GET /attendances/travel/{travel_id}` - Listar presenças de uma viagem
- `POST /attendances/join/{travel_id}` - Estudante se inscreve na viagem
- `POST /attendances/confirm/{travel_id}/{student_id}` - Confirmar presença
- `POST /attendances/close/{travel_id}` - Encerrar viagem (responsável)

## 🗄️ Modelo de Dados

### User (Usuário)
- `id`: ID único
- `name`: Nome completo
- `email`: Email (único)
- `password`: Senha hasheada
- `phone`: Telefone
- `role`: ADMIN, RESPONSIBLE ou STUDENT
- `is_active`: Status ativo/inativo

### Bus (Ônibus)
- `id`: ID único
- `plate`: Placa do veículo (única)
- `capacity`: Capacidade de passageiros

### Route (Rota)
- `id`: ID único
- `origin`: Origem da rota
- `destination`: Destino da rota
- `is_active`: Rota ativa/inativa

### Travel (Viagem)
- `id`: ID único
- `date_time`: Data e hora da viagem
- `bus_id`: ID do ônibus
- `route_id`: ID da rota
- `status`: ABERTA, ENCERRADA ou CANCELADA

### Attendance (Presença)
- `id`: ID único
- `travel_id`: ID da viagem
- `student_id`: ID do estudante
- `status`: PENDENTE, CONFIRMADO ou CANCELADO
- `confirmed_at`: Data/hora da confirmação
- `confirmed_by_id`: ID do responsável que confirmou
- `is_waitlist`: Se está na lista de espera

## 🔒 Segurança

- Autenticação JWT com tokens expiráveis
- Senhas hasheadas com bcrypt
- Validação de roles em rotas sensíveis
- CORS configurado para produção
- Validação de dados com Pydantic
- Proteção contra SQL Injection (SQLAlchemy ORM)
- Headers de segurança configurados

## 📦 Deploy

O projeto está configurado para deploy em:
- **Frontend**: Vercel
- **Backend**: Render
- **Banco de Dados**: Supabase

Consulte o arquivo [DEPLOY.md](./DEPLOY.md) para instruções detalhadas de deploy.

## 🧪 Testes

### Backend
```bash
cd backend
# Testar conexão com banco
python teste.py

# Executar seeds (dados iniciais)
python seeds.py
```

### Frontend
```bash
cd frontend
npm run build  # Testar build de produção
npm run dev    # Servidor de desenvolvimento
```

## 📊 Arquitetura

### Backend (FastAPI)

**Padrão de Arquitetura:**
- **Routers**: Definem os endpoints da API
- **Services**: Contêm a lógica de negócio
- **Repositories**: Camada de acesso a dados (abstração do SQLAlchemy)
- **Models**: Entidades do banco de dados (SQLAlchemy ORM)
- **Schemas**: Validação e serialização de dados (Pydantic)

**Fluxo de uma Requisição:**
1. Router recebe a requisição HTTP
2. Valida autenticação e permissões (deps.py)
3. Service executa a lógica de negócio
4. Repository acessa o banco de dados
5. Retorna resposta serializada

### Frontend (React)

**Padrão de Arquitetura:**
- **Pages**: Componentes de página (rotas)
- **Components**: Componentes reutilizáveis
- **API**: Clientes HTTP para comunicação com backend
- **Contexts**: Gerenciamento de estado global (Auth)
- **Hooks**: Lógica reutilizável

**Fluxo de uma Ação:**
1. Usuário interage com a interface
2. Componente chama função da API
3. API faz requisição HTTP ao backend
4. Resposta é processada e estado atualizado
5. Interface é re-renderizada

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
SECRET_KEY=sua_chave_secreta_aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🎨 Interface

- Design moderno e responsivo
- Componentes acessíveis (Radix UI)
- Feedback visual com toasts
- Modais de confirmação para ações destrutivas
- Validação de formulários em tempo real
- Loading states e skeletons
- Tratamento de erros amigável

## 🔄 Fluxo de Uso

1. **Admin cria recursos:**
   - Cadastra usuários (estudantes e responsáveis)
   - Cadastra ônibus e rotas
   - Cria viagens vinculando ônibus e rotas

2. **Estudante se inscreve:**
   - Visualiza viagens abertas
   - Se inscreve em viagens disponíveis
   - Confirma própria presença (opcional)

3. **Responsável realiza chamada:**
   - Seleciona viagem aberta
   - Visualiza lista de inscritos
   - Confirma presenças
   - Encerra viagem (oficializa chamada)

## 📚 Documentação Adicional

- [Guia de Deploy](./DEPLOY.md) - Instruções completas de deploy
- API disponível em `/docs` quando o backend estiver rodando (Swagger UI)

## 👥 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso interno.

## 📖 Exemplos de Uso

### Criar uma Viagem (Admin)

1. Acesse `/admin/viagens`
2. Clique em "Nova Viagem"
3. Selecione um ônibus disponível
4. Selecione uma rota ativa
5. Defina data e hora
6. Salve a viagem

### Estudante se Inscreve em Viagem

1. Acesse `/estudante/viagens`
2. Visualize viagens abertas
3. Clique em "Entrar na Viagem"
4. Confirme a presença (opcional)

### Responsável Realiza Chamada

1. Acesse `/responsavel/chamada`
2. Selecione uma viagem aberta
3. Visualize lista de estudantes inscritos
4. Confirme presenças clicando nos estudantes
5. Encerre a viagem quando terminar



Desenvolvido com ❤️ para facilitar o gerenciamento de transporte escolar
