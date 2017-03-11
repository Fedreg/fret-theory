module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import String exposing (..)


main =
    Html.program
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


type alias Model =
    { musKey : String }


type alias Dot =
    { tint : String
    , stringNo : Int
    , fretNo : Int
    }


model =
    { musKey = "C" }


init =
    ( model
    , Cmd.none
    )


type Msg
    = ChangeKey String


update msg model =
    case msg of
        ChangeKey key ->
            ( { model | musKey = key }
            , Cmd.none
            )


subscriptions model =
    Sub.none


fingerNo finger =
    case finger of
        "1" ->
            "aqua"

        "2" ->
            "magenta"

        "3" ->
            "deepPink"

        "4" ->
            "lime"

        _ ->
            "none"


stringNo string =
    case string of
        "1" ->
            135

        "2" ->
            105

        "3" ->
            75

        "4" ->
            45

        "5" ->
            15

        "6" ->
            -15

        _ ->
            -15


fretNo fret =
    case fret of
        "0" ->
            -40

        "1" ->
            10

        "2" ->
            53

        "3" ->
            97

        "4" ->
            140

        _ ->
            -40


chordBuilder chord =
    let
        string a b =
            String.slice a b chord
    in
        div []
            [ div [ fretMarkerStyle (Dot (fingerNo <| string 0 1) (stringNo <| string 1 2) (fretNo <| string 2 3)) ] []
            , div [ fretMarkerStyle (Dot (fingerNo <| string 3 4) (stringNo <| string 4 5) (fretNo <| string 5 6)) ] []
            , div [ fretMarkerStyle (Dot (fingerNo <| string 6 7) (stringNo <| string 7 8) (fretNo <| string 8 9)) ] []
            , div [ fretMarkerStyle (Dot (fingerNo <| string 9 10) (stringNo <| string 10 11) (fretNo <| string 11 12)) ] []
            , div [ fretMarkerStyle (Dot (fingerNo <| string 12 13) (stringNo <| string 13 14) (fretNo <| string 14 15)) ] []
            , div [ fretMarkerStyle (Dot (fingerNo <| string 15 16) (stringNo <| string 16 17) (fretNo <| string 17 18)) ] []
            ]


view model =
    div [ chartContainerStyle ]
        [ chordChart <| chordBuilder cMaj
        , chordChart <| chordBuilder fMaj
        , chordChart <| chordBuilder gMaj
        , chordChart <| chordBuilder aMin
        ]


chordChart chord =
    div [ chartContainerStyle ]
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


cMaj =
    "000353242032121000"


fMaj =
    "000000343232121000"


gMaj =
    "263152000000323413"


aMin =
    "000000242332121000"


chartStyle =
    style [ ( "position", "relative" ), ( "width", "180px" ), ( "height", "150px" ), ( "border", "3px solid #555" ), ( "borderBottom", "none" ) ]


stringStyle =
    style [ ( "width", "180px" ), ( "height", "30px" ), ( "borderBottom", "3px solid #555" ) ]


nutStyle =
    style [ ( "width", "10px" ), ( "height", "153px" ), ( "backgroundColor", "#555" ), ( "borderBottom", "3px solid #555" ) ]


chartContainerStyle =
    style [ ( "display", "flex" ), ( "margin", "20px" ) ]


fretStyle fret =
    style [ ( "position", "absolute" ), ( "top", "0" ), ( "right", (Basics.toString (43 * fret) ++ "px") ), ( "height", "150px" ), ( "borderRight", "3px solid #555" ) ]


fretMarkerStyle dot =
    style [ ( "position", "absolute" ), ( "top", (Basics.toString dot.stringNo) ), ( "right", (Basics.toString dot.fretNo) ), ( "width", "25px" ), ( "height", "25px" ), ( "borderRadius", "13px" ), ( "backgroundColor", dot.tint ) ]
