module Styles.MainStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model, Msg(..))


navMenuStyle : Model -> Attribute Msg
navMenuStyle model =
    let
        baseStyles difference color pad =
            style
                [ ( "position", "absolute" )
                , ( "top", "0" )
                , ( "right", "0" )
                , ( "transform", "translateX(0)" )
                , ( "width", "250px" )
                , ( "height", "100%" )
                , ( "padding", pad )
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
                baseStyles "translateX(0)" "#999" "15px"

            False ->
                baseStyles "translateX(210px)" "#bbb" "15px 8px"


navIconStyle : Model -> Attribute msg
navIconStyle model =
    let
        baseStyles difference =
            style
                [ ( "position", "fixed" )
                , ( "top", "20px" )
                , ( "left", "7px" )
                , ( "width", "25px" )
                , ( "transition", "all 0.5s" )
                , ( "cursor", "pointer" )
                , ( "zIndex", "10001" )
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
        , ( "margin", "0 0 8px 50px" )
        , ( "padding", "5px" )
        , ( "fontSize", "12px" )
        , ( "textAlign", "right" )
        , ( "color", "#000" )
        ]


keyListStyle : Bool -> Attribute msg
keyListStyle navOpen =
    let
        baseStyles width margin lh br font =
            style
                [ ( "width", width )
                , ( "margin", margin )
                , ( "borderRadius", br )
                , ( "cursor", "pointer" )
                , ( "lineHeight", lh )
                , ( "backgroundColor", "#CAD1D9" )
                , ( "color", "#000" )
                , ( "fontSize", font )
                , ( "transition", "all 0.4s ease" )
                ]
    in
        case navOpen of
            True ->
                baseStyles "50px" "5px 5px 5px 0" "50px" "25px" "16px"

            False ->
                baseStyles "20px" "2px" "20px" "3px" "12px"


keyListContainerStyle : Bool -> Attribute msg
keyListContainerStyle navOpen =
    let
        baseStyles margin width height =
            style
                [ ( "marginTop", margin )
                , ( "width", width )
                , ( "height", height )
                , ( "textAlign", "center" )
                , ( "transition", "all 0.4s ease" )
                ]
    in
        case navOpen of
            True ->
                baseStyles "0" "240px" "400px"

            False ->
                baseStyles "-225px" "50px" "600px"


textContainerStyle : Bool -> Attribute msg
textContainerStyle navOpen =
    let
        baseStyles flexDir =
            style
                [ ( "display", "flex" )
                , ( "flexFlow", flexDir )
                ]
    in
        case navOpen of
            True ->
                baseStyles "row wrap"

            False ->
                baseStyles "column nowrap"


modalIconStyle : Model -> Attribute msg
modalIconStyle model =
    let
        baseStyles difference =
            style
                [ ( "position", "absolute" )
                , ( "top", "45px" )
                , ( "right", "10px" )
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
                baseStyles "translateX(-210px) translateY(10px)"

            False ->
                baseStyles "translateX(0) translateY(0)"


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
        , ( "right", "10px" )
        , ( "fontSize", "12px" )
        , ( "color", "#000" )
        ]
