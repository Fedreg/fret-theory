module Styles.HomeStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)


homePageStyle : Attribute msg
homePageStyle =
    style
        [ ( "textAlign", "center" )
        , ( "paddingTop", "50px" )
        ]


titleStyle : String -> String -> Attribute msg
titleStyle fontSize color =
    style
        [ ( "margin", "0 auto" )
        , ( "fontSize", fontSize )
        , ( "color", color )
        , ( "zIndex", "50" )
        ]
