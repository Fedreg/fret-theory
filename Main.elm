port module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import String exposing (..)
import List.Extra exposing (getAt)
import Keys exposing (keys)
import Styles exposing (..)
import Notes exposing (..)
import Time exposing (..)
import Update.Extra.Infix exposing ((:>))


main =
    Html.program
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


type alias Model =
    { musKey : String
    , index : Int
    , currentChord : List String
    }


type alias Dot =
    { tint : String
    , stringNo : String
    , fretNo : String
    }


type alias PlayBundle =
    { note : Note
    , waveType : String
    }


model =
    { musKey = "c"
    , index = 6
    , currentChord = []
    }


init =
    ( model
    , Cmd.none
    )


type Msg
    = ChangeKey String
    | SendNotes
    | Play (List String)
    | ResetIndex


port send : PlayBundle -> Cmd msg


update msg model =
    case msg of
        ChangeKey key ->
            ( { model | musKey = key }
            , Cmd.none
            )

        Play chord ->
            ( { model | currentChord = chord }, Cmd.none )
                :> update ResetIndex
                :> update SendNotes

        ResetIndex ->
            ( { model | index = 0 }, Cmd.none )

        SendNotes ->
            let
                note =
                    Notes.noteSorter <| Maybe.withDefault "e2w" <| getAt model.index model.currentChord
            in
                ( { model | index = model.index + 1 }
                , send (PlayBundle note "triangle")
                )


subscriptions model =
    if model.index < 6 then
        Time.every (0.1 * Time.second) (always SendNotes)
    else
        Sub.none


fingerNo finger =
    case finger of
        "b" ->
            "bar"

        "1" ->
            "#E8F1F2"

        "2" ->
            "#8338EC"

        "3" ->
            "#3A86FF"

        "4" ->
            "#FF006E"

        _ ->
            "none"


stringNo string =
    case string of
        "1" ->
            "135"

        "2" ->
            "105"

        "3" ->
            "75"

        "4" ->
            "45"

        "5" ->
            "15"

        "6" ->
            "-15"

        _ ->
            ""


fretNo fret =
    case fret of
        "0" ->
            "-40"

        "1" ->
            "10"

        "2" ->
            "53"

        "3" ->
            "97"

        "4" ->
            "140"

        _ ->
            "-40"


chordBuilder chord =
    let
        string a b =
            String.slice a b chord
    in
        div []
            [ div [ fretMarkerStyle (Dot (fingerNo <| string 0 1) (stringNo <| string 1 2) (fretNo <| string 2 3)) ] [ text (string 2 3) ]
            , div [ fretMarkerStyle (Dot (fingerNo <| string 3 4) (stringNo <| string 4 5) (fretNo <| string 5 6)) ] [ text (string 5 6) ]
            , div [ fretMarkerStyle (Dot (fingerNo <| string 6 7) (stringNo <| string 7 8) (fretNo <| string 8 9)) ] [ text (string 8 9) ]
            , div [ fretMarkerStyle (Dot (fingerNo <| string 9 10) (stringNo <| string 10 11) (fretNo <| string 11 12)) ] [ text (string 11 12) ]
            , div [ fretMarkerStyle (Dot (fingerNo <| string 12 13) (stringNo <| string 13 14) (fretNo <| string 14 15)) ] [ text (string 14 15) ]
            , div [ fretMarkerStyle (Dot (fingerNo <| string 15 16) (stringNo <| string 16 17) (fretNo <| string 17 18)) ] [ text (string 17 18) ]
            ]


view model =
    let
        soloFretMin =
            Maybe.withDefault "0" (getAt 4 <| (keys model.musKey).names)

        soloFretMaj =
            toString ((Result.withDefault 0 <| String.toInt soloFretMin) + 3)
    in
        div [ style [ ( "textAlign", "center" ) ] ]
            [ select [ style [ ( "color", "#fff" ), ( "width", "100px" ), ( "marginTop", "50px" ) ], Html.Events.onInput ChangeKey ]
                [ option [ value "c" ] [ text "Major Keys" ]
                , option [ value "c" ] [ text "C" ]
                , option [ value "g" ] [ text "G" ]
                , option [ value "d" ] [ text "D" ]
                , option [ value "a" ] [ text "A" ]
                , option [ value "e" ] [ text "E" ]
                , option [ value "b" ] [ text "B" ]
                ]
            , div [ chartContainerStyle "row" ]
                [ div [ chartContainerStyle "column" ]
                    [ chordChart <| chordBuilder (keys model.musKey).i
                    , div [ chordNameStyle, onClick (Play <| (Notes.notes model.musKey).i) ] [ text <| Maybe.withDefault "C" (getAt 0 <| (keys model.musKey).names) ]
                    , div [ chordFunctionStyle, onClick (Play <| (Notes.notes model.musKey).i) ] [ text "I" ]
                    ]
                , div [ chartContainerStyle "column" ]
                    [ chordChart <| chordBuilder (keys model.musKey).iv
                    , div [ chordNameStyle, onClick (Play <| (Notes.notes model.musKey).iv) ] [ text <| Maybe.withDefault "C" (getAt 1 <| (keys model.musKey).names) ]
                    , div [ chordFunctionStyle, onClick (Play <| (Notes.notes model.musKey).iv) ] [ text "IV" ]
                    ]
                , div [ chartContainerStyle "column" ]
                    [ chordChart <| chordBuilder (keys model.musKey).v
                    , div [ chordNameStyle, onClick (Play <| (Notes.notes model.musKey).v) ] [ text <| Maybe.withDefault "C" (getAt 2 <| (keys model.musKey).names) ]
                    , div [ chordFunctionStyle, onClick (Play <| (Notes.notes model.musKey).v) ] [ text "V" ]
                    ]
                , div [ chartContainerStyle "column" ]
                    [ chordChart <| chordBuilder (keys model.musKey).vi
                    , div [ chordNameStyle, onClick (Play <| (Notes.notes model.musKey).vi) ] [ text <| Maybe.withDefault "C" (getAt 3 <| (keys model.musKey).names) ]
                    , div [ chordFunctionStyle, onClick (Play <| (Notes.notes model.musKey).vi) ] [ text "VI" ]
                    ]
                ]
            , div [ style [ ( "fontSize", "20px" ) ] ] [ text ("Solo on: Minor Scale, fret: " ++ soloFretMin ++ ", Major Scale, fret: " ++ soloFretMaj) ]
            ]


chordFunction num =
    text <| Maybe.withDefault "0" (getAt num <| (keys model.musKey).names)


chordChart chord =
    div [ chartContainerStyle "row" ]
        [ div [ chartStyle ]
            [ div [ stringStyle ] []
            , div [ stringStyle ] []
            , div [ stringStyle ] []
            , div [ stringStyle ] []
            , div [ stringStyle ] []
            , div [ fretStyle 1 ] []
            , div [ fretStyle 2 ] []
            , div [ fretStyle 3 ] []
            , chord
            ]
        , div [ nutStyle ] []
        ]
