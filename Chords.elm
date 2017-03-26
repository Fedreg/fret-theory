module Chords exposing (chordChartPage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import String exposing (..)
import List.Extra exposing (getAt)
import Audio exposing (..)
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
                (List.map keyOptions keyList)
            , div [ chartContainerStyle "row" ]
                [ chordChartModel model 0 "I" .i .i
                , chordChartModel model 3 "IV" .iv .iv
                , chordChartModel model 4 "V" .v .v
                , chordChartModel model 5 "VI" .vi .vi
                ]
            , div [ style [ ( "fontSize", "20px" ) ] ] [ text ("Solo on fret: " ++ soloFretMin ++ " (Minor scale), or fret: " ++ soloFretMaj ++ " (Major scale)") ]
            , div [ style [ ( "paddingTop", "50px" ), ( "fontSize", "20px" ) ] ] [ text "ADDITIONAL CHORD OPTIONS:" ]
            , div [ chartContainerStyle "row" ]
                [ chordChartModel model 1 "II" .ii .ii
                , chordChartModel model 2 "III" .iii .iii
                , chordChartModel model 6 "VII" .vii .vii
                ]
            ]



--chordChartModel : Model -> Int -> String -> ({ m | i : a } -> a) -> Html Msg


chordChartModel model index name accessor1 accessor2 =
    div [ chartContainerStyle "column" ]
        [ div [] [ chordBarPosition index model.musKey ]
        , chordChart <| chordBuilder ((keys model.musKey) |> accessor1)
        , div [ chordNameStyle, onClick (Play ((Audio.notes model.musKey) |> accessor2)) ] [ chordFunction index model.musKey ]
        , div [ chordFunctionStyle, onClick (Play ((Audio.notes model.musKey) |> accessor2)) ] [ text name ]
        ]


{-| Determines color of chord chart dot.
-}
fingerNo : String -> String
fingerNo finger =
    case finger of
        "b" ->
            "bar"

        "1" ->
            "#333"

        "2" ->
            "#8338EC"

        "3" ->
            "#3A86FF"

        "4" ->
            "#00059f"

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
            getAt index (keys key).bars
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


keyList : List String
keyList =
    [ "Major Keys", "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F", "Minor Keys", "a", "e", "b", "f#", "c#", "g#", "d#", "bb", "f", "c", "g", "d" ]


{-| Defines dot placement of each chord.
-}
keys : String -> ChordChartData
keys key =
    case key of
        "C" ->
            { i = "06x353242030121010"
            , ii = "06x05x040232423111"
            , iii = "060152242030020010"
            , iv = "06x06x343232121010"
            , v = "263152040030323413"
            , vi = "06x050242332121010"
            , vii = "06x15224343432301x"
            , names = [ "C", "Dm", "Em", "F", "G", "Am", "Bdim7", "5" ]
            , bars = [ "", "", "", "", "", "", "" ]
            }

        "G" ->
            { i = "263152040030323413"
            , ii = "06x050242332121010"
            , iii = "06x152040030323212"
            , iv = "06x253142030323413"
            , v = "06x05x040132323212"
            , vi = "060152242030020010"
            , vii = "b62253344132424112"
            , names = [ "G", "Am", "Bm", "C9", "D", "Em", "F#dim7", "0" ]
            , bars = [ "", "", "", "", "", "", "", "" ]
            }

        "D" ->
            { i = "06x05x040132323212"
            , ii = "060152242030020010"
            , iii = "162050040232322010"
            , iv = "263152040030323413"
            , v = "06x050142232322010"
            , vi = "06x152040030323212"
            , vii = "06x15224343432301x"
            , names = [ "D", "Em", "F#m", "G", "A", "Bm", "C#dim7", "7" ]
            , bars = [ "", "", "", "", "", "", "4" ]
            }

        "A" ->
            { i = "06x050142232322010"
            , ii = "06x152040030323212"
            , iii = "06x05x344434223112"
            , iv = "06x05x040132323212"
            , v = "060252342131020010"
            , vi = "162050040232322010"
            , vii = "b62253344132424112"
            , names = [ "A", "Bm", "C#m", "D", "E", "F#m", "G#dim7", "2" ]
            , bars = [ "", "", "", "", "", "", "4" ]
            }

        "E" ->
            { i = "060252342131020010"
            , ii = "162050040232322010"
            , iii = "b62354444233122112"
            , iv = "06x050142232322010"
            , v = "060252141332020412"
            , vi = "06x05x344434223112"
            , vii = "06x05x141332221412"
            , names = [ "E", "F#m", "G#m", "A", "B7", "C#m", "D#dim7", "9" ]
            , bars = [ "", "", "", "", "", "", "" ]
            }

        "B" ->
            { i = "06xb52244334424112"
            , ii = ""
            , iii = ""
            , iv = "060252342131020010"
            , v = "b62354444233122112"
            , vi = "b62354444132122112"
            , vii = ""
            , names = [ "B", "C#m", "D#m", "E", "F#", "G#m", "A#dim7", "4" ]
            , bars = [ "", "", "", "", "", "4", "" ]
            }

        "F#" ->
            { i = "b62354444233122112"
            , ii = ""
            , iii = ""
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "06xb52344434223112"
            , vii = ""
            , names = [ "F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim7", "11" ]
            , bars = [ "", "", "", "", "4", "6", "" ]
            }

        "Db" ->
            { i = "06xb52244334424112"
            , ii = ""
            , iii = ""
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "06xb52344434223112"
            , vii = ""
            , names = [ "Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim7", "6" ]
            , bars = [ "4", "", "", "", "4", "", "" ]
            }

        "Ab" ->
            { i = "b62354444233122112"
            , ii = ""
            , iii = ""
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "b61353443131121111"
            , vii = ""
            , names = [ "Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim7", "1" ]
            , bars = [ "4", "", "", "4", "6", "", "" ]
            }

        "Eb" ->
            { i = "06xb52244334424112"
            , ii = ""
            , iii = ""
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "06xb52344434223112"
            , vii = ""
            , names = [ "Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim7", "4" ]
            , bars = [ "6", "", "", "4", "6", "3", "" ]
            }

        "Bb" ->
            { i = "06xb51243333423111"
            , ii = ""
            , iii = ""
            , iv = "06xb52244334424112"
            , v = "b61353443232121111"
            , vi = "b62354444132122112"
            , vii = ""
            , names = [ "Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim7", "3" ]
            , bars = [ "", "", "", "6", "", "3", "" ]
            }

        "F" ->
            { i = "06x05x343232121010"
            , ii = ""
            , iii = ""
            , iv = "06xb51243333423111"
            , v = "06x353242030121010"
            , vi = "06x05x040232423111"
            , vii = ""
            , names = [ "F", "Gm", "Am", "Bb", "C", "Dm", "Edim7", "10" ]
            , bars = [ "", "", "", "", "", "", "" ]
            }

        -- --12mor Keys.
        "a" ->
            { i = "06x050242332121010"
            , ii = ""
            , iii = ""
            , iv = "06x05x040232423111"
            , v = "060152242030020010"
            , vi = "06x05x343232121010"
            , vii = ""
            , names = [ "Am", "Bdim7", "C", "Dm", "Em", "F", "G", "5" ]
            , bars = [ "", "", "", "", "", "", "" ]
            }

        "e" ->
            { i = "060152242030020010"
            , ii = ""
            , iii = ""
            , iv = "06x050242332121010"
            , v = "06x152040030323212"
            , vi = "06x353242030121010"
            , vii = ""
            , names = [ "Em", "F#dim7", "G", "Am", "Bm", "C", "D", "0" ]
            , bars = [ "", "", "", "", "", "", "" ]
            }

        "b" ->
            { i = "06x05x344434223112"
            , ii = ""
            , iii = ""
            , iv = "060152242030020010"
            , v = "162050040232322010"
            , vi = "263152040030323413"
            , vii = ""
            , names = [ "Bm", "C#dim7", "D", "Em", "F#m", "G", "A", "7" ]
            , bars = [ "", "", "", "", "", "", "" ]
            }

        "f#" ->
            { i = "b62354444132122112"
            , ii = ""
            , iii = ""
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "06x05x040132323212"
            , vii = ""
            , names = [ "F#m", "G#dim7", "A", "Bm", "C#m", "D", "E", "2" ]
            , bars = [ "", "", "", "", "4", "", "" ]
            }

        "c#" ->
            { i = "06xb52344434223112"
            , ii = ""
            , iii = ""
            , iv = "b62354444132122112"
            , v = "b62354444132122112"
            , vi = "06x050142232322010"
            , vii = ""
            , names = [ "C#m", "D#dim7", "E", "F#m", "G#m", "A", "B", "9" ]
            , bars = [ "4", "", "", "", "4", "", "" ]
            }

        "g#" ->
            { i = "b62354444132122112"
            , ii = ""
            , iii = ""
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "060152242131020010"
            , vii = ""
            , names = [ "G#m", "A#dim7", "B#", "C#m", "D#m", "E", "F#", "4" ]
            , bars = [ "4", "", "", "4", "6", "", "" ]
            }

        "d#" ->
            { i = "06xb52344434223112"
            , ii = ""
            , iii = ""
            , iv = "b62354444132122112"
            , v = "b62354444132122112"
            , vi = "06xb52244334424112"
            , vii = ""
            , names = [ "D#m", "E#dim7", "F#", "G#m", "A#m", "B", "C#", "11" ]
            , bars = [ "6", "", "", "4", "6", "", "" ]
            }

        "bb" ->
            { i = "b62354444132122112"
            , ii = ""
            , iii = ""
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "b62354444233122112"
            , vii = ""
            , names = [ "Bbm", "Cdim7", "D", "Ebm", "Fm", "Gb", "Ab", "6" ]
            , bars = [ "6", "", "", "6", "8", "", "" ]
            }

        "f" ->
            { i = "b61353443131111111"
            , ii = ""
            , iii = ""
            , iv = "06xb51343433222111"
            , v = "06xb52344434223112"
            , vi = "06xb52244334424112"
            , vii = ""
            , names = [ "Fm", "Gdim7", "Ab", "Bbm", "Cm", "Db", "Eb", "1" ]
            , bars = [ "", "", "", "", "3", "4", "" ]
            }

        "c" ->
            { i = "06xb52344434223112"
            , ii = ""
            , iii = ""
            , iv = "b61353443131121111"
            , v = "b62354444132122112"
            , vi = "b62354444233122112"
            , vii = ""
            , names = [ "Cm", "Ddim7", "Eb", "Fm", "Gm", "Ab", "Bb", "8" ]
            , bars = [ "3", "", "", "", "3", "6", "" ]
            }

        "g" ->
            { i = "b62354444132122112"
            , ii = ""
            , iii = ""
            , iv = "06xb52344434223112"
            , v = "06x05x040232423111"
            , vi = "06xb52244334424112"
            , vii = ""
            , names = [ "Gm", "Adim7", "Bb", "Cm", "Dm", "Eb", "Ab", "3" ]
            , bars = [ "3", "", "", "3", "", "6", "" ]
            }

        "d" ->
            { i = "06x05x040232423111"
            , ii = ""
            , iii = ""
            , iv = "b62354444132122112"
            , v = "06x050242332121010"
            , vi = "06xb51243333423111"
            , vii = ""
            , names = [ "Dm", "Edim7", "F", "Gm", "Am", "Bb", "C", "10" ]
            , bars = [ "", "", "", "3", "", "", "" ]
            }

        _ ->
            { i = ""
            , ii = ""
            , iii = ""
            , iv = ""
            , v = ""
            , vi = ""
            , vii = ""
            , names = [ "" ]
            , bars = [ "" ]
            }



-- STYLES


chordBarPosStyle : Attribute Msg
chordBarPosStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "-15px" )
        , ( "right", "30%" )
        , ( "color", "#3A86FF" )
        , ( "transition", "all 0.3s ease" )
        ]


chartStyle : Attribute Msg
chartStyle =
    style
        [ ( "position", "relative" )
        , ( "width", "180px" )
        , ( "height", "153px" )
        , ( "border", "1px solid #333" )
        , ( "borderBottom", "none" )
        ]


stringStyle : Attribute Msg
stringStyle =
    style
        [ ( "width", "180px" )
        , ( "height", "30px" )
        , ( "borderBottom", "1px solid #333" )
        ]


nutStyle : Attribute Msg
nutStyle =
    style
        [ ( "width", "10px" )
        , ( "height", "153px" )
        , ( "backgroundColor", "#333" )
        , ( "borderBottom", "1px solid #333" )
        ]


chartContainerStyle : String -> Attribute Msg
chartContainerStyle direction =
    style
        [ ( "position", "relative" )
        , ( "display", "flex" )
        , ( "margin", "25px auto" )
        , ( "flexDirection", direction )
        , ( "transition", "all 0.3s ease" )
        ]


fretStyle : Int -> Attribute Msg
fretStyle fret =
    style
        [ ( "position", "absolute" )
        , ( "top", "0" )
        , ( "right", (Basics.toString (43 * fret) ++ "px") )
        , ( "height", "150px" )
        , ( "borderRight", "1px solid #333" )
        ]


chordNameStyle : Attribute Msg
chordNameStyle =
    style
        [ ( "cursor", "pointer" )
        , ( "color", "#E8F1F2" )
        , ( "fontSize", "50px" )
        , ( "marginLeft", "150px" )
        , ( "margin", "0 auto" )
        ]


chordFunctionStyle : Attribute Msg
chordFunctionStyle =
    style
        [ ( "cursor", "pointer" )
        , ( "color", "#3A86FF" )
        , ( "fontSize", "30px" )
        , ( "marginLeft", "150px" )
        , ( "margin", "0 auto" )
        ]


fingerChartStyle : Attribute Msg
fingerChartStyle =
    style
        [ ( "display", "flex" )
        , ( "flexDirection", "column" )
        , ( "position", "absolute" )
        , ( "top", "20px" )
        , ( "left", "20px" )
        ]


{-| Determines if fret marker dot is a bar, a dot, or a 'X', or 'O'.
-}
fretMarkerStyle : Dot -> Attribute Msg
fretMarkerStyle dot =
    if dot.tint == "bar" then
        let
            stringHeight =
                Result.withDefault -15 (String.toInt dot.stringNo)

            barSize =
                toString (160 - stringHeight) ++ "px"
        in
            style
                [ ( "transition", "all 0.5s ease" )
                , ( "position", "absolute" )
                , ( "top", dot.stringNo )
                , ( "right", dot.fretNo )
                , ( "width", "25px" )
                , ( "height", barSize )
                , ( "borderRadius", "13px" )
                , ( "backgroundColor", "#333" )
                , ( "color", "rgba(0,0,0,0)" )
                ]
    else if dot.fretNo == "-40" then
        let
            textColor =
                "#777"
        in
            style
                [ ( "transition", "all 0.5s ease" )
                , ( "position", "absolute" )
                , ( "top", dot.stringNo )
                , ( "right", dot.fretNo )
                , ( "width", "25px" )
                , ( "height", "25px" )
                , ( "borderRadius", "13px" )
                , ( "backgroundColor", "rgba(0,0,0,0)" )
                , ( "color", textColor )
                , ( "textTransform", "uppercase" )
                ]
    else
        style
            [ ( "transition", "all 0.5s ease" )
            , ( "position", "absolute" )
            , ( "top", dot.stringNo )
            , ( "right", dot.fretNo )
            , ( "width", "25px" )
            , ( "height", "25px" )
            , ( "borderRadius", "13px" )
            , ( "backgroundColor", dot.tint )
            , ( "color", "rgba(0,0,0,0)" )
            ]
