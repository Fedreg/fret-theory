module Styles.ScalesStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model)


scaleTitleStyle : Attribute msg
scaleTitleStyle =
    style
        [ ( "position", "relative" )
        , ( "color", "#03a9f4" )
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
        , ( "borderBottom", "1px solid #444" )
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
        , ( "color", "#fff" )
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
