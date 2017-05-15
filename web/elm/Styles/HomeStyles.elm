module Styles.HomeStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)


homePageStyle : Attribute msg
homePageStyle =
    style
        [ ( "height", "100vh" )
        , ( "textAlign", "center" )
        ]


titleStyle : String -> String -> Attribute msg
titleStyle fontSize color =
    style
        [ ( "margin", "125px auto 25px" )
        , ( "fontSize", fontSize )
        , ( "color", color )
        ]


secondaryTitleStyle : String -> String -> Attribute msg
secondaryTitleStyle fontSize color =
    style
        [ ( "margin", "0 20px 30px" )
        , ( "fontSize", fontSize )
        , ( "color", color )
        , ( "zIndex", "50" )
        ]
