# Used tools

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Yarn](https://yarnpkg.com/getting-started/install)

# Starting application

```bash
git clone git@github.com:CEDOMCA/backend.git

cp .env.example .env

yarn --frozen-lock-file

yarn start:dev
```

# Environment variables

| name               | description                                               | type   |
| :----------------- | :-------------------------------------------------------- | :----- |
| `PORT`             | A porta utilizada pela aplicação NestJS                   | number |
| `MONGO_URI`        | URL utilizada para a conexão com o banco de dados MongoDB | string |
| `SESSION_SECRET`   | String utilizada para criar o cookie de sessão            | string |
| `SESSION_LIFETIME` | Tempo de duração do cookie de sessão                      | string |
