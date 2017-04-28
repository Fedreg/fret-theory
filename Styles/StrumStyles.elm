module Styles.StrumStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model)


strumPageStyle : Attribute msg
strumPageStyle =
    style
        [ ( "height", "100vh" )
        , ( "width", "95vw" )
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
strumArrowStyle : Int -> Int -> Attribute msg
strumArrowStyle num mover =
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
                    "-5px -15px 20px -10px #bbb"

                2 ->
                    "5px 15px 20px -10px #bbb"

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
            , ( "borderRadius", "10px" )
            , ( "justifyContent", "center" )
            , ( "transform", "rotate(" ++ rotate ++ ")" )
            , ( "transition", "all 0.4s ease" )
            , ( "boxShadow", shadow )
            , ( "backgroundColor", "#fff" )
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
        , ( "color", "#E8175D" )
        ]


strumModalStyle : Model -> Attribute msg
strumModalStyle model =
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
