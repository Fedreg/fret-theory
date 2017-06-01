module Strum.Styles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Utils exposing ((=>))


strumPageStyle : String -> Attribute msg
strumPageStyle size =
    let
        pad =
            case size of
                "4" ->
                    "100px"

                "2" ->
                    "100px"

                _ ->
                    "175px"
    in
        style
            [ "display" => "flex"
            , "flexDirection" => "column"
            , "paddingTop" => pad
            , "alignItems" => "center"
            , "transition" => "all 0.3s"
            ]


strumGroupStyle : String -> String -> Attribute msg
strumGroupStyle scale margin =
    style
        [ "transform" => ("scale(" ++ scale ++ ")")
        , "width" => "950px"
        , "margin" => margin
        ]


strumGroupMatrixStyle : Attribute msg
strumGroupMatrixStyle =
    style
        [ "display" => "flex"
        , "flexWrap" => "wrap"
        , "justifyContent" => "center"
        ]


{-| Determines if arrow is displayed and if it points up or down.
-}
strumArrowStyle : Int -> Int -> String -> String -> Attribute msg
strumArrowStyle num mover borderCol background =
    let
        opacity =
            case num of
                1 ->
                    "1"

                2 ->
                    "0"

                _ ->
                    "hidden"

        rotate =
            case mover of
                1 ->
                    "180deg"

                2 ->
                    "0"

                _ ->
                    "0"

        shadow =
            case mover of
                1 ->
                    "-5px -15px 20px -10px rgba(0,0,0,0.5)"

                2 ->
                    "5px 15px 20px -10px rgba(0,0,0,0.5)"

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
            , "border" => ("1px solid " ++ borderCol)
            , "borderRadius" => "10px"
            , "justifyContent" => "center"
            , "transform" => ("rotate(" ++ rotate ++ ")")
            , "transition" => "all 0.4s ease"
            , "boxShadow" => shadow
            , "backgroundColor" => background
            ]


beatStyle : Attribute msg
beatStyle =
    style
        [ "position" => "absolute"
        , "top" => "225px"
        , "left" => "0"
        , "paddingRight" => "20px"
        ]


buttonStyle : Attribute msg
buttonStyle =
    style
        [ "background" => "none"
        , "marginTop" => "50px"
        , "border" => "1px solid #333"
        , "color" => "#03a9f4"
        ]
