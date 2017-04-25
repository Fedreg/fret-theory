module Views.Strum exposing (strumPage)

import Html exposing (Html, div, button, text, span, hr, h3, h4, h5)
import Html.Attributes exposing (style, attribute)
import Html.Events exposing (onClick)
import Logic.Types exposing (Model, Msg(Randomize, ShowModal))
import Styles.StrumStyles exposing (..)
import List.Extra exposing (getAt)


strumPage : Model -> Html Msg
strumPage model =
    div [ strumPageStyle ]
        [ strumGroup "1,1" model.strumArrow
        , button [ buttonStyle, onClick Randomize ] [ text "Generate Random Strum Pattern" ]
        , strumModal model
        ]


strumGroup : String -> List Int -> Html Msg
strumGroup scale notes =
    let
        beats a =
            div [ style [ ( "width", "10px" ), ( "margin", "0 55px 0" ) ] ] [ text <| toString a ]

        notation a =
            let
                _ =
                    Debug.log "a" a
            in
                div [ style [ ( "width", "10px" ), ( "margin", "20px 55px 0" ) ] ] [ printNotation a ]

        arrows a b =
            div [ strumArrowStyle a b ] [ arrow ]
    in
        div [ strumGroupStyle scale ]
            [ div [ style [ ( "display", "flex" ) ] ]
                (List.map2 arrows notes [ 1, 2, 1, 2, 1, 2, 1, 2 ])
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map beats <| List.range 1 8)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map notation <| calculateNotation [] 0 notes)
            ]


{-| The up / down arrow itself.  Made up of a rotated div and a hr.
-}
arrow : Html Msg
arrow =
    let
        baseStyles height width x y =
            style
                [ ( "transform", "rotate(45deg)" )
                , ( "width", width )
                , ( "height", height )
                , ( "borderTop", "9px solid  #000" )
                , ( "borderLeft", "9px solid  #000" )
                , ( "marginLeft", x )
                , ( "marginTop", y )
                ]
    in
        div [ baseStyles "50px" "50px" "0" "0" ]
            [ hr [ baseStyles "1px" "100px" "-20px" "25px" ] [] ]


calculateNotation : List Int -> Int -> List Int -> List Int
calculateNotation list index notes =
    let
        getter a =
            Maybe.withDefault 1 <| getAt (index + a) notes

        -- 1 means strum arrow showing, 2 means not showing
        notation =
            if getter 0 == 1 && getter 1 == 2 then
                -- longer than an eight note
                if getter 2 == 1 then
                    2
                else if getter 3 == 1 then
                    3
                else
                    -- Default to half note.
                    4
            else if getter 0 == 1 && getter 1 == 1 then
                1
            else if getter 4 == 1 && getter 7 == 2 then
                -- Final half note.
                4
            else
                0
    in
        if index < List.length notes then
            calculateNotation (notation :: list) (index + 1) notes
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
                , ( "bottom", "-11px" )
                , ( "left", "-5px" )
                , ( "width", "15px" )
                , ( "height", "15px" )
                , ( "transform", "skew(-20deg)" )
                , ( "border", "2px solid #999" )
                , ( "borderRadius", "10px" )
                , ( "backgroundColor", fill )
                ]

        strumNotationContainerStyle =
            style
                [ ( "position", "relative" )
                , ( "height", "35px" )
                , ( "borderRight", "2px solid #999" )
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
                , ( "color", "#999" )
                ]

        strumNotationDotStyle =
            style
                [ ( "position", "absolute" )
                , ( "bottom", "-30px" )
                , ( "right", "-15px" )
                  --, ( "width", "15px" )
                  --, ( "height", "15px" )
                  --, ( "transform", "skew(30deg)" )
                  --, ( "visibility", flag )
                , ( "fontSize", "50px" )
                , ( "color", "#999" )
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
                markup "#999" "" "visible"

            2 ->
                markup "#999" "" "hidden"

            3 ->
                markup "#999" "." "hidden"

            4 ->
                markup "none" "" "hidden"

            _ ->
                div [] []


strumModal : Model -> Html Msg
strumModal model =
    div [ strumModalStyle model ]
        [ div [ style [ ( "position", "relative" ), ( "textAlign", "left" ), ( "padding", "25px" ) ] ]
            [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
            , h3 [ style [ ( "textDecoration", "underline" ) ] ] [ text "STRUMMING THE GUITAR" ]
            , div [] [ text "When it comes to strumming it is easiest to think of a repeating 8 beat pattern." ]
            , h4 [ style [ ( "color", "#E8175D" ) ] ] [ text "COUNT: 1 2 3 4 5 6 7 8 - 1 2 3 4 5 6 7 8 - 1 2 3 4 5 6 7 8" ]
            , div [] [ text "With your hand strumming down on any ODD beat and up on any EVEN beat." ]
            , div [] [ text "Thus your down strums would fall on every 1 3 5 or 7 and your up strums on 2 4 6 or 8" ]
            , div [] [ text "Your strumming hand should always be following this up down pattern, hovering over the strings even if they do not strum the string" ]
            , h5 [ style [ ( "color", "#E8175D" ) ] ] [ text "1.  Practice strumming down on all counts 1 3 5 7" ]
            , h5 [ style [ ( "color", "#E8175D" ) ] ] [ text "2.  Practice strumming up on all counts 2 4 6 8" ]
            , h5 [ style [ ( "color", "#E8175D" ) ] ] [ text "3.  Use the random strum generator to create a practice pattern choose from one of the patterns below." ]
            , h5 [ style [ ( "color", "#E8175D" ) ] ] [ text "Be sure that your hand is always moving in the correct direction (down of 1 3 5 7, up on 2 4 6 8)" ]
            , h4 [] [ text "COMMON STRUM PATTERNS:" ]
            , strumGroup "0.5,0.5" [ 1, 2, 1, 1, 2, 1, 1, 1 ]
            , strumGroup "0.5,0.5" [ 1, 1, 1, 2, 1, 1, 1, 2 ]
            , strumGroup "0.5,0.5" [ 1, 1, 2, 1, 1, 2, 1, 1 ]
            , strumGroup "0.5,0.5" [ 2, 1, 2, 1, 2, 1, 2, 1 ]
            ]
        ]
