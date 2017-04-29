module Views.FingerPick exposing (fingerPickingPage)

import Html exposing (Html, div, button, text, span, hr, h3, h4, h5)
import Html.Attributes exposing (style, attribute)
import Html.Events exposing (onClick)
import Logic.Types exposing (Model, Msg(Randomize, ShowModal))
import Styles.FingerPickStyles exposing (..)
import List.Extra exposing (getAt)


fingerPickingPage : Model -> Html Msg
fingerPickingPage model =
    div [ fingerPickingPageStyle ]
        [ fingerPickGroup "1,1" model.fingerPickPattern.a model.fingerPickPattern.b
        , button [ buttonStyle, onClick (Randomize 0 8) ] [ text "Generate Random Fingerpicking Pattern" ]
        , fingerPickModal model
        ]


{-| Draws the frets on each string
-}
fingerPickGroup : String -> List Int -> List Int -> Html Msg
fingerPickGroup scale notes1 notes2 =
    let
        beats a =
            -- Draws the beat number.
            div [ style [ ( "width", "10px" ), ( "margin", "0 55px 0" ) ] ] [ text <| toString a ]

        notation a =
            -- Draws the rhythm notation.
            div [ style [ ( "width", "10px" ), ( "margin", "20px 55px 0" ) ] ] [ printNotation a ]

        frets a =
            -- a = The notes from model.fingerPickPattern, b = model.strumArrow for opacity, c = the fret number.
            div [] [ fret a ]
    in
        div [ fingerPickGroupStyle scale ]
            [ stringView
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets notes1)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets notes2)
            , div [ style [ ( "display", "flex" ), ( "color", "#E8175D" ) ] ]
                (List.map beats <| List.range 1 8)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map notation <| calculateNotation [] 0 notes1 notes2)
              -- , div [ style [ ( "display", "flex" ) ] ]
              --     (List.map notation <| calculateNotation [] 0 notes2)
            ]


{-| The up / down arrow itself.  Made up of a rotated div and a hr.
-}
fret : Int -> Html Msg
fret num =
    let
        message =
            case num of
                1 ->
                    "0"

                2 ->
                    "1"

                3 ->
                    "2"

                4 ->
                    "2"

                5 ->
                    "0"

                _ ->
                    ""

        height =
            case num of
                1 ->
                    "-182px"

                2 ->
                    "-148px"

                3 ->
                    "-115px"

                4 ->
                    "-83px"

                5 ->
                    "-50px"

                _ ->
                    "0"

        opacity =
            case num of
                0 ->
                    "0"

                -- 6 ->
                --     "0"
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
    div []
        [ div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        ]


{-| Determines the duration of the rhythm note below strum arrows.
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
        baseStyles fill =
            style
                [ ( "position", "absolute" )
                , ( "bottom", "-10px" )
                , ( "left", "-5px" )
                , ( "width", "14px" )
                , ( "height", "15px" )
                , ( "transform", "skew(-20deg)" )
                , ( "border", "2px solid #555" )
                , ( "borderRadius", "10px" )
                , ( "backgroundColor", fill )
                ]

        strumNotationContainerStyle =
            style
                [ ( "position", "relative" )
                , ( "height", "35px" )
                , ( "borderRight", "2px solid #555" )
                ]

        strumNotationFlagStyle flag =
            style
                [ ( "position", "absolute" )
                , ( "top", "-7px" )
                , ( "right", "-15px" )
                , ( "width", "15px" )
                , ( "height", "15px" )
                , ( "transform", "skew(30deg)" )
                , ( "visibility", flag )
                , ( "fontSize", "20px" )
                , ( "color", "#555" )
                ]

        strumNotationDotStyle =
            style
                [ ( "position", "absolute" )
                , ( "bottom", "-30px" )
                , ( "right", "-15px" )
                , ( "fontSize", "50px" )
                , ( "color", "#555" )
                ]

        markup fill dot flag =
            div [ strumNotationContainerStyle ]
                [ div [ baseStyles fill ] []
                , div [ strumNotationFlagStyle flag ] [ text ")" ]
                , div [ strumNotationDotStyle ] [ text dot ]
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


fingerPickModal : Model -> Html Msg
fingerPickModal model =
    div [ fingerPickModalStyle model ] [ text "fingerpicking page, instruction coming soon!" ]



-- [ div [ style [ ( "position", "relative" ), ( "textAlign", "left" ), ( "padding", "25px" ) ] ]
--     [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
--     , h3 [ style [ ( "textDecoration", "underline" ) ] ] [ text "STRUMMING THE GUITAR" ]
--     , div [] [ text "When it comes to strumming it is easiest to think of a repeating 8 beat pattern." ]
--     , h4 [ style [ ( "color", "#E8175D" ) ] ] [ text "COUNT: 1 2 3 4 5 6 7 8 - 1 2 3 4 5 6 7 8 - 1 2 3 4 5 6 7 8" ]
--     , div [] [ text "With your hand strumming down on any ODD beat and up on any EVEN beat." ]
--     , div [] [ text "Thus your down strums would fall on every 1 3 5 or 7 and your up strums on 2 4 6 or 8" ]
--     , div [] [ text "Your strumming hand should always be following this up down pattern, hovering over the strings even if they do not strum the string" ]
--     , h5 [ style [ ( "color", "#E8175D" ) ] ] [ text "1.  Practice strumming down on all counts 1 3 5 7" ]
--     , h5 [ style [ ( "color", "#E8175D" ) ] ] [ text "2.  Practice strumming up on all counts 2 4 6 8" ]
--     , h5 [ style [ ( "color", "#E8175D" ) ] ] [ text "3.  Use the random strum generator to create a practice pattern choose from one of the patterns below." ]
--     , h5 [ style [ ( "color", "#E8175D" ) ] ] [ text "Be sure that your hand is always moving in the correct direction (down of 1 3 5 7, up on 2 4 6 8)" ]
--     , h4 [] [ text "COMMON STRUM PATTERNS:" ]
--     , fingerPickGroup "0.75,0.75" [ 1, 2, 1, 1, 2, 1, 1, 1 ]
--     , fingerPickGroup "0.75,0.75" [ 1, 1, 1, 2, 1, 1, 1, 2 ]
--     , fingerPickGroup "0.75,0.75" [ 1, 1, 2, 1, 1, 2, 1, 1 ]
--     , fingerPickGroup "0.75,0.75" [ 2, 1, 2, 1, 2, 1, 2, 1 ]
--     ]
-- ]
