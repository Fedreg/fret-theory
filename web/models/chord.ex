defmodule MtApi.Chord do
  use MtApi.Web, :model
  @derive {Poison.Encoder, only: [:key, :i, :ii, :iii, :iv, :v, :vi, :vii, :i7, :iv7, :v7, :vi7, :names, :bars]}

  schema "chords" do
    field :key, :string
    field :i, :string
    field :ii, :string
    field :iii, :string
    field :iv, :string
    field :v, :string
    field :vi, :string
    field :vii, :string
    field :i7, :string
    field :iv7, :string
    field :v7, :string
    field :vi7, :string
    field :names, {:array, :string}
    field :bars, {:array, :string}

    timestamps()
  end

  
  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:key, :i, :ii, :iii, :iv, :v, :vi, :vii, :i7, :iv7, :v7, :vi7, :names, :bars])
    |> validate_required([:key, :i, :ii, :iii, :iv, :v, :vi, :vii, :i7, :iv7, :v7, :vi7, :names, :bars])
  end
end