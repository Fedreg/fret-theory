module Assets.Styles.MainStyles exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Assets.Logic.Types exposing (Model, Msg(..))


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
                , ( "backgroundColor", "#000" )
                , ( "transition", "all 0.5s" )
                , ( "zIndex", "10000" )
                , ( "borderLeft", "1px solid " ++ color )
                , ( "transform", difference )
                ]
    in
        case model.navMenuOpen of
            True ->
                baseStyles "translateX(0)" "#aaa"

            False ->
                baseStyles "translateX(250px)" "#000"


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
        , ( "fontSize", "12px" )
        , ( "margin", "0 0 8px" )
        , ( "padding", "5px" )
        , ( "color", "#fff" )
        ]


keyListStyle : Attribute msg
keyListStyle =
    style
        [ ( "width", "50px" )
        , ( "margin", "5px 5px 5px 0" )
        , ( "borderRadius", "25px" )
        , ( "cursor", "pointer" )
        , ( "lineHeight", "50px" )
        , ( "color", "#fff" )
        , ( "backgroundColor", "#222" )
        ]


keyListContainerStyle : Attribute msg
keyListContainerStyle =
    style
        [ ( "width", "240px" )
        , ( "height", "400px" )
        , ( "textAlign", "center" )
        , ( "backgroundColor", "#000" )
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
                , ( "color", "fff" )
                , ( "textAlign", "center" )
                , ( "fontSize", "12px" )
                , ( "cursor", "pointer" )
                , ( "border", "1px solid #fff" )
                , ( "borderRadius", "10px" )
                , ( "transition", "translate 0.5s" )
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
