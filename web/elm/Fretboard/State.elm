module Fretboard.State exposing (..)

import Fretboard.Types as FT exposing (..)
import Types exposing (Model)


initialModel : FT.Model
initialModel =
    { musKey = Types.Model.musKey
    , notePosition = 80.0
    , showAccidental = "0"
    }


initialCommands : Cmd Msg
initialCommands =
    Cmd.none


update : Msg -> FT.Model -> ( FT.Model, Cmd Msg )
update msg model =
    case msg of
        DrawNote index string accidental ->
            let
                stringOffset =
                    noteStringPos string

                fretOffset =
                    noteFretPos index

                finalOffset =
                    fretOffset + stringOffset
            in
                { model | notePosition = finalOffset, showAccidental = accidental } ! []


subscriptions : FT.Model -> Sub Msg
subscriptions model =
    always Sub.none

{-| More specifically determines note x position per note on fretboard.
-}
noteFretPos : String -> Float
noteFretPos index =
    let
        num =
            Result.withDefault 0 <| String.toInt index
    in
        toFloat num * 10.25

{-| Determines note x position per string.
-}
noteStringPos : String -> Float
noteStringPos stringNo =
    let
        num =
            Result.withDefault 0 <| String.toInt stringNo
    in
        case num of
            6 ->
                -8.0

            5 ->
                22.0

            4 ->
                52.0

            3 ->
                82.0

            2 ->
                104.0

            1 ->
                136.0

            _ ->
                0.0

