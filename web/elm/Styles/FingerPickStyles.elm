module Styles.FingerPickStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model)
import Logic.Utils exposing ((=>))


fingerPickingPageStyle : Attribute msg
fingerPickingPageStyle =
    style
        [ "height" => "100vh"
        , "width" => "100vw"
        , "display" => "flex"
        , "flexDirection" => "column"
        , "paddingTop" => "150px"
        , "alignItems" => "center"
        ]


fingerPickGroupStyle : String -> Attribute msg
fingerPickGroupStyle scale =
    style
        [ "transform" => ("scale(" ++ scale ++ ")")
        , "position" => "relative"
        , "margin" => "125px 0 0 200px"
        , "cursor" => "pointer"
        ]


fingerPickGroupBeatStyle =
    style
        [ "width" => "10px"
        , "margin" => "5px 55px 10px"
        ]


fingerPickGroupNotationStyle =
    style
        [ "width" => "10px"
        , "margin" => "5px 55px 0"
        ]


{-| Determines if arrow is displayed and if it points up or down.
-}
fretStyle : Int -> Int -> Attribute msg
fretStyle num mover =
    let
        opacity =
            case num of
                1 ->
                    "1"

                2 ->
                    "0"

                _ ->
                    "0"
    in
        style
            [ "width" => "100px"
            , "height" => "180px"
            , "margin" => "10px 10px 20px"
            , "opacity" => opacity
            , "paddingTop" => "50px"
            , "display" => "flex"
            , "borderRadius" => "10px"
            , "justifyContent" => "center"
            , "transition" => "all 0.4s ease"
            , "color" => "#000"
            ]


stringStyle : Attribute msg
stringStyle =
    style
        [ "width" => "950px"
        , "borderBottom" => "1px solid #aaa"
        , "marginTop" => "32px"
        , "zIndex" => "-1"
        ]


beatStyle : Attribute msg
beatStyle =
    style
        [ "display" => "flex"
        , "color" => "#03a9f4"
        , "paddingRight" => "200px"
        ]


fingerPickChordTitleStyle : Attribute msg
fingerPickChordTitleStyle =
    style
        [ "position" => "fixed"
        , "top" => "50px"
        , "left" => "30px"
        , "color" => "#000"
        , "transform" => "scale(0.8, 0.8)"
        , "fontSize" => "20px"
        , "textAlign" => "center"
        ]


buttonStyle : Attribute msg
buttonStyle =
    style
        [ "background" => "none"
        , "marginTop" => "50px"
        , "border" => "1px solid #333"
        , "color" => "#03a9f4"
        ]


fingerPickNotationBaseStyles fill =
    style
        [ "position" => "absolute"
        , "bottom" => "-10px"
        , "left" => "-5px"
        , "width" => "14px"
        , "height" => "15px"
        , "transform" => "skew(-20deg)"
        , "border" => "2px solid #555"
        , "borderRadius" => "10px"
        , "backgroundColor" => fill
        ]


fingerPickNotationContainerStyle =
    style
        [ "position" => "relative"
        , "height" => "35px"
        , "borderRight" => "2px solid #555"
        ]


fingerPickNotationFlagStyle flag =
    style
        [ "position" => "absolute"
        , "top" => "-7px"
        , "right" => "-15px"
        , "width" => "15px"
        , "height" => "15px"
        , "transform" => "skew(30deg)"
        , "visibility" => flag
        , "fontSize" => "20px"
        , "color" => "#555"
        ]


fingerPickNotationDotStyle =
    style
        [ "position" => "absolute"
        , "bottom" => "-30px"
        , "right" => "-15px"
        , "fontSize" => "50px"
        , "color" => "#555"
        ]
