module Styles.ModalStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model, Msg(..), Dot)


modalStyle : Model -> Attribute msg
modalStyle model =
    let
        baseStyles trans posX posY =
            style
                [ ( "position", "fixed" )
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
                , ( "transition", "all 0.4s" )
                ]
    in
        case model.modalOpen of
            True ->
                baseStyles "scale(1, 1)" "calc(5vh)" "calc(5vw)"

            False ->
                baseStyles "scale(0.1, 0.1)" "-250px" "105vw"


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
        [ ( "position", "fixed" )
        , ( "top", "0" )
        , ( "right", "10px" )
        , ( "fontSize", "20px" )
        , ( "cursor", "pointer" )
        , ( "color", "#fff" )
        ]


modalContentStyle : Attribute msg
modalContentStyle =
    style
        [ ( "position", "relative" )
        , ( "textAlign", "left" )
        , ( "padding", "25px" )
        ]


modalHeaderStyle : Attribute msg
modalHeaderStyle =
    style
        [ ( "backgroundColor", "#355c7d" )
        , ( "borderTopRightRadius", "10px" )
        , ( "borderTopLeftRadius", "10px" )
        , ( "margin", "-25px 0 25px -25px" )
        , ( "padding", "25px" )
        , ( "width", "95vw" )
        , ( "height", "100px" )
        , ( "color", "#fff" )
        ]
