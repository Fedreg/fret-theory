module Styles.ModalStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model, Msg(..), Dot)


modalStyle : Model -> Attribute msg
modalStyle model =
    let
        baseStyles display trans posX posY =
            style
                [ ( "opacity", display )
                , ( "position", "fixed" )
                , ( "top", posX )
                , ( "left", posY )
                , ( "width", "90vw" )
                , ( "height", "90vh" )
                , ( "border", "1px solid #999" )
                , ( "borderRadius", "10px" )
                , ( "backgroundColor", "#FFF" )
                , ( "zIndex", "50" )
                , ( "color", "#333" )
                , ( "textAlign", "center" )
                , ( "overflow", "scroll" )
                , ( "transform", trans )
                , ( "transition", "all 0.4s ease" )
                ]
    in
        case model.modalOpen of
            True ->
                baseStyles "1" "scale(1, 1)" "calc(10vh / 2)" "calc(10vw / 2)"

            False ->
                baseStyles "1" "scale(0.1, 0.1)" "5px" "105vw"


modalIconStyle : Model -> Attribute msg
modalIconStyle model =
    let
        baseStyles difference =
            style
                [ ( "position", "absolute" )
                , ( "top", "45px" )
                , ( "left", "8px" )
                , ( "width", "20px" )
                , ( "height", "20px" )
                , ( "color", "#E8175D" )
                , ( "textAlign", "center" )
                , ( "fontSize", "12px" )
                , ( "cursor", "pointer" )
                , ( "border", "1px solid #E8175D" )
                , ( "borderRadius", "10px" )
                , ( "transition", "all 0.5s" )
                , ( "transform", difference )
                , ( "zIndex", "10001" )
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "translateY(10px)"

            False ->
                baseStyles "translateY(0)"


closeModalIcon : Attribute msg
closeModalIcon =
    style
        [ ( "position", "absolute" )
        , ( "top", "0" )
        , ( "right", "10px" )
        , ( "fontSize", "20px" )
        , ( "cursor", "pointer" )
        , ( "color", "#E91750" )
        ]


modalContentStyle : Attribute msg
modalContentStyle =
    style
        [ ( "position", "relative" )
        , ( "textAlign", "left" )
        , ( "padding", "25px" )
        ]
