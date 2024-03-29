# Used tools

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://docs.docker.com/engine/install/) e [Docker Compose](https://docs.docker.com/compose/install/)

# Starting application

```bash
docker compose up -d

git clone git@github.com:CEDOMCA/backend.git

cp .env.example .env

yarn --frozen-lock-file

yarn start:dev
```

E vá para `http://localhost:3000/swagger` para acessar a especificação da API.

# NPM Scripts

| name        | description                           |
| :---------- | :------------------------------------ |
| `start`     | Inicia a aplicação sem watch mode     |
| `start:dev` | Inicia a aplicação em watch mode      |
| `seed`      | Popula o banco com dados predefinidos |

# Environment variables

| name               | description                                               | type   |
| :----------------- | :-------------------------------------------------------- | :----- |
| `PORT`             | A porta utilizada pela aplicação NestJS                   | number |
| `MONGO_URI`        | URL utilizada para a conexão com o banco de dados MongoDB | string |
| `SESSION_SECRET`   | String utilizada para criar o cookie de sessão            | string |
| `SESSION_LIFETIME` | Tempo de duração do cookie de sessão                      | string |
| `CORS_ORIGIN`      | URL permitida para CORS                                   | string |
| `REDIS_PORT`       | A porta utilizada pelo banco Redis                        | number |
| `REDIS_HOST`       | URL utilizada pelo banco Redis                            | string |
| `REDIS_PASSWORD`   | Senha utilizada pelo banco Redis                          | string |
