module Views.Strum exposing (strumPage, strumGroup)

import Html exposing (Html, div, button, text, span, hr, h3, h4, h5)
import Html.Attributes exposing (style, attribute)
import Html.Events exposing (onClick)
import Logic.Types exposing (Model, Msg(Randomize, ShowModal, StrumArrowDirection))
import Styles.StrumStyles exposing (..)
import List.Extra exposing (getAt)


strumPage : Model -> Html Msg
strumPage model =
    div [ strumPageStyle ]
        [ strumGroup "1,1" model.strumArrow
        , button [ buttonStyle, onClick (Randomize 1 2) ] [ text "Generate Random Strum Pattern" ]
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
