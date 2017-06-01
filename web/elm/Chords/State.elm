module Chords.State exposing (..)

import Chords.Types as CT exposing (..)
import Types as App exposing (Model)


initialModel : CT.Model
initialModel =
    { musKey = App.Model.musKey
    , displayedChords = initialKey
    , currentChord = []
    , pitchShift = 0
    }


{-| Default key loaded in at init
-}
initialKey : ChordChartData
initialKey =
    { i = "06x353242030121010"
    , ii = "06x05x040232423111"
    , iii = "060152242030020010"
    , iv = "06x06x343232121010"
    , v = "263152040030323413"
    , vi = "06x050242332121010"
    , vii = "06x15224343432301x"
    , i7 = "06x353242433121010"
    , iv7 = "06x05x142334223414"
    , v7 = "363252040030020111"
    , vi7 = "06x050242030121010"
    , names = [ "C", "Dm", "Em", "F", "G", "Am", "Bdim7", "CM7", "FM7", "G7", "Am7", "5" ]
    , bars = [ "", "", "", "", "", "", "", "", "3", "", "" ]
    , key = "C"
    }

initialCommands : Cmd Msg
initialCommands =
    Cmd.none



update : Msg -> Scale.Model -> ( Scale.Model, Cmd Msg )
update msg model =
    case msg of
        Play chord hzShift ->
            ({ model | currentChord = chord, pitchShift = hzShift }, Cmd.none)
                :> update ResetIndex
                :> update SendNotes

        ResetIndex ->
            { model | index = 0 } ! []

        SendNotes ->
            let
                note =
                    noteSorter <| Maybe.withDefault "e2w" <| getAt model.index model.currentChord

                shiftedNote =
                    { note | frequency = note.frequency * (1.059463 ^ toFloat model.pitchShift), sustain = note.sustain * (toFloat model.sliderValue / 2) }
            in
                ( { model | index = model.index + 1 }
                , send (PlayBundle shiftedNote "triangle")
                )

subscriptions : Model -> Sub Msg
subscriptions model =
    let
        val =
            toFloat model.sliderValue / 10.0
    in
        if model.index < List.length model.currentChord then
                Time.every (val * Time.second) (always SendNotes) 
                
