module Styles.FingerPickStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model)


fingerPickingPageStyle : Attribute msg
fingerPickingPageStyle =
    style
        [ ( "height", "100vh" )
        , ( "width", "95vw" )
        , ( "display", "flex" )
        , ( "flexDirection", "column" )
        , ( "paddingTop", "150px" )
        , ( "alignItems", "center" )
        ]


fingerPickGroupStyle : String -> Attribute msg
fingerPickGroupStyle scale =
    style
        [ ( "transform", "scale(" ++ scale ++ ")" )
        , ( "position", "relative" )
        , ( "margin", "30px 0 0 200px" )
        , ( "cursor", "pointer" )
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
            [ ( "width", "100px" )
            , ( "height", "180px" )
            , ( "margin", "10px 10px 20px" )
            , ( "opacity", opacity )
            , ( "paddingTop", "50px" )
            , ( "display", "flex" )
            , ( "borderRadius", "10px" )
            , ( "justifyContent", "center" )
            , ( "transition", "all 0.4s ease" )
            , ( "color", "#fff" )
            ]


stringStyle : Attribute msg
stringStyle =
    style
        [ ( "width", "950px" )
        , ( "borderBottom", "1px solid #444" )
        , ( "marginTop", "32px" )
        , ( "zIndex", "-1" )
        ]


beatStyle : Attribute msg
beatStyle =
    style
        [ ( "display", "flex" )
        , ( "color", "#E8175D" )
        , ( "paddingRight", "200px" )
        ]


fingerPickChordTitleStyle : Attribute msg
fingerPickChordTitleStyle =
    style
        [ ( "position", "fixed" )
        , ( "top", "-30px" )
        , ( "left", "30px" )
        , ( "color", "#fff" )
        , ( "transform", "scale(0.6, 0.6)" )
        , ( "fontSize", "20px" )
        , ( "textAlign", "center" )
        ]


buttonStyle : Attribute msg
buttonStyle =
    style
        [ ( "background", "none" )
        , ( "marginTop", "50px" )
        , ( "border", "1px solid #333" )
        , ( "color", "#E8175D" )
        ]
