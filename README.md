# install

```zsh
bun i -y
```

# DB

```zsh
# postgreSQL 起動
docker compose up -d

# postgreSQL 停止
docker compose down

# コンテナに入る
docker exec -it postgres_demo bash
```

# postgres 内容確認

```zsh
# postgresログイン
psql -U postgres -d postgres_demo

# DB確認
\l

# テーブル確認
\c postgres_demo

# ログアウト
exit
```

# Prisma

```zsh
# prisma 初期化
bunx prisma generate

# prisma 管理画面 起動
bunx prisma studio
```

# 初期データ投入

```zsh
bun run seeds
```

# OpenAPI起動

```zsh
bun dev
```