module Styles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Types exposing (Model, Msg(..))
import Logic.Utils exposing ((=>))


navMenuStyle : Model -> Attribute Msg
navMenuStyle model =
    let
        baseStyles h color pad =
            style
                [ "position" => "fixed"
                , "top" => "0"
                , "right" => "0"
                , "transform" => "translateX(0)"
                , "width" => "100vw"
                , "height" => h
                , "paddingTop" => pad
                , "backgroundColor" => color
                , "transition" => "all 0.3s ease"
                , "zIndex" => "10000"
                , "borderBottom" => "1px solid #ccc"
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "100vh" "rgba(0,0,0,0.9)" "100px"

            False ->
                baseStyles "75px" "#FFF" "15px"


navIconStyle : Model -> Attribute msg
navIconStyle model =
    let
        baseStyles difference =
            style
                [ "position" => "fixed"
                , "top" => "20px"
                , "right" => "20px"
                , "width" => "25px"
                , "transition" => "all 0.5s"
                , "cursor" => "pointer"
                , "zIndex" => "10001"
                , "transform" => difference
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "rotate(270deg)"

            False ->
                baseStyles "none"


navIconStyleHr : Bool -> Attribute msg
navIconStyleHr bool =
    let
        baseStyles color =
            style
                [ "borderTop" => ("5px solid " ++ color)
                , "margin" => "0 0 5px"
                ]
    in
        case bool of
            True ->
                baseStyles "#FFF"

            False ->
                baseStyles "#000"


navStyle : Attribute msg
navStyle =
    style
        [ "textAlign" => "center" ]


navItemStyle : Bool -> Attribute msg
navItemStyle bool =
    let
        baseStyles iconColor display =
            style
                [ "display" => display
                , "margin" => "0 0 5px 50px"
                , "padding" => "5px"
                , "fontSize" => "24px"
                , "textAlign" => "left"
                , "color" => iconColor
                ]
    in
        case bool of
            True ->
                baseStyles "#FFF" "block"

            False ->
                baseStyles "#000" "none"


navTitleStyle : Attribute msg
navTitleStyle =
    style
        [ "position" => "fixed"
        , "top" => "10px"
        , "left" => "20px"
        , "color" => "#000"
        , "fontSize" => "30px"
        , "fontWeight" => "700"
        ]


keyListStyle : Attribute msg
keyListStyle =
    style
        [ "width" => "60px"
        , "margin" => "10px 10px 0 0 "
        , "cursor" => "pointer"
        , "lineHeight" => "60px"
        , "border" => "1px solid #333"
        , "fontSize" => "16px"
        , "transition" => "all 0.4s ease"
        , "color" => "#fff"
        ]


keyListKeyTitleStyle : Attribute msg
keyListKeyTitleStyle =
    style
        [ "position" => "fixed"
        , "top" => "-30px"
        , "right" => "50px"
        , "width" => "450px"
        , "textAlign" => "right"
        , "fontSize" => "16px"
        , "textTransform" => "underline"
        ]


keyListContainerStyle : Bool -> Attribute msg
keyListContainerStyle navOpen =
    let
        baseStyles display shift =
            style
                [ "display" => "flex"
                , "opacity" => display
                , "position" => "fixed"
                , "top" => "200px"
                , "right" => "50px"
                , "width" => "500px"
                , "textAlign" => "center"
                , "transform" => shift
                , "transition" => "all 0.4s ease"
                ]
    in
        case navOpen of
            True ->
                baseStyles "1" "translateY(0)"

            False ->
                baseStyles "0" "translateY(-600px)"


textContainerStyle : Attribute msg
textContainerStyle =
    style
        [ "display" => "flex"
        , "flexFlow" => "row wrap "
        ]


highlight : List ( String, String )
highlight =
    [ "color" => "#03a9f4"
    ]


signatureStyle : Attribute msg
signatureStyle =
    style
        [ "position" => "absolute"
        , "bottom" => "10px"
        , "right" => "10px"
        , "fontSize" => "12px"
        , "color" => "#FFF"
        , "textDecoration" => "none"
        ]
