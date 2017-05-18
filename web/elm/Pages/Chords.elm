module Pages.Chords exposing (view, init, keyList, chordChartModel, startKey, keyListMajor, keyListMinor)

import Html exposing (Html, div, span, a, text, option, h4)
import Html.Attributes exposing (style, value, href)
import Html.Events exposing (onClick)
import List.Extra exposing (getAt)
import Logic.Audio exposing (notes)
import Logic.Types exposing (Dot)
import Logic.Routing exposing (scalesPath)
import Styles.ChordStyles exposing (..)


type alias Model =
    { currentChord : List String
    , displayedChords : ChordChartData
    , musKey : String
    , sliderValue : Int
    }


init =
    { currentChord = []
    , displayedChords = startKey
    , musKey = "C"
    , sliderValue = 1
    }


type Msg
    = Play (List String) Int
    | ResetIndex
    | SendNotes


update msg model =
    case msg of
        Play chord hzShift ->
            { model | currentChord = chord, pitchShift = hzShift }
                ! []
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


view : Model -> Html Msg
view model =
    let
        soloFretMin =
            Maybe.withDefault "0" (getAt 11 <| (model.displayedChords).names)

        soloFretMaj =
            toString (((Result.withDefault 0 <| String.toInt soloFretMin) + 3) % 12)

        keyOptions key =
            option [ value key ] [ text key ]
    in
        div [ chordsPageStyle ]
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
            , div [ soloOnTextStyle ]
                [ span [] [ text "SOLO ON FRET: " ]
                , span [ soloOnNumberStyle ] [ text soloFretMin ]
                , a [ soloOnLinkStyle, href (scalesPath model.musKey) ] [ text " (MINOR SCALE), OR FRET: " ]
                , span [ soloOnNumberStyle ] [ text soloFretMaj ]
                , a [ soloOnLinkStyle, href (scalesPath model.musKey) ] [ text " (MAJOR SCALE)" ]
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
            "#677077"

        "2" ->
            -- "#E8175D"
            "#B5B5B6"

        "3" ->
            -- "#F25F2E"
            "#333"

        "4" ->
            -- "#F2B632"
            "#03a9f4"

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
            [ div [ fingerChartDotStyle <| fingerNo "1" ] []
            , div [ fingerChartTextStyle ] [ text "Pointer" ]
            , div [ fingerChartDotStyle <| fingerNo "2" ] []
            , div [ fingerChartTextStyle ] [ text "Middle" ]
            , div [ fingerChartDotStyle <| fingerNo "3" ] []
            , div [ fingerChartTextStyle ] [ text "Ring" ]
            , div [ fingerChartDotStyle <| fingerNo "4" ] []
            , div [ fingerChartTextStyle ] [ text "Pinky" ]
            ]
        ]


keyListMajor : List String
keyListMajor =
    [ "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F" ]


keyListMinor : List String
keyListMinor =
    [ "a", "e", "b", "f#", "c#", "g#", "d#", "bb", "f", "c", "g", "d" ]


keyList : List String
keyList =
    [ "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F", "a", "e", "b", "f#", "c#", "g#", "d#", "bb", "f", "c", "g", "d" ]


{-| Default key loaded in at init
-}
startKey : ChordChartData
startKey =
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
