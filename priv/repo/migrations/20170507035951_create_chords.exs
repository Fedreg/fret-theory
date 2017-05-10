defmodule MtApi.Repo.Migrations.CreateChords do
  use Ecto.Migration

  def change do
    create table(:chords) do
      add :key, :string
      add :i, :string
      add :ii, :string
      add :iii, :string
      add :iv, :string
      add :v, :string
      add :vi, :string
      add :vii, :string
      add :i7, :string
      add :iv7, :string
      add :v7, :string
      add :vi7, :string
      add :names, {:array, :string}
      add :bars, {:array, :string}

      timestamps()
    end
  end
end
