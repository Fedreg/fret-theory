module Styles.MainStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model, Msg(..))


navMenuStyle : Model -> Attribute Msg
navMenuStyle model =
    let
        baseStyles difference color =
            style
                [ ( "position", "absolute" )
                , ( "top", "0" )
                , ( "right", "0" )
                , ( "transform", "translateX(0)" )
                , ( "width", "250px" )
                , ( "height", "100%" )
                , ( "padding", "15px" )
                , ( "backgroundColor", "#fff" )
                , ( "transition", "all 0.5s" )
                , ( "zIndex", "10000" )
                , ( "borderLeft", "1px solid " ++ color )
                , ( "borderBottom", "1px solid " ++ color )
                , ( "transform", difference )
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "translateX(0)" "#777"

            False ->
                baseStyles "translateX(250px)" "#fff"


navIconStyle : Model -> Attribute msg
navIconStyle model =
    let
        baseStyles difference =
            style
                [ ( "position", "fixed" )
                , ( "top", "20px" )
                , ( "left", "-40px" )
                , ( "width", "25px" )
                , ( "transition", "all 0.5s" )
                , ( "cursor", "pointer" )
                , ( "transform", difference )
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "rotate(270deg)"

            False ->
                baseStyles "none"


navIconStyleHr : Attribute msg
navIconStyleHr =
    style
        [ ( "borderTop", "1px solid #000" )
        , ( "margin", "0 0 5px" )
        ]


navStyle : Attribute msg
navStyle =
    style
        [ ( "textAlign", "center" ) ]


navItemStyle : Attribute msg
navItemStyle =
    style
        [ ( "display", "block" )
        , ( "fontSize", "12px" )
        , ( "margin", "0 0 8px" )
        , ( "padding", "5px" )
        , ( "color", "#000" )
        ]


keyListStyle : Attribute msg
keyListStyle =
    style
        [ ( "width", "50px" )
        , ( "margin", "5px 5px 5px 0" )
        , ( "borderRadius", "25px" )
        , ( "cursor", "pointer" )
        , ( "lineHeight", "50px" )
        , ( "backgroundColor", "#CAD1D9" )
        , ( "color", "#000" )
        ]


keyListContainerStyle : Attribute msg
keyListContainerStyle =
    style
        [ ( "width", "240px" )
        , ( "height", "400px" )
        , ( "textAlign", "center" )
        ]


textContainerStyle : Attribute msg
textContainerStyle =
    style
        [ ( "display", "flex" )
        , ( "flexFlow", "row wrap" )
        ]


modalIconStyle : Model -> Attribute msg
modalIconStyle model =
    let
        baseStyles difference =
            style
                [ ( "position", "absolute" )
                , ( "top", "17px" )
                , ( "right", "50px" )
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
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "translateX(-250px)"

            False ->
                baseStyles "translateX(0)"


highlight : List ( String, String )
highlight =
    [ ( "color", "#E9175D" )
    , ( "backgroundColor", "#E9175D" )
    , ( "transition", "color 0.3s ease" )
    ]


signatureStyle : Attribute msg
signatureStyle =
    style
        [ ( "position", "absolute" )
        , ( "bottom", "10px" )
        , ( "fontSize", "12px" )
        , ( "color", "#000" )
        ]
