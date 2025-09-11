defmodule Picknwin.Repo.Migrations.EnableExtensions do
  use Ecto.Migration

  def up do
    execute "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\""
    execute "CREATE EXTENSION IF NOT EXISTS \"citext\""
    execute "CREATE EXTENSION IF NOT EXISTS \"pg_trgm\""
    execute "CREATE EXTENSION IF NOT EXISTS \"btree_gin\""
  end

  def down do
    execute "DROP EXTENSION IF EXISTS \"btree_gin\""
    execute "DROP EXTENSION IF EXISTS \"pg_trgm\""
    execute "DROP EXTENSION IF EXISTS \"citext\""
    execute "DROP EXTENSION IF EXISTS \"uuid-ossp\""
  end
end