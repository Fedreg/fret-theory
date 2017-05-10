defmodule MtApi.ChordChannel do
    use  MtApi.Web, :channel
    alias MtApi.Repo
    alias MtApi.Chord

    def join("chordChannel:chords", _payload, socket) do
        {:ok, socket}
    end

    def handle_in("chord_select",
                    %{"key" => key}, socket) do

    result = Repo.get_by!(Chord, key: key)
                |> Chord.changeset(%{"key" => key})
                |> Repo.update
                
    case result do
        {:ok, result} ->
            chord = Repo.get_by!(Chord, key: key)
            broadcast! socket, "chord_select", chord
        {:error, result} ->
            IO.puts "Update failed: #{inspect result.errors}"
    end

    {:noreply, socket}
    end
end