module Styles.StrumStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model)


strumPageStyle : Attribute msg
strumPageStyle =
    style
        [ ( "height", "100vh" )
        , ( "width", "100vw" )
        , ( "display", "flex" )
        , ( "flexDirection", "column" )
        , ( "paddingTop", "175px" )
        , ( "alignItems", "center" )
        ]


strumGroupStyle : String -> Attribute msg
strumGroupStyle scale =
    style
        [ ( "transform", "scale(" ++ scale ++ ")" )
        ]


{-| Determines if arrow is displayed and if it points up or down.
-}
strumArrowStyle : Int -> Int -> String -> Attribute msg
strumArrowStyle num mover borderCol =
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
            [ ( "width", "100px" )
            , ( "height", "180px" )
            , ( "margin", "10px 10px 20px" )
            , ( "opacity", opacity )
            , ( "paddingTop", "50px" )
            , ( "display", "flex" )
            , ( "border", "1px solid " ++ borderCol )
            , ( "borderRadius", "10px" )
            , ( "justifyContent", "center" )
            , ( "transform", "rotate(" ++ rotate ++ ")" )
            , ( "transition", "all 0.4s ease" )
            , ( "boxShadow", shadow )
            , ( "backgroundColor", "none" )
            ]


beatStyle : Attribute msg
beatStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "225px" )
        , ( "left", "0" )
        , ( "paddingRight", "200px" )
        ]


buttonStyle : Attribute msg
buttonStyle =
    style
        [ ( "background", "none" )
        , ( "marginTop", "50px" )
        , ( "border", "1px solid #333" )
        , ( "color", "#03a9f4" )
        ]
