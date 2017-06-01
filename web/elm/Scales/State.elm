module Scales.State exposing (..)

import Scales.Types as Scale exposing (Model, Msg(..), PlayBundle)
import Types as App exposing (Model)
import Logic.Ports exposing (send)
import Time
import Update.Extra.Infix exposing ((:>))
import List.Extra exposing (getAt)
import Logic.Audio exposing (noteSorter)


initialModel : Scale.Model
initialModel =
    { musKey = "C"
    , currentChord = []
    , pitchShift = 0
    , index = 6
    }


initialCommands : Cmd Msg
initialCommands =
    Cmd.none


initStrumArrows : List (List Int)
initStrumArrows =
    [ [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    ]


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
