module Pages.FingerPick exposing (view, Model)

import Html exposing (Html, div, button, text, span, hr, h1, h3, h4, h5)
import Html.Attributes exposing (style, attribute)
import Html.Events exposing (onClick)
import Pages.Chords exposing (chordChartModel, startKey)


-- import Logic.Types exposing (Msg(Randomize, ShowModal))

import Styles.FingerPickStyles exposing (..)
import List.Extra exposing (getAt)


type alias Model =
    { fingerPickPatternA : List Int
    , fingerPickPatternB : List Int
    , displayedChords : ChordChartData
    , musKey : String
    }


init =
    { fingerPickPatternA = [ 2, 0, 0, 3, 0, 1, 0, 2 ]
    , fingerPickPatternB = [ 5, 0, 4, 0, 5, 0, 5, 0 ]
    , displayedChords = startKey
    , musKey = "C"
    }


type Msg
    = Randomize Int Int
    | FingerPickPatternBuilderA (List Int)
    | FingerPickPatternBuilderB (List Int)


update msg model =
    case msg of
        Randomize hi lo ->
            ( model
            , Cmd.batch
                [ Random.generate FingerPickPatternBuilderA <| Random.list 8 (Random.int hi lo)
                , Random.generate FingerPickPatternBuilderB <| Random.list 8 (Random.int hi lo)
                ]
            )

        FingerPickPatternBuilderA numList ->
            let
                pattern =
                    model.fingerPickPModel

                newPattern =
                    { pattern | fingerPickPatternA = numList }
            in
                { model | fingerPickModel = newPattern } ! []

        FingerPickPatternBuilderB numList ->
            let
                pattern =
                    model.fingerPickModel

                newPattern =
                    { pattern | fingerPickPatternB = numList }
            in
                { model | fingerPickModel = newPattern } ! []


view : Model -> Html Msg
view model =
    div [ fingerPickingPageStyle ]
        [ h1 [ fingerPickChordTitleStyle ] [ chordChartModel model 0 "" .i .i ]
        , fingerPickGroup "1,1" model.fingerPickPattern.a model.fingerPickPattern.b model
        , button [ buttonStyle, onClick (Randomize 0 8) ] [ text "Generate Random Fingerpicking Pattern" ]
        ]


{-| Draws the frets on each string
-}
fingerPickGroup : String -> List Int -> List Int -> Model -> Html Msg
fingerPickGroup scale notes1 notes2 model =
    let
        beats a =
            -- Draws the beat number.
            div [ fingerPickGroupBeatStyle ] [ text <| toString a ]

        notation a =
            -- Draws the rhythm notation.
            div [ fingerPickGroupNotationStyle ] [ printNotation a ]

        frets a =
            div [] [ fret a model ]
    in
        div [ fingerPickGroupStyle scale ]
            [ stringView
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets notes1)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets notes2)
            , div [ beatStyle ]
                (List.map beats <| List.range 1 8)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map notation <| calculateNotation [] 0 notes1 notes2)
            ]


{-| The up / down arrow itself.  Made up of a rotated div and a hr.
-}
fret : Int -> Model -> Html Msg
fret num model =
    let
        getter a =
            Maybe.withDefault "" <| getAt a (chordNotes model)

        message =
            case num of
                1 ->
                    getter 0

                2 ->
                    getter 1

                3 ->
                    getter 2

                4 ->
                    getter 3

                5 ->
                    getter 4

                6 ->
                    getter 5

                _ ->
                    ""

        height =
            case num of
                1 ->
                    "-202px"

                2 ->
                    "-168px"

                3 ->
                    "-135px"

                4 ->
                    "-103px"

                5 ->
                    "-70px"

                6 ->
                    "-37px"

                _ ->
                    "0"

        opacity =
            case num of
                0 ->
                    "0"

                _ ->
                    "1"

        baseStyles =
            style
                [ ( "display", "flex" )
                , ( "marginTop", height )
                , ( "width", "120px" )
                , ( "fontSize", "20px" )
                , ( "color", "#000" )
                , ( "justifyContent", "center" )
                , ( "opacity", opacity )
                ]
    in
        div [ baseStyles ] [ text message ]


stringView : Html Msg
stringView =
    div [ style [ ( "marginBottom", "20px" ) ] ]
        [ div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        ]


{-| Determines the "Frets" to be displayed on the strings based on the current Model.
-}
chordNotes model =
    let
        chord =
            model.displayedChords |> .i

        bar =
            -- Adds any frets where the "bar n" marker would appear on the chord chart.
            model.displayedChords
                |> .bars
                |> getAt 0
                |> Maybe.withDefault ""

        slicer a b =
            String.slice a b chord

        adder a =
            if bar == "" then
                a
            else if a == "" then
                a
            else
                Result.map2 (+) (String.toInt a) (String.toInt bar)
                    |> Result.withDefault 0
                    |> (-) 2
                    |> negate
                    |> toString

        finalChord =
            []
    in
        if slicer 2 3 == "x" && slicer 5 6 == "x" then
            ""
                :: finalChord
                |> (++) ("" :: finalChord)
                |> (++) (slicer 8 9 :: finalChord)
                |> (++) (slicer 11 12 :: finalChord)
                |> (++) (slicer 14 15 :: finalChord)
                |> (++) (slicer 17 18 :: finalChord)
                |> List.map adder
        else if slicer 2 3 == "x" then
            ""
                :: finalChord
                |> (++) (slicer 5 6 :: finalChord)
                |> (++) (slicer 8 9 :: finalChord)
                |> (++) (slicer 11 12 :: finalChord)
                |> (++) (slicer 14 15 :: finalChord)
                |> (++) (slicer 17 18 :: finalChord)
                |> List.map adder
        else
            slicer 2 3
                :: finalChord
                |> (++) (slicer 5 6 :: finalChord)
                |> (++) (slicer 8 9 :: finalChord)
                |> (++) (slicer 11 12 :: finalChord)
                |> (++) (slicer 14 15 :: finalChord)
                |> (++) (slicer 17 18 :: finalChord)
                |> List.map adder


{-| Determines the duration of the rhythm note below fingerPick arrows.
-}
calculateNotation : List Int -> Int -> List Int -> List Int -> List Int
calculateNotation list index notes1 notes2 =
    let
        getter1 a =
            Maybe.withDefault 1 <| getAt (index + a) notes1

        getter2 a =
            Maybe.withDefault 1 <| getAt (index + a) notes2

        possibleNotes1 a =
            List.member (getter1 a) (List.range 1 5)

        possibleNotes2 a =
            List.member (getter2 a) (List.range 1 5)

        possibleNotes a =
            possibleNotes1 a || possibleNotes2 a

        -- 1 means strum arrow showing, 2 means not showing
        notation =
            if possibleNotes 0 == True && possibleNotes 1 == False then
                -- longer than an eight note
                if possibleNotes 2 == True then
                    2
                else if possibleNotes 3 == True then
                    3
                else
                    -- Default to half note.
                    4
            else if possibleNotes 0 == True && possibleNotes 1 == True then
                1
            else if possibleNotes 4 == True && possibleNotes 7 == False then
                -- Final half note.
                4
            else
                0
    in
        if index < List.length notes1 then
            calculateNotation (notation :: list) (index + 1) notes1 notes2
        else
            List.reverse list


{-| Draws the notation below the strum arrows TODO: Refactor this!! ...sloppy
-}
printNotation : Int -> Html msg
printNotation notes =
    let
        markup fill dot flag =
            div [ fingerPickNotationContainerStyle ]
                [ div [ fingerPickNotationBaseStyles fill ] []
                , div [ fingerPickNotationFlagStyle flag ] [ text ")" ]
                , div [ fingerPickNotationDotStyle ] [ text dot ]
                ]
    in
        case notes of
            0 ->
                div [] []

            1 ->
                markup "#555" "" "visible"

            2 ->
                markup "#555" "" "hidden"

            3 ->
                markup "#555" "." "hidden"

            4 ->
                markup "none" "" "hidden"

            _ ->
                div [] []
