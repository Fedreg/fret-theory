module Strum exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Types exposing (Model, Msg(Randomize, ShowModal))


strumPage : Model -> Html Msg
strumPage model =
    let
        beats a =
            div [ style [ ( "margin", "0 55px" ) ] ] [ text <| toString a ]

        arrows a b =
            div [ strumArrowStyle a b ] [ arrow ]
    in
        div [ strumPageStyle ]
            [ div [ style [ ( "display", "flex" ) ] ]
                (List.map2 arrows model.strumArrow [ 1, 2, 1, 2, 1, 2, 1, 2 ])
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map beats <| List.range 1 8)
            , button [ buttonStyle, onClick Randomize ] [ text "Randomize!" ]
            , strumModal model
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
                , ( "borderTop", "9px solid #fff" )
                , ( "borderLeft", "9px solid #fff" )
                , ( "marginTop", "50px" )
                , ( "marginLeft", x )
                , ( "marginTop", y )
                ]
    in
        div [ baseStyles "50px" "50px" "0" "0" ]
            [ hr [ baseStyles "1px" "100px" "-20px" "25px" ] [] ]


strumModal : Model -> Html Msg
strumModal model =
    div [ strumModalStyle model ]
        [ div [ closeModalIcon, onClick ShowModal ] [ text "close" ]
        , div [] [ text ("Strum Page. Instructions Coming Soon!") ]
        ]



-- STYLES


strumPageStyle : Attribute msg
strumPageStyle =
    style
        [ ( "height", "100vh" )
        , ( "display", "flex" )
        , ( "flexDirection", "column" )
        , ( "paddingTop", "150px" )
        , ( "alignItems", "center" )
        ]


{-| Determines if arrow is displayed and if it points up or down.
-}
strumArrowStyle : Int -> Int -> Attribute msg
strumArrowStyle num mover =
    let
        display =
            case num of
                1 ->
                    "visible"

                2 ->
                    "hidden"

                _ ->
                    "hidden"

        rotate =
            case mover of
                1 ->
                    "180deg"

                2 ->
                    "0"

                _ ->
                    "0"
    in
        style
            [ ( "width", "100px" )
            , ( "height", "200px" )
            , ( "margin", "10px" )
            , ( "visibility", display )
            , ( "paddingTop", "100px" )
            , ( "display", "flex" )
            , ( "justifyContent", "center" )
            , ( "transform", "rotate(" ++ rotate ++ ") translateY(-40px)" )
            ]


beatStyle : Attribute msg
beatStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "200px" )
        , ( "left", "0" )
        , ( "paddingRight", "200px" )
        ]


buttonStyle : Attribute msg
buttonStyle =
    style
        [ ( "background", "none" )
        , ( "marginTop", "50px" )
        , ( "border", "1px solid #333" )
        , ( "color", "#E8175D" )
        ]


strumModalStyle : Model -> Attribute msg
strumModalStyle model =
    let
        baseStyles display =
            style
                [ ( "display", display )
                , ( "position", "absolute" )
                , ( "top", "50px" )
                , ( "left", "50px" )
                , ( "width", "90vw" )
                , ( "height", "90vh" )
                , ( "border", "1px solid #fff" )
                , ( "backgroundColor", "#000" )
                , ( "opacity", "0.9" )
                , ( "zIndex", "50" )
                , ( "color", "#fff" )
                , ( "textAlign", "center" )
                ]
    in
        case model.modalOpen of
            True ->
                baseStyles "block"

            False ->
                baseStyles "none"


closeModalIcon : Attribute msg
closeModalIcon =
    style
        [ ( "position", "absolute" )
        , ( "top", "5px" )
        , ( "right", "5px" )
        , ( "width", "50px" )
        , ( "padding", "2px" )
        , ( "border", "1px solid #E91750" )
        , ( "cursor", "pointer" )
        , ( "color", "#E91750" )
        ]
