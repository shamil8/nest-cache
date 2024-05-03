# nest-cache
NestJS Cache submodule

### Required

1. `redis`

### Add libs:
```yarn
yarn add redis
```

### Remove these libs:
```yarn
yarn remove redis
```

### Env example
URL example: `redis[s]://[[username][:password]@][host][:port][/db-number]`
```dotenv
# Cache module environments
REDIS_URL=redis://:password@localhost:6379
```
