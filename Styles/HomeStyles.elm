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
        [ ( "margin", "50px auto" )
          -- , ( "padding", "50px 0" )
        , ( "fontSize", fontSize )
        , ( "color", color )
        , ( "zIndex", "50" )
        , ( "boxShadow", "5px 5px 20px #bbb" )
        , ( "backgroundColor", "#fff" )
        ]


secondaryTitleStyle : String -> String -> Attribute msg
secondaryTitleStyle fontSize color =
    style
        [ ( "margin", "0 auto" )
        , ( "fontSize", fontSize )
        , ( "color", color )
        , ( "zIndex", "50" )
        ]
