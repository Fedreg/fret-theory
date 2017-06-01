module Strum.View exposing (..)

import Html exposing (Html, div, button, text, span, hr, h3, h4, h5, select, option)
import Html.Attributes exposing (style, attribute, value)
import Html.Events exposing (onClick, onInput)
import Strum.Types exposing (Model, Msg(Randomize, StrumArrowDirection, ChangeStrumGroupNumber))
import Strum.Styles exposing (..)
import List.Extra exposing (getAt)
import Logic.Utils exposing ((=>))


strummingPage : Model -> Html Msg
strummingPage model =
    div [ strumPageStyle model.strumGroupNumber ]
        [ strumGroupNumberSelector
        , strumGroupMatrix model
        , button [ buttonStyle, onClick (Randomize 1 2) ] [ text "Generate Random Strum Pattern" ]
        ]


strumGroupMatrix : Model -> Html Msg
strumGroupMatrix model =
    let
        strumPattern n =
            Maybe.withDefault [] <| getAt n model.strumArrow
    in
        case model.strumGroupNumber of
            "1" ->
                div [] [ strumGroup "1,1" (strumPattern 0) "#CCC" "#000" "#FFF" "0" ]

            "2" ->
                div []
                    [ strumGroup "0.8,0.8" (strumPattern 0) "#CCC" "#000" "#FFF" "-20px -175px"
                    , strumGroup "0.8,0.8" (strumPattern 1) "#CCC" "#000" "#03a9f4" "-30px -175px"
                    ]

            "4" ->
                div []
                    [ div [ strumGroupMatrixStyle ]
                        [ strumGroup "0.6,0.6" (strumPattern 0) "#CCC" "#000" "#FFF" "-25px -175px"
                        , strumGroup "0.6,0.6" (strumPattern 1) "#CCC" "#000" "#03a9f4" "-25px -175px"
                        ]
                    , div [ strumGroupMatrixStyle ]
                        [ strumGroup "0.6,0.6" (strumPattern 2) "#CCC" "#000" "#FFF" "-25px -175px"
                        , strumGroup "0.6,0.6" (strumPattern 3) "#CCC" "#000" "#03a9f4" "-25px -175px"
                        ]
                    ]

            _ ->
                div [ strumGroupMatrixStyle ] [ strumGroup "0.5,0.5" (strumPattern 0) "#CCC" "#000" "#FFF" "0" ]


strumGroup : String -> List Int -> String -> String -> String -> String -> Html Msg
strumGroup scale notes borderCol arrowCol background margin =
    let
        beats a =
            div [ style [ "width" => "10px", "margin" => "0 55px 0" ] ] [ text <| toString a ]

        notation a =
            div [ style [ "width" => "10px", "margin" => "20px 55px 0" ] ] [ printNotation a ]

        arrows a b =
            div [ strumArrowStyle a b borderCol background ] [ arrow arrowCol ]
    in
        div [ strumGroupStyle scale margin ]
            [ div [ style [ "display" => "flex" ] ]
                (List.map2 arrows notes [ 1, 2, 1, 2, 1, 2, 1, 2 ])
            , div [ style [ "display" => "flex" ] ]
                (List.map beats <| List.range 1 8)
            , div [ style [ "display" => "flex" ] ]
                (List.map notation <| calculateNotation [] 0 notes)
            ]


strumGroupNumberSelector : Html Msg
strumGroupNumberSelector =
    select
        [ onInput ChangeStrumGroupNumber
        , style
            [ "width" => "200px" ]
        ]
        [ option [ value "1" ] [ text "NUMBER OF MEASURES: 1" ]
        , option [ value "2" ] [ text "NUMBER OF MEASURES: 2" ]
        , option [ value "4" ] [ text "NUMBER OF MEASURES: 4" ]
        ]


{-| The up / down arrow itself.  Made up of a rotated div and a hr.
-}
arrow : String -> Html Msg
arrow col =
    let
        baseStyles height width x y =
            style
                [ "transform" => "rotate(45deg)"
                , "width" => width
                , "height" => height
                , "borderTop" => ("9px solid " ++ col)
                , "borderLeft" => ("9px solid " ++ col)
                , "marginLeft" => x
                , "marginTop" => y
                ]
    in
        div [ baseStyles "50px" "50px" "0" "0" ]
            [ hr [ baseStyles "1px" "100px" "-20px" "25px" ] [] ]


{-| Determines the duration of the rhythm note below strum arrows.
-}
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
                [ "position" => "absolute"
                , "bottom" => "-10px"
                , "left" => "-5px"
                , "width" => "14px"
                , "height" => "15px"
                , "transform" => "skew(-20deg)"
                , "border" => "2px solid #555"
                , "borderRadius" => "10px"
                , "backgroundColor" => fill
                ]

        strumNotationContainerStyle =
            style
                [ "position" => "relative"
                , "height" => "35px"
                , "borderRight" => "2px solid #555"
                ]

        strumNotationFlagStyle flag =
            style
                [ "position" => "absolute"
                , "top" => "-7px"
                , "right" => "-15px"
                , "width" => "15px"
                , "height" => "15px"
                , "transform" => "skew(30deg)"
                , "visibility" => flag
                , "fontSize" => "20px"
                , "color" => "#555"
                ]

        strumNotationDotStyle =
            style
                [ "position" => "absolute"
                , "bottom" => "-30px"
                , "right" => "-15px"
                , "fontSize" => "50px"
                , "color" => "#555"
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
