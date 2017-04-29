module Views.Chords exposing (chordChartPage, keyList, chordChartModel, playbackSpeedSlider)

import Html exposing (Html, div, span, a, text, option, input)
import Html.Attributes exposing (style, value, type_, href)
import Html.Events exposing (onClick, onInput)
import List.Extra exposing (getAt)
import Logic.Audio exposing (notes)
import Logic.Types exposing (Model, ChordChartData, Msg(..), Dot)
import Logic.Routing exposing (scalesPath)
import Styles.ChordStyles exposing (..)


chordChartPage : Model -> Html Msg
chordChartPage model =
    let
        soloFretMin =
            Maybe.withDefault "0" (getAt 7 <| (keys model.musKey).names)

        soloFretMaj =
            toString (((Result.withDefault 0 <| String.toInt soloFretMin) + 3) % 12)

        keyOptions key =
            option [ value key ] [ text key ]
    in
        div [ style [ ( "textAlign", "center" ), ( "width", "95vw" ) ] ]
            [ div [] [ fingerChart ]
            , playbackSpeedSlider "CHORD ARPEGGIO SPEED" model
            , div [ chartContainerStyle "row" ]
                [ chordChartModel model 0 "I" .i .i
                , chordChartModel model 3 "IV" .iv .iv
                , chordChartModel model 4 "V" .v .v
                , chordChartModel model 5 "VI" .vi .vi
                ]
            , div [ chartContainerStyle "row" ]
                [ chordChartModel model 1 "II" .ii .ii
                , chordChartModel model 2 "III" .iii .iii
                , chordChartModel model 6 "VII" .vii .vii
                ]
            , div [ style [ ( "fontSize", "18px" ), ( "paddingBottom", "50px" ), ( "color", "#A8A7A7" ), ( "textDecoration", "inherit" ) ] ]
                [ span [] [ text "SOLO ON FRET: " ]
                , span [ style [ ( "fontSize", "25px" ), ( "color", "#E84A5F" ) ] ] [ text soloFretMin ]
                , a [ style [ ( "color", "#aaa" ) ], href (scalesPath model.musKey) ] [ text " (MINOR SCALE), OR FRET: " ]
                , span [ style [ ( "fontSize", "25px" ), ( "color", "#E84A5F" ) ] ] [ text soloFretMaj ]
                , a [ style [ ( "color", "#aaa" ) ], href (scalesPath model.musKey) ] [ text " (MAJOR SCALE)" ]
                ]
            , chordModal model
            ]



--chordChartModel : Model -> Int -> String -> ({ m | i : a } -> a) -> Html Msg


chordChartModel model index name accessor1 accessor2 =
    div [ chartContainerStyle "column", onClick (Play (notes model.musKey |> accessor1) 0) ]
        [ div [] [ chordBarPosition index model.musKey ]
        , chordChart <| chordBuilder (keys model.musKey |> accessor2)
        , div [ chordNameStyle ] [ chordFunction index model.musKey ]
        , div [ chordFunctionStyle ] [ text name ]
        ]


{-| Determines color of chord chart dot.
-}
fingerNo : String -> String
fingerNo finger =
    case finger of
        "b" ->
            "bar"

        "1" ->
            "#636363"

        "2" ->
            "#E8175D"

        "3" ->
            "#17c6e8"

        "4" ->
            "#A8A7A7"

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
            "-30"

        "1" ->
            "15"

        "2" ->
            "58"

        "3" ->
            "102"

        "4" ->
            "145"

        _ ->
            "-30"


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
chordChart : Html Msg -> Html Msg
chordChart chord =
    div [ chartContainerStyle "row" ]
        [ div [ chartStyle ]
            [ div [ stringStyle ] []
            , div [ stringStyle ] []
            , div [ stringStyle ] []
            , div [ stringStyle ] []
              -- , div [ stringStyle ] []
            , div [ fretStyle 1 ] []
            , div [ fretStyle 2 ] []
            , div [ fretStyle 3 ] []
            , chord
            ]
        , div [ nutStyle ] []
        ]


{-| Shows a key defining which finger has which color.
-}
fingerChart : Html Msg
fingerChart =
    div [ fingerChartStyle ]
        [ div [ style [ ( "display", "flex" ) ] ]
            [ div [ style [ ( "width", "15px" ), ( "height", "25px" ), ( "borderRadius", "7px" ), ( "backgroundColor", fingerNo "1" ) ] ] []
            , div [ style [ ( "padding", "15px" ), ( "lineHeight", "9px" ) ] ] [ text "Pointer" ]
            , div [ style [ ( "width", "15px" ), ( "height", "25px" ), ( "borderRadius", "7px" ), ( "backgroundColor", fingerNo "2" ) ] ] []
            , div [ style [ ( "padding", "15px" ), ( "lineHeight", "9px" ) ] ] [ text "Middle" ]
            , div [ style [ ( "width", "15px" ), ( "height", "25px" ), ( "borderRadius", "7px" ), ( "backgroundColor", fingerNo "3" ) ] ] []
            , div [ style [ ( "padding", "15px" ), ( "lineHeight", "9px" ) ] ] [ text "Ring" ]
            , div [ style [ ( "width", "15px" ), ( "height", "25px" ), ( "borderRadius", "7px" ), ( "backgroundColor", fingerNo "4" ) ] ] []
            , div [ style [ ( "padding", "15px" ), ( "lineHeight", "9px" ) ] ] [ text "Pinky" ]
            ]
        ]


keyList : List String
keyList =
    [ "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F", "a", "e", "b", "f#", "c#", "g#", "d#", "bb", "f", "c", "g", "d" ]


playbackSpeedSlider message model =
    div [ style [ ( "marginTop", "10px" ) ] ]
        [ div [] [ text ("+ " ++ message ++ " -") ]
        , input
            [ type_ "range"
            , Html.Attributes.min "1"
            , Html.Attributes.max "10"
            , value <| toString model.sliderValue
            , onInput ChangeSliderValue
            ]
            []
        ]


chordModal model =
    div [ chordModalStyle model ]
        [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
        , div [] [ text ("Chord Page. Instructions Coming Soon! Key: " ++ model.musKey) ]
        ]


{-| Defines dot placement of each chord. Groupes as "FSfFSfFSf..." where
F = Finger no (b for bar), S = String no, f = fret no.
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
            , vii = "06x152243434323010"
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
            , iii = "b62354444132122112"
            , iv = "06x050142232322010"
            , v = "060252141332020412"
            , vi = "06x05x344434223112"
            , vii = "06x05x141332221412"
            , names = [ "E", "F#m", "G#m", "A", "B7", "C#m", "D#dim7", "9" ]
            , bars = [ "", "", "4", "", "", "4", "" ]
            }

        "B" ->
            { i = "06xb52244334424112"
            , ii = "06xb52344434223112"
            , iii = "06xb52344434223112"
            , iv = "060252342131020010"
            , v = "b62354444233122112"
            , vi = "b62354444132122112"
            , vii = "06x151242030322010"
            , names = [ "B", "C#m", "D#m", "E", "F#", "G#m", "A#dim7", "4" ]
            , bars = [ "", "4", "6", "", "", "4", "" ]
            }

        "F#" ->
            { i = "b62354444233122112"
            , ii = "b62354444132122112"
            , iii = "b62354444132122112"
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "06xb52344434223112"
            , vii = "06x05x143334223414"
            , names = [ "F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim7", "11" ]
            , bars = [ "", "4", "6", "", "4", "6", "" ]
            }

        "Db" ->
            { i = "06xb52244334424112"
            , ii = "06xb52344434223112"
            , iii = "b61353443131121111"
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "b62354444132122112"
            , vii = "06x2533441324240x0"
            , names = [ "Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim7", "6" ]
            , bars = [ "4", "6", "", "", "4", "6", "" ]
            }

        "Ab" ->
            { i = "b62354444233122112"
            , ii = "b62354444132122112"
            , iii = "06xb52344434223112"
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "b61353443131121111"
            , vii = "06x05x142333222413"
            , names = [ "Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim7", "1" ]
            , bars = [ "4", "6", "3", "4", "6", "", "5" ]
            }

        "Eb" ->
            { i = "06xb52244334424112"
            , ii = "b61353443131121111"
            , iii = "b62354444132122112"
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "06xb52344434223112"
            , vii = "06x2533441324240x0"
            , names = [ "Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim7", "8" ]
            , bars = [ "6", "", "3", "4", "6", "3", "4" ]
            }

        "Bb" ->
            { i = "06xb51243333423111"
            , ii = "06xb52344434223112"
            , iii = "06xb52344434223112"
            , iv = "06xb52244334424112"
            , v = "b61353443232121111"
            , vi = "b62354444132122112"
            , vii = "06x05x141332221412"
            , names = [ "Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim7", "3" ]
            , bars = [ "", "3", "5", "6", "", "3", "" ]
            }

        "F" ->
            { i = "06x05x343232121010"
            , ii = "b62354444132122112"
            , iii = "06x050242332121010"
            , iv = "06xb51243333423111"
            , v = "06x353242030121010"
            , vi = "06x05x040232423111"
            , vii = "060151242030423010"
            , names = [ "F", "Gm", "Am", "Bb", "C", "Dm", "Edim7", "10" ]
            , bars = [ "", "3", "5", "", "", "", "" ]
            }

        -- --12mor Keys.
        "a" ->
            { i = "06x050242332121010"
            , ii = "06x15224343432301x"
            , iii = "06x353242030121010"
            , iv = "06x05x040232423111"
            , v = "060152242030020010"
            , vi = "06x05x343232121010"
            , vii = "263152040030323413"
            , names = [ "Am", "Bdim7", "C", "Dm", "Em", "F", "G", "5" ]
            , bars = [ "", "", "", "", "", "", "" ]
            }

        "e" ->
            { i = "060152242030020010"
            , ii = "b62253344132424112"
            , iii = "263152040030323413"
            , iv = "06x050242332121010"
            , v = "06x152040030323212"
            , vi = "06x353242030121010"
            , vii = "06x05x040132323212"
            , names = [ "Em", "F#dim7", "G", "Am", "Bm", "C", "D", "0" ]
            , bars = [ "", "", "", "", "", "", "" ]
            }

        "b" ->
            { i = "06x05x344434223112"
            , ii = "06x253344132424010"
            , iii = "06x05x040132323212"
            , iv = "060152242030020010"
            , v = "162050040232322010"
            , vi = "263152040030323413"
            , vii = "06x050142232322010"
            , names = [ "Bm", "C#dim7", "D", "Em", "F#m", "G", "A", "7" ]
            , bars = [ "", "3", "", "", "", "", "" ]
            }

        "f#" ->
            { i = "b62354444132122112"
            , ii = "b62253344132424112"
            , iii = "06x050142232322010"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "06x05x040132323212"
            , vii = "060252342131020010"
            , names = [ "F#m", "G#dim7", "A", "Bm", "C#m", "D", "E", "2" ]
            , bars = [ "", "4", "", "", "4", "", "" ]
            }

        "c#" ->
            { i = "06xb52344434223112"
            , ii = "06x05x141332221412"
            , iii = "060252342131020010"
            , iv = "b62354444132122112"
            , v = "b62354444132122112"
            , vi = "06x050142232322010"
            , vii = "06xb52244334424112"
            , names = [ "C#m", "D#dim7", "E", "F#m", "G#m", "A", "B", "9" ]
            , bars = [ "4", "", "", "", "4", "", "" ]
            }

        "g#" ->
            { i = "b62354444132122112"
            , ii = "06x151242030322010"
            , iii = "06xb52244334424112"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "060252342131020010"
            , vii = "b62354444233122112"
            , names = [ "G#m", "A#dim7", "B#", "C#m", "D#m", "E", "F#", "4" ]
            , bars = [ "4", "", "3", "4", "6", "", "" ]
            }

        "d#" ->
            { i = "06xb52344434223112"
            , ii = "06x05x143334223414"
            , iii = "b62354444233122112"
            , iv = "b62354444132122112"
            , v = "b62354444132122112"
            , vi = "06xb52244334424112"
            , vii = "06xb52244334424112"
            , names = [ "D#m", "E#dim7", "F#", "G#m", "A#m", "B", "C#", "11" ]
            , bars = [ "6", "", "", "4", "6", "", "4" ]
            }

        "bb" ->
            { i = "b62354444132122112"
            , ii = "06x2533441324240x0"
            , iii = "06x05x040132323212"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "b62354444233122112"
            , vii = "b62354444233122112"
            , names = [ "Bbm", "Cdim7", "D", "Ebm", "Fm", "Gb", "Ab", "6" ]
            , bars = [ "6", "", "", "6", "8", "", "4" ]
            }

        "f" ->
            { i = "b61353443131111111"
            , ii = "06x05x142333222413"
            , iii = "b62354444233122112"
            , iv = "06xb51343433222111"
            , v = "06xb52344434223112"
            , vi = "06xb52244334424112"
            , vii = "06xb52244334424112"
            , names = [ "Fm", "Gdim7", "Ab", "Bbm", "Cm", "Db", "Eb", "1" ]
            , bars = [ "", "5", "", "", "3", "4", "6" ]
            }

        "c" ->
            { i = "06xb52344434223112"
            , ii = "06x2533441324240x0"
            , iii = "06xb52244334424112"
            , iv = "b61353443131121111"
            , v = "b62354444132122112"
            , vi = "b62354444233122112"
            , vii = "06xb51243333423111"
            , names = [ "Cm", "Ddim7", "Eb", "Fm", "Gm", "Ab", "Bb", "8" ]
            , bars = [ "3", "4", "6", "", "3", "6", "" ]
            }

        "g" ->
            { i = "b62354444132122112"
            , ii = "06x05x141332221412"
            , iii = "06xb51243333423111"
            , iv = "06xb52344434223112"
            , v = "06x05x040232423111"
            , vi = "06xb52244334424112"
            , vii = "b61353443232121111"
            , names = [ "Gm", "Adim7", "Bb", "Cm", "Dm", "Eb", "F", "3" ]
            , bars = [ "3", "", "", "3", "", "6", "" ]
            }

        "d" ->
            { i = "06x05x040232423111"
            , ii = "060151242030423010"
            , iii = "06x05x343232121010"
            , iv = "b62354444132122112"
            , v = "06x050242332121010"
            , vi = "06xb51243333423111"
            , vii = "06x353242030121010"
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
