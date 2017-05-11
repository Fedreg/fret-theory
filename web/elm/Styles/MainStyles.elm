module Styles.MainStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model, Msg(..))


navMenuStyle : Model -> Attribute Msg
navMenuStyle model =
    let
        baseStyles difference color pad =
            style
                [ ( "position", "fixed" )
                , ( "top", "0" )
                , ( "right", "0" )
                , ( "transform", "translateX(0)" )
                , ( "width", "250px" )
                , ( "height", "100%" )
                , ( "padding", pad )
                , ( "backgroundColor", color )
                , ( "transition", "all 0.3s ease" )
                , ( "zIndex", "10000" )
                , ( "borderLeft", "1px solid #222" )
                , ( "borderBottom", "1px solid #222" )
                , ( "transform", difference )
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "translateX(0)" "#E8175D" "15px"

            False ->
                baseStyles "translateX(210px)" "#222" "15px 8px"


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
        [ ( "borderTop", "1px solid #fff" )
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
        , ( "margin", "0 0 7px 50px" )
        , ( "padding", "5px" )
        , ( "fontSize", "16px" )
        , ( "textAlign", "right" )
        , ( "color", "#fff" )
        ]


keyListStyle : Bool -> Attribute msg
keyListStyle navOpen =
    let
        baseStyles width margin lh font color =
            style
                [ ( "width", width )
                , ( "margin", margin )
                , ( "cursor", "pointer" )
                , ( "lineHeight", lh )
                , ( "backgroundColor", color )
                  -- , ( "color", "#fff" )
                , ( "fontSize", font )
                , ( "transition", "all 0.4s ease" )
                ]
    in
        case navOpen of
            True ->
                baseStyles "50px" "5px 5px 0 0" "50px" "16px" "#111"

            False ->
                baseStyles "20px" "2px" "20px" "12px" "rgba(0,0,0,0)"


keyListContainerStyle : Bool -> Attribute msg
keyListContainerStyle navOpen =
    let
        baseStyles margin width =
            style
                [ ( "marginTop", margin )
                , ( "width", width )
                , ( "textAlign", "center" )
                , ( "transition", "all 0.4s ease" )
                ]
    in
        case navOpen of
            True ->
                baseStyles "0" "240px"

            False ->
                baseStyles "-250px" "50px"


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


highlight : List ( String, String )
highlight =
    [ ( "color", "#000" )
      -- , ( "backgroundColor", "#E9175D" )
      -- , ( "transition", "color 0.3s ease" )
    ]


signatureStyle : Attribute msg
signatureStyle =
    style
        [ ( "position", "absolute" )
        , ( "bottom", "10px" )
        , ( "right", "10px" )
        , ( "fontSize", "12px" )
        , ( "color", "#fff" )
        ]
