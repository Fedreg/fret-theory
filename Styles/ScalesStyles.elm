module Styles.ScalesStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model)


scaleTitleStyle : Attribute msg
scaleTitleStyle =
    style
        [ ( "position", "relative" )
        , ( "color", "#E91750" )
        ]


scaleContainerStyle : Attribute msg
scaleContainerStyle =
    style
        [ ( "position", "relative" )
        , ( "width", "650px" )
        , ( "margin", "30px 0" )
        , ( "cursor", "pointer" )
        ]


stringStyle : Attribute msg
stringStyle =
    style
        [ ( "width", "600px" )
        , ( "borderBottom", "1px solid #aaa" )
        , ( "marginTop", "32px" )
        , ( "zIndex", "0" )
        ]


stringContainerStyle : Attribute msg
stringContainerStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "12px" )
        , ( "left", "0" )
        ]


fretNumberStyle : String -> Attribute msg
fretNumberStyle margin =
    style
        [ ( "position", "relative" )
        , ( "margin", "5px " ++ margin )
        , ( "color", "#000" )
        , ( "zIndex", "1" )
        ]


scalePageStyle : Attribute msg
scalePageStyle =
    style
        [ ( "display", "flex" )
        , ( "flexDirection", "row" )
        , ( "flexWrap", "wrap" )
        , ( "justifyContent", "center" )
        ]


scaleModalStyle : Model -> Attribute msg
scaleModalStyle model =
    let
        baseStyles display =
            style
                [ ( "display", display )
                , ( "position", "absolute" )
                , ( "top", "calc(10vh / 2)" )
                , ( "left", "calc(10vw / 2)" )
                , ( "width", "90vw" )
                , ( "height", "90vh" )
                , ( "border", "1px solid #999" )
                , ( "borderRadius", "20px" )
                , ( "backgroundColor", "#fff" )
                , ( "zIndex", "50" )
                , ( "color", "#333" )
                , ( "textAlign", "center" )
                , ( "overflow", "scroll" )
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
        , ( "top", "15px" )
        , ( "right", "15px" )
        , ( "width", "20px" )
        , ( "height", "20px" )
        , ( "lineHeight", "15px" )
        , ( "paddingLeft", "5px" )
        , ( "border", "1px solid #E91750" )
        , ( "borderRadius", "10px" )
        , ( "cursor", "pointer" )
        , ( "color", "#E91750" )
        ]
