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
                , ( "width", "100vw" )
                , ( "height", "90vh" )
                , ( "backgroundColor", "rgba(0,0,0,1)" )
                , ( "zIndex", "50" )
                , ( "color", "#ccc" )
                , ( "textAlign", "center" )
                , ( "overflow", "scroll" )
                , ( "transform", trans )
                , ( "transition", "all 0.3s linear" )
                ]
    in
        case model.modalOpen of
            True ->
                baseStyles "scale(1, 1)" "75px" "0"

            False ->
                baseStyles "scale(0.1, 0.1)" "-250px" "105vw"


modalIconStyle : Model -> Attribute msg
modalIconStyle model =
    let
        baseStyles color =
            style
                [ ( "position", "absolute" )
                , ( "top", "3px" )
                , ( "right", "60px" )
                , ( "color", color )
                , ( "textAlign", "center" )
                , ( "fontSize", "40px" )
                , ( "fontWeight", "700" )
                , ( "cursor", "pointer" )
                , ( "zIndex", "10001" )
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "#FFF"

            False ->
                baseStyles "#03a9f4"


closeModalIcon : Attribute msg
closeModalIcon =
    style
        [ ( "position", "fixed" )
        , ( "top", "5px" )
        , ( "right", "20px" )
        , ( "fontSize", "20px" )
        , ( "cursor", "pointer" )
        , ( "color", "#03a9f4" )
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
        [ ( "backgroundColor", "#333" )
        , ( "margin", "-25px 0 25px -25px" )
        , ( "padding", "25px" )
        , ( "width", "100vw" )
        , ( "height", "100px" )
        , ( "color", "#03a9f4" )
        ]
