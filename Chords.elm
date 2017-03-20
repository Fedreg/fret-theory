module Chords exposing (chordChartPage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import String exposing (..)
import List.Extra exposing (getAt)
import Styles exposing (..)
import Notes exposing (..)
import Keys exposing (..)
import Types exposing (..)


chordChartPage : Model -> Html Msg
chordChartPage model =
    let
        soloFretMin =
            Maybe.withDefault "0" (getAt 4 <| (keys model.musKey).names)

        soloFretMaj =
            toString (((Result.withDefault 0 <| String.toInt soloFretMin) + 3) % 12)

        keyOptions key =
            option [ value key ] [ text key ]
    in
        div [ style [ ( "textAlign", "center" ) ] ]
            [ div [] [ fingerChart ]
            , select [ style [ ( "color", "#fff" ), ( "width", "100px" ), ( "marginTop", "50px" ) ], Html.Events.onInput ChangeKey ]
                (List.map keyOptions Keys.keyList)
            , div [ chartContainerStyle "row" ]
                [ div [ chartContainerStyle "column" ]
                    [ div [] [ chordBarPosition 0 model.musKey ]
                    , chordChart <| chordBuilder (keys model.musKey).i
                    , div [ chordNameStyle, onClick (Play <| (Notes.notes model.musKey).i) ] [ chordFunction 0 model.musKey ]
                    , div [ chordFunctionStyle, onClick (Play <| (Notes.notes model.musKey).i) ] [ text "I" ]
                    ]
                , div [ chartContainerStyle "column" ]
                    [ div [] [ chordBarPosition 1 model.musKey ]
                    , chordChart <| chordBuilder (keys model.musKey).iv
                    , div [ chordNameStyle, onClick (Play <| (Notes.notes model.musKey).iv) ] [ chordFunction 1 model.musKey ]
                    , div [ chordFunctionStyle, onClick (Play <| (Notes.notes model.musKey).iv) ] [ text "IV" ]
                    ]
                , div [ chartContainerStyle "column" ]
                    [ div [] [ chordBarPosition 2 model.musKey ]
                    , chordChart <| chordBuilder (keys model.musKey).v
                    , div [ chordNameStyle, onClick (Play <| (Notes.notes model.musKey).v) ] [ chordFunction 2 model.musKey ]
                    , div [ chordFunctionStyle, onClick (Play <| (Notes.notes model.musKey).v) ] [ text "V" ]
                    ]
                , div [ chartContainerStyle "column" ]
                    [ div [] [ chordBarPosition 3 model.musKey ]
                    , chordChart <| chordBuilder (keys model.musKey).vi
                    , div [ chordNameStyle, onClick (Play <| (Notes.notes model.musKey).vi) ] [ chordFunction 3 model.musKey ]
                    , div [ chordFunctionStyle, onClick (Play <| (Notes.notes model.musKey).vi) ] [ text "VI" ]
                    ]
                ]
            , div [ style [ ( "fontSize", "20px" ) ] ] [ text ("Solo on fret: " ++ soloFretMin ++ " (Minor scale), or fret: " ++ soloFretMaj ++ " (Major scale)") ]
            ]


{-| Determines color of chord chart dot.
-}
fingerNo : String -> String
fingerNo finger =
    case finger of
        "b" ->
            "bar"

        "1" ->
            "#777"

        "2" ->
            "#8338EC"

        "3" ->
            "#3A86FF"

        "4" ->
            "#FF006E"

        _ ->
            "none"


{-| Determinses vertical position of chord chart dot.
-}
stringNo : String -> String
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


{-| Determines hotizontal position of chord chart dot.
-}
fretNo : String -> String
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


{-| Inserts chord name.
-}
chordFunction : Int -> String -> Html Msg
chordFunction num key =
    text <| Maybe.withDefault "0" (getAt num <| (keys key).names)


{-| Adds bar position marker above chord chart
-}
chordBarPosition : Int -> String -> Html Msg
chordBarPosition index key =
    let
        barPosition =
            getAt index (Keys.keys key).bars
    in
        if String.length (Maybe.withDefault "" barPosition) > 0 then
            div [ chordBarPosStyle ] [ text <| "Fret " ++ String.slice 1 2 (toString (Maybe.withDefault "" barPosition)) ]
        else
            div [] []


{-| Draws the dots on the chord chart.
-}
chordBuilder : String -> Html Msg
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


{-| Drawe blank chord chart.
-}
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


{-| Shows a key defining which finger has which color.
-}
fingerChart =
    div [ fingerChartStyle ]
        [ div [ style [ ( "display", "flex" ) ] ]
            [ div [ style [ ( "width", "15px" ), ( "height", "15px" ), ( "borderRadius", "13px" ), ( "backgroundColor", fingerNo "1" ) ] ] []
            , div [ style [ ( "padding", "5px" ), ( "lineHeight", "9px" ) ] ] [ text "Pointer" ]
            ]
        , div [ style [ ( "display", "flex" ) ] ]
            [ div [ style [ ( "width", "15px" ), ( "height", "15px" ), ( "borderRadius", "13px" ), ( "backgroundColor", fingerNo "2" ) ] ] []
            , div [ style [ ( "padding", "5px" ), ( "lineHeight", "9px" ) ] ] [ text "Middle" ]
            ]
        , div [ style [ ( "display", "flex" ) ] ]
            [ div [ style [ ( "width", "15px" ), ( "height", "15px" ), ( "borderRadius", "13px" ), ( "backgroundColor", fingerNo "3" ) ] ] []
            , div [ style [ ( "padding", "5px" ), ( "lineHeight", "9px" ) ] ] [ text "Ring" ]
            ]
        , div [ style [ ( "display", "flex" ) ] ]
            [ div [ style [ ( "width", "15px" ), ( "height", "15px" ), ( "borderRadius", "13px" ), ( "backgroundColor", fingerNo "4" ) ] ] []
            , div [ style [ ( "padding", "5px" ), ( "lineHeight", "9px" ) ] ] [ text "Pinky" ]
            ]
        ]
