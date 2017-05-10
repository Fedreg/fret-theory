module Views.Chords exposing (chordChartPage, keyList, chordChartModel, blankKey)

import Html exposing (Html, div, span, a, text, option, h4)
import Html.Attributes exposing (style, value, href)
import Html.Events exposing (onClick)
import List.Extra exposing (getAt)
import Logic.Audio exposing (notes)
import Logic.Types exposing (Model, ChordChartData, Msg(..), Dot)
import Logic.Routing exposing (scalesPath)
import Styles.ChordStyles exposing (..)


chordChartPage : Model -> Html Msg
chordChartPage model =
    let
        soloFretMin =
            Maybe.withDefault "0" (getAt 11 <| (keys model.musKey).names)

        soloFretMaj =
            toString (((Result.withDefault 0 <| String.toInt soloFretMin) + 3) % 12)

        keyOptions key =
            option [ value key ] [ text key ]
    in
        div [ style [ ( "textAlign", "center" ), ( "width", "95vw" ), ( "paddingTop", "50px" ) ] ]
            [ div [] [ fingerChart ]
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
            , h4 [] [ text "7th CHORDS" ]
            , div [ chartContainerStyle "row" ]
                [ chordChartModel model 7 "I7" .i .i7
                , chordChartModel model 8 "IV7" .iv .iv7
                , chordChartModel model 9 "V7" .v .v7
                , chordChartModel model 10 "VI7" .vi .vi7
                ]
            , div [ style [ ( "fontSize", "18px" ), ( "paddingBottom", "50px" ), ( "color", "#A8A7A7" ), ( "textDecoration", "inherit" ) ] ]
                [ span [] [ text "SOLO ON FRET: " ]
                , span [ style [ ( "fontSize", "25px" ), ( "color", "#E84A5F" ) ] ] [ text soloFretMin ]
                , a [ style [ ( "color", "#aaa" ) ], href (scalesPath model.musKey) ] [ text " (MINOR SCALE), OR FRET: " ]
                , span [ style [ ( "fontSize", "25px" ), ( "color", "#E84A5F" ) ] ] [ text soloFretMaj ]
                , a [ style [ ( "color", "#aaa" ) ], href (scalesPath model.musKey) ] [ text " (MAJOR SCALE)" ]
                ]
            ]


chordChartModel model index name accessor1 accessor2 =
    div [ chartContainerStyle "column", onClick (Play (notes model.musKey |> accessor1) 0) ]
        [ div [] [ chordBarPosition index model.displayedChords ]
          -- Builds the chord chart based on the displayedChords brought in from Phx channel / DB.
        , chordChart <| chordBuilder (model.displayedChords |> accessor2)
        , div [ chordNameStyle ] [ chordFunction index model.displayedChords ]
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
            "#355c7d"

        "4" ->
            "#B8A7A7"

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
chordFunction : Int -> ChordChartData -> Html Msg
chordFunction num key =
    text <| Maybe.withDefault "0" (getAt num <| (key).names)


{-| Adds bar position marker above chord chart
-}
chordBarPosition : Int -> ChordChartData -> Html Msg
chordBarPosition index key =
    let
        barPosition =
            getAt index key.bars
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


blankKey : ChordChartData
blankKey =
    { i = ""
    , ii = ""
    , iii = ""
    , iv = ""
    , v = ""
    , vi = ""
    , vii = ""
    , i7 = ""
    , iv7 = ""
    , v7 = ""
    , vi7 = ""
    , names = [ "" ]
    , bars = [ "" ]
    , key = ""
    }


{-| Defines dot placement of each chord. Groupes as "FSfFSfFSf..." where
F = Finger no (b for bar), S = String no, f = fret no. TODO: Move this to API
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
            , i7 = "06x353242433121010"
            , iv7 = "06x05x142334223414"
            , v7 = "363252040030020111"
            , vi7 = "06x050242030121010"
            , names = [ "C", "Dm", "Em", "F", "G", "Am", "Bdim7", "CM7", "FM7", "G7", "Am7", "5" ]
            , bars = [ "", "", "", "", "", "", "", "", "3", "", "" ]
            , key = ""
            }

        "G" ->
            { i = "263152040030323413"
            , ii = "06x050242332121010"
            , iii = "06x152040030323212"
            , iv = "06x253142030323413"
            , v = "06x05x040132323212"
            , vi = "060152242030020010"
            , vii = "b62253344132424112"
            , i7 = "363252040030020112"
            , iv7 = "06x353242030020010"
            , v7 = "06x05x040232121312"
            , vi7 = "060152040030323010"
            , names = [ "G", "Am", "Bm", "C9", "D", "Em", "F#dim7", "GM7", "CM7", "D7", "Em7", "0" ]
            , bars = [ "", "", "", "", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "D" ->
            { i = "06x05x040132323212"
            , ii = "060152242030020010"
            , iii = "162050040232322010"
            , iv = "263152040030323413"
            , v = "06x050142232322010"
            , vi = "06x152040030323212"
            , vii = "06x152243434323010"
            , i7 = "06x05x040132222312"
            , iv7 = "363252040030020112"
            , v7 = "06x050142030322010"
            , vi7 = "06xb52344132223112"
            , names = [ "D", "Em", "F#m", "G", "A", "Bm", "C#dim7", "DM7", "GM7", "A7", "Bm7", "7" ]
            , bars = [ "", "", "", "", "", "", "4", "", "", "", "" ]
            , key = ""
            }

        "A" ->
            { i = "06x050142232322010"
            , ii = "06x152040030323212"
            , iii = "06x05x344434223112"
            , iv = "06x05x040132323212"
            , v = "060252342131020010"
            , vi = "162050040232322010"
            , vii = "b62253344132424112"
            , i7 = "06x050242131322010"
            , iv7 = "06x05x040132222312"
            , v7 = "060252040131020010"
            , vi7 = "b62354142132122112"
            , names = [ "A", "Bm", "C#m", "D", "E", "F#m", "G#dim7", "AM7", "DM7", "E7", "F#m7", "2" ]
            , bars = [ "", "", "", "", "", "", "4", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "E" ->
            { i = "060252342131020010"
            , ii = "162050040232322010"
            , iii = "b62354444132122112"
            , iv = "06x050142232322010"
            , v = "060252141332020412"
            , vi = "06x05x344434223112"
            , vii = "06x05x141332221412"
            , i7 = "060352141231020010"
            , iv7 = "06x050242131322010"
            , v7 = "06x252141332020412"
            , vi7 = "06xb52344132223112"
            , names = [ "E", "F#m", "G#m", "A", "B7", "C#m", "D#dim7", "EM7", "AM7", "B7", "C#m7", "9" ]
            , bars = [ "", "", "4", "", "", "4", "", "", "", "", "", "", "", "4" ]
            , key = ""
            }

        "B" ->
            { i = "06xb52244334424112"
            , ii = "06xb52344434223112"
            , iii = "06xb52344434223112"
            , iv = "060252342131020010"
            , v = "b62354444233122112"
            , vi = "b62354444132122112"
            , vii = "06x151242030322010"
            , i7 = "06xb52344233424112"
            , iv7 = "060352141231020010"
            , v7 = "b62354142233122112"
            , vi7 = "b62354142132122112"
            , names = [ "B", "C#m", "D#m", "E", "F#", "G#m", "A#dim7", "BM7", "EM7", "F#7", "G#m7", "4" ]
            , bars = [ "", "4", "6", "", "", "4", "", "", "", "", "", "", "", "4" ]
            , key = ""
            }

        "F#" ->
            { i = "b62354444233122112"
            , ii = "b62354444132122112"
            , iii = "b62354444132122112"
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "06xb52344434223112"
            , vii = "06x05x143334223414"
            , i7 = "b62354243333122112"
            , iv7 = "06xb52344233424112"
            , v7 = "06xb52344132424112"
            , vi7 = "06xb52344132223112"
            , names = [ "F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim7", "F#M7", "BM7", "C#7", "D#m7", "11" ]
            , bars = [ "", "4", "6", "", "4", "6", "", "", "", "", "", "", "4", "6" ]
            , key = ""
            }

        "Db" ->
            { i = "06xb52244334424112"
            , ii = "06xb52344434223112"
            , iii = "b61353443131121111"
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "b62354444132122112"
            , vii = "06x2533441324240x0"
            , i7 = "06xb52344233424112"
            , iv7 = ""
            , v7 = "b62354142233122112"
            , vi7 = "b62354142132122112"
            , names = [ "Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim7", "DbM7", "GbM7", "Ab7", "Bbm7", "6" ]
            , bars = [ "4", "6", "", "", "4", "6", "", "", "", "", "4", "", "4", "6" ]
            , key = ""
            }

        "Ab" ->
            { i = "b62354444233122112"
            , ii = "b62354444132122112"
            , iii = "06xb52344434223112"
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "b61353443131121111"
            , vii = "06x05x142333222413"
            , i7 = "b62454243333122112"
            , iv7 = "06xb52344233424112"
            , v7 = "06xb52344132424112"
            , vi7 = "b61353141131121111"
            , names = [ "Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim7", "AbM7", "DbM7", "Eb7", "Fm7", "1" ]
            , bars = [ "4", "6", "3", "4", "6", "", "5", "", "", "", "", "4", "4", "6", "" ]
            , key = ""
            }

        "Eb" ->
            { i = "06xb52244334424112"
            , ii = "b61353443131121111"
            , iii = "b62354444132122112"
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "06xb52344434223112"
            , vii = "06x2533441324240x0"
            , i7 = "06xb52344233424112"
            , iv7 = "06xb52344233424112"
            , v7 = "b62354142233122112"
            , vi7 = "06xb52344132223112"
            , names = [ "Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim7", "EbM7", "AbM7", "Bb7", "Cm7", "8" ]
            , bars = [ "6", "", "3", "4", "6", "3", "4", "6", "4", "6", "3" ]
            , key = ""
            }

        "Bb" ->
            { i = "06xb51243333423111"
            , ii = "06xb52344434223112"
            , iii = "06xb52344434223112"
            , iv = "06xb52244334424112"
            , v = "b61353443232121111"
            , vi = "b62354444132122112"
            , vii = "06x05x141332221412"
            , i7 = "06xb51343232423111"
            , iv7 = "06xb52344233424112"
            , v7 = "06xb52344132424112"
            , vi7 = "b62351424132122112"
            , names = [ "Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim7", "BbM7", "EbM7", "F7", "Gm7", "3" ]
            , bars = [ "", "3", "5", "6", "", "3", "", "", "", "", "", "", "6", "6", "3" ]
            , key = ""
            }

        "F" ->
            { i = "06x05x343232121111"
            , ii = "b62354444132122112"
            , iii = "06x050242332121010"
            , iv = "06xb51243333423111"
            , v = "06x353242030121010"
            , vi = "06x05x040232423111"
            , vii = "060151242030423010"
            , i7 = "06x05x343232121010"
            , iv7 = "06xb51343232423111"
            , v7 = "06x353242433121010"
            , vi7 = "06xb52344132223112"
            , names = [ "F", "Gm", "Am", "Bb", "C", "Dm", "Edim7", "FM7", "BbM7", "C7", "Dm7", "10" ]
            , bars = [ "", "3", "5", "", "", "", "", "", "", "", "", "", "", "5", "" ]
            , key = ""
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
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "Am", "Bdim7", "C", "Dm", "Em", "F", "G", "5" ]
            , bars = [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "e" ->
            { i = "060152242030020010"
            , ii = "b62253344132424112"
            , iii = "263152040030323413"
            , iv = "06x050242332121010"
            , v = "06x152040030323212"
            , vi = "06x353242030121010"
            , vii = "06x05x040132323212"
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "Em", "F#dim7", "G", "Am", "Bm", "C", "D", "0" ]
            , bars = [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "b" ->
            { i = "06x05x344434223112"
            , ii = "06x253344132424010"
            , iii = "06x05x040132323212"
            , iv = "060152242030020010"
            , v = "162050040232322010"
            , vi = "263152040030323413"
            , vii = "06x050142232322010"
            , i7 = "06xb52344132223112"
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "Bm", "C#dim7", "D", "Em", "F#m", "G", "A", "7" ]
            , bars = [ "", "3", "", "", "", "", "", "", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "f#" ->
            { i = "b62354444132122112"
            , ii = "b62253344132424112"
            , iii = "06x050142232322010"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "06x05x040132323212"
            , vii = "060252342131020010"
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "F#m", "G#dim7", "A", "Bm", "C#m", "D", "E", "2" ]
            , bars = [ "", "4", "", "", "4", "", "", "", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "c#" ->
            { i = "06xb52344434223112"
            , ii = "06x05x141332221412"
            , iii = "060252342131020010"
            , iv = "b62354444132122112"
            , v = "b62354444132122112"
            , vi = "06x050142232322010"
            , vii = "06xb52244334424112"
            , i7 = "06xb52344132223112"
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "C#m", "D#dim7", "E", "F#m", "G#m", "A", "B", "9" ]
            , bars = [ "4", "", "", "", "4", "", "", "4", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "g#" ->
            { i = "b62354444132122112"
            , ii = "06x151242030322010"
            , iii = "06xb52244334424112"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "060252342131020010"
            , vii = "b62354444233122112"
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "G#m", "A#dim7", "B#", "C#m", "D#m", "E", "F#", "4" ]
            , bars = [ "4", "", "3", "4", "6", "", "", "", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "d#" ->
            { i = "06xb52344434223112"
            , ii = "06x05x143334223414"
            , iii = "b62354444233122112"
            , iv = "b62354444132122112"
            , v = "b62354444132122112"
            , vi = "06xb52244334424112"
            , vii = "06xb52244334424112"
            , i7 = "06xb52344132223112"
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "D#m", "E#dim7", "F#", "G#m", "A#m", "B", "C#", "11" ]
            , bars = [ "6", "", "", "4", "6", "", "4", "6", "", "", "", "", "", "", "" ]
            , key = ""
            }

        "bb" ->
            { i = "b62354444132122112"
            , ii = "06x2533441324240x0"
            , iii = "06x05x040132323212"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "b62354444233122112"
            , vii = "b62354444233122112"
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "Bbm", "Cdim7", "D", "Ebm", "Fm", "Gb", "Ab", "6" ]
            , bars = [ "6", "", "", "6", "8", "", "4", "", "", "", "" ]
            , key = ""
            }

        "f" ->
            { i = "b61353443131111111"
            , ii = "06x05x142333222413"
            , iii = "b62354444233122112"
            , iv = "06xb51343433222111"
            , v = "06xb52344434223112"
            , vi = "06xb52244334424112"
            , vii = "06xb52244334424112"
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "Fm", "Gdim7", "Ab", "Bbm", "Cm", "Db", "Eb", "1" ]
            , bars = [ "", "5", "", "", "3", "4", "6", "", "", "", "" ]
            , key = ""
            }

        "c" ->
            { i = "06xb52344434223112"
            , ii = "06x2533441324240x0"
            , iii = "06xb52244334424112"
            , iv = "b61353443131121111"
            , v = "b62354444132122112"
            , vi = "b62354444233122112"
            , vii = "06xb51243333423111"
            , i7 = "06xb52344132223112"
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "Cm", "Ddim7", "Eb", "Fm", "Gm", "Ab", "Bb", "8" ]
            , bars = [ "3", "4", "6", "", "3", "6", "", "3", "", "", "" ]
            , key = ""
            }

        "g" ->
            { i = "b62354444132122112"
            , ii = "06x05x141332221412"
            , iii = "06xb51243333423111"
            , iv = "06xb52344434223112"
            , v = "06x05x040232423111"
            , vi = "06xb52244334424112"
            , vii = "b61353443232121111"
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "Gm", "Adim7", "Bb", "Cm", "Dm", "Eb", "F", "3" ]
            , bars = [ "3", "", "", "3", "", "6", "", "", "", "", "" ]
            , key = ""
            }

        "d" ->
            { i = "06x05x040232423111"
            , ii = "060151242030423010"
            , iii = "06x05x343232121010"
            , iv = "b62354444132122112"
            , v = "06x050242332121010"
            , vi = "06xb51243333423111"
            , vii = "06x353242030121010"
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "Dm", "Edim7", "F", "Gm", "Am", "Bb", "C", "10" ]
            , bars = [ "", "", "", "3", "", "", "", "", "", "", "" ]
            , key = ""
            }

        _ ->
            { i = ""
            , ii = ""
            , iii = ""
            , iv = ""
            , v = ""
            , vi = ""
            , vii = ""
            , i7 = ""
            , iv7 = ""
            , v7 = ""
            , vi7 = ""
            , names = [ "" ]
            , bars = [ "" ]
            , key = ""
            }
