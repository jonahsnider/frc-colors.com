POSTGRES_URL="postgres://default:u6a4SZYAnLgv@ep-damp-flower-96031569-pooler.us-east-1.postgres.vercel-storage.com/verceldb"

echo $POSTGRES_URL

bun run build

./dist/frc-colors
