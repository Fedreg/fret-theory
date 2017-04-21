module Assets.Styles.StrumStyles exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Assets.Logic.Types exposing (Model)


strumPageStyle : Attribute msg
strumPageStyle =
    style
        [ ( "height", "100vh" )
        , ( "display", "flex" )
        , ( "flexDirection", "column" )
        , ( "paddingTop", "150px" )
        , ( "alignItems", "center" )
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
    in
        style
            [ ( "width", "100px" )
            , ( "height", "200px" )
            , ( "margin", "10px" )
            , ( "opacity", opacity )
            , ( "paddingTop", "100px" )
            , ( "display", "flex" )
            , ( "justifyContent", "center" )
            , ( "transform", "rotate(" ++ rotate ++ ") translateY(-40px)" )
            , ( "transition", "opacity 0.4s ease" )
            ]


beatStyle : Attribute msg
beatStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "200px" )
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
                , ( "top", "50px" )
                , ( "left", "50px" )
                , ( "width", "90vw" )
                , ( "height", "90vh" )
                , ( "border", "1px solid #fff" )
                , ( "backgroundColor", "#000" )
                , ( "opacity", "0.9" )
                , ( "zIndex", "50" )
                , ( "color", "#fff" )
                , ( "textAlign", "center" )
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
        , ( "top", "5px" )
        , ( "right", "5px" )
        , ( "width", "50px" )
        , ( "padding", "2px" )
        , ( "border", "1px solid #E91750" )
        , ( "cursor", "pointer" )
        , ( "color", "#E91750" )
        ]
