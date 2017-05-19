module Styles.ModalStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)


modalStyle : Bool -> Attribute msg
modalStyle bool =
    let
        baseStyles trans opacity =
            style
                [ ( "position", "fixed" )
                , ( "top", "75px" )
                , ( "left", "0" )
                , ( "width", "100vw" )
                , ( "height", "90vh" )
                , ( "backgroundColor", "rgba(0,0,0,1)" )
                , ( "zIndex", "50" )
                , ( "color", "#ccc" )
                , ( "textAlign", "center" )
                , ( "overflow", "scroll" )
                , ( "opacity", opacity )
                , ( "transform", trans )
                , ( "transition", "all 0.3s linear" )
                ]
    in
        case bool of
            True ->
                baseStyles "translateX(0)" "1"

            False ->
                baseStyles "translateX(101vw)" "0"


modalIconStyle : Bool -> Bool -> Attribute msg
modalIconStyle bool navBool =
    let
        baseStyles color offset =
            style
                [ ( "position", "absolute" )
                , ( "top", offset )
                , ( "right", "60px" )
                , ( "color", color )
                , ( "textAlign", "center" )
                , ( "fontSize", "40px" )
                , ( "fontWeight", "700" )
                , ( "cursor", "pointer" )
                , ( "zIndex", "10001" )
                ]
    in
        if navBool == True then
            baseStyles "#FFF" "2px"
        else if bool == True then
            baseStyles "#f40331" "2px"
        else
            baseStyles "#03a9f4" "0"


closeModalIcon : Attribute msg
closeModalIcon =
    style
        [ ( "position", "fixed" )
        , ( "top", "20px" )
        , ( "right", "20px" )
        , ( "fontSize", "20px" )
        , ( "cursor", "pointer" )
        , ( "color", "#f40331" )
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
        , ( "padding", "20px 25px" )
        , ( "width", "100vw" )
        , ( "height", "75px" )
        , ( "color", "#f40331" )
        ]
