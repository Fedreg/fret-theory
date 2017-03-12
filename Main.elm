module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import String exposing (..)
import List.Extra exposing (getAt)


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
    , stringNo : String
    , fretNo : String
    }


model =
    { musKey = "c"
    }


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
    div [ style [ ( "textAlign", "center" ) ] ]
        [ select [ style [ ( "color", "#fff" ), ( "width", "100px" ), ( "marginTop", "50px" ) ], Html.Events.onInput ChangeKey ]
            [ option [ value "c" ] [ text "C" ]
            , option [ value "g" ] [ text "G" ]
            , option [ value "d" ] [ text "D" ]
            , option [ value "a" ] [ text "A" ]
            ]
        , div [ chartContainerStyle "row" ]
            [ div [ chartContainerStyle "column" ]
                [ chordChart <| chordBuilder (keys model.musKey).i
                , div [ chordNameStyle ] [ text <| Maybe.withDefault "C" (getAt 0 <| (keys model.musKey).names) ]
                , div [ chordFunctionStyle ] [ text "I" ]
                ]
            , div [ chartContainerStyle "column" ]
                [ chordChart <| chordBuilder (keys model.musKey).iv
                , div [ chordNameStyle ] [ text <| Maybe.withDefault "C" (getAt 1 <| (keys model.musKey).names) ]
                , div [ chordFunctionStyle ] [ text "IV" ]
                ]
            , div [ chartContainerStyle "column" ]
                [ chordChart <| chordBuilder (keys model.musKey).v
                , div [ chordNameStyle ] [ text <| Maybe.withDefault "C" (getAt 2 <| (keys model.musKey).names) ]
                , div [ chordFunctionStyle ] [ text "V" ]
                ]
            , div [ chartContainerStyle "column" ]
                [ chordChart <| chordBuilder (keys model.musKey).vi
                , div [ chordNameStyle ] [ text <| Maybe.withDefault "C" (getAt 3 <| (keys model.musKey).names) ]
                , div [ chordFunctionStyle ] [ text "VI" ]
                ]
            ]
        , div [ style [ ( "fontSize", "30px" ) ] ] [ text ("Solo on fret: " ++ Maybe.withDefault "0" (getAt 4 <| (keys model.musKey).names)) ]
        ]


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


keys key =
    case key of
        "c" ->
            { i = "06x353242030121010"
            , iv = "06x06x343232121010"
            , v = "263152040030323413"
            , vi = "06x050242332121010"
            , names = [ "C", "F", "G", "Amin", "5" ]
            }

        "g" ->
            { i = "263152040030323413"
            , iv = "06x253142030323413"
            , v = "06x05x040132323212"
            , vi = "060152242030020010"
            , names = [ "G", "C9", "D", "Emin", "0 or 12" ]
            }

        "d" ->
            { i = "06x05x040132323212"
            , iv = "263152040030323413"
            , v = "06x050142232322010"
            , vi = "06x152040030323212"
            , names = [ "D", "G", "A", "Bmin", "7" ]
            }

        "a" ->
            { i = "06x050142232322010"
            , iv = "06x05x040132323212"
            , v = "060252342131020010"
            , vi = "162050040232322010"
            , names = [ "A", "D", "E", "F#min", "2" ]
            }

        _ ->
            { i = ""
            , iv = ""
            , v = ""
            , vi = ""
            , names = [ "", "", "", "", "" ]
            }


chartStyle =
    style [ ( "position", "relative" ), ( "width", "180px" ), ( "height", "153px" ), ( "border", "3px solid #333" ), ( "borderBottom", "none" ) ]


stringStyle =
    style [ ( "width", "180px" ), ( "height", "30px" ), ( "borderBottom", "3px solid #333" ) ]


nutStyle =
    style [ ( "width", "10px" ), ( "height", "153px" ), ( "backgroundColor", "#333" ), ( "borderBottom", "3px solid #333" ) ]


chartContainerStyle direction =
    style [ ( "display", "flex" ), ( "margin", "25px auto" ), ( "flexDirection", direction ) ]


fretStyle fret =
    style [ ( "position", "absolute" ), ( "top", "0" ), ( "right", (Basics.toString (43 * fret) ++ "px") ), ( "height", "150px" ), ( "borderRight", "3px solid #333" ) ]


chordNameStyle =
    style [ ( "color", "#E8F1F2" ), ( "fontSize", "50px" ), ( "marginLeft", "150px" ), ( "margin", "0 auto" ) ]


chordFunctionStyle =
    style [ ( "color", "#3A86FF" ), ( "fontSize", "30px" ), ( "marginLeft", "150px" ), ( "margin", "0 auto" ) ]


fretMarkerStyle dot =
    if dot.fretNo == "-40" then
        let
            textColor =
                "#777"
        in
            style [ ( "position", "absolute" ), ( "top", dot.stringNo ), ( "right", dot.fretNo ), ( "width", "25px" ), ( "height", "25px" ), ( "borderRadius", "13px" ), ( "backgroundColor", "rgba(0,0,0,0)" ), ( "color", textColor ), ( "textTransform", "uppercase" ) ]
    else
        style [ ( "transition", "all 1s ease" ), ( "position", "absolute" ), ( "top", dot.stringNo ), ( "right", dot.fretNo ), ( "width", "25px" ), ( "height", "25px" ), ( "borderRadius", "13px" ), ( "backgroundColor", dot.tint ), ( "color", "rgba(0,0,0,0)" ) ]
