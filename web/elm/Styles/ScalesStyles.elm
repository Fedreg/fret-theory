module Styles.ScalesStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model)
import Logic.Utils exposing ((=>))


scaleTitleStyle : Attribute msg
scaleTitleStyle =
    style
        [ "position" => "relative"
        , "marginLeft" => "25px"
        , "color" => "#03a9f4"
        ]


scaleContainerStyle : Attribute msg
scaleContainerStyle =
    style
        [ "position" => "relative"
        , "width" => "650px"
        , "margin" => "30px 0"
        , "cursor" => "pointer"
        ]


stringStyle : Attribute msg
stringStyle =
    style
        [ "width" => "600px"
        , "borderBottom" => "1px solid #ccc"
        , "marginTop" => "32px"
        , "zIndex" => "0"
        ]


stringContainerStyle : Attribute msg
stringContainerStyle =
    style
        [ "position" => "absolute"
        , "top" => "12px"
        , "left" => "25px"
        ]


fretNumberStyle : String -> Attribute msg
fretNumberStyle margin =
    style
        [ "position" => "relative"
        , "margin" => ("5px " ++ margin)
        , "color" => "#000"
        , "zIndex" => "1"
        ]


fretNumberGroupStyle =
    style
        [ "paddingRight" => "10px"
        , "fontSize" => "18px"
        ]


scalePageStyle : Attribute msg
scalePageStyle =
    style
        [ "display" => "flex"
        , "flexDirection" => "row"
        , "flexWrap" => "wrap"
        , "justifyContent" => "center"
        ]
