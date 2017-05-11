module Styles.ChordStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model, Msg(..), Dot)


chordBarPosStyle : Attribute Msg
chordBarPosStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "-15px" )
        , ( "right", "30%" )
        , ( "color", "#E8175D" )
        , ( "transition", "all 0.3s ease" )
        ]


chartStyle : Attribute Msg
chartStyle =
    style
        [ ( "position", "relative" )
        , ( "width", "180px" )
        , ( "height", "151px" )
        , ( "border", "1px solid #111" )
        , ( "borderTopLeftRadius", "10px" )
        , ( "borderBottomLeftRadius", "10px" )
        , ( "boxShadow", "0 10px 20px rgba(0,0,0,1)" )
          -- , ( "backgroundColor", "#252839" )
        , ( "backgroundColor", "#555" )
        ]


stringStyle : Attribute Msg
stringStyle =
    style
        [ ( "width", "180px" )
        , ( "height", "30px" )
        , ( "borderBottom", "1px solid #111" )
        ]


nutStyle : Attribute Msg
nutStyle =
    style
        [ ( "width", "10px" )
        , ( "height", "151px" )
        , ( "backgroundColor", "#333" )
        , ( "borderBottom", "1px solid #333" )
        , ( "boxShadow", "5px 10px 20px  rgba(0,0,0,1)" )
        ]


chartContainerStyle : String -> Attribute Msg
chartContainerStyle direction =
    style
        [ ( "position", "relative" )
        , ( "display", "flex" )
        , ( "margin", "25px auto" )
        , ( "flexDirection", direction )
        , ( "transition", "all 0.3s ease" )
        , ( "cursor", "pointer" )
        ]


fretStyle : Int -> Attribute Msg
fretStyle fret =
    style
        [ ( "position", "absolute" )
        , ( "top", "0" )
        , ( "right", Basics.toString (43 * fret) ++ "px" )
        , ( "height", "150px" )
        , ( "borderRight", "1px solid #111" )
        ]


chordNameStyle : Attribute Msg
chordNameStyle =
    style
        [ ( "color", "#fff" )
        , ( "fontSize", "25px" )
        , ( "marginLeft", "150px" )
        , ( "margin", "0 auto" )
        ]


chordFunctionStyle : Attribute Msg
chordFunctionStyle =
    style
        [ ( "color", "#999" )
        , ( "fontSize", "20px" )
        , ( "marginLeft", "150px" )
        , ( "margin", "0 auto" )
        ]


fingerChartStyle : Attribute Msg
fingerChartStyle =
    style
        [ ( "display", "flex" )
        , ( "flexDirection", "column" )
        , ( "position", "absolute" )
        , ( "top", "20px" )
        , ( "left", "20px" )
        ]


{-| Determines if fret marker dot is a bar, a dot, or a 'X', or 'O'.
-}
fretMarkerStyle : Dot -> Attribute Msg
fretMarkerStyle dot =
    if dot.tint == "bar" then
        let
            stringHeight =
                Result.withDefault -15 (String.toInt dot.stringNo)

            barSize =
                toString (160 - stringHeight) ++ "px"
        in
            style
                [ ( "transition", "all 0.5s ease" )
                , ( "position", "absolute" )
                , ( "top", dot.stringNo ++ "px" )
                , ( "right", dot.fretNo ++ "px" )
                , ( "width", "15px" )
                , ( "height", barSize )
                , ( "borderRadius", "7px" )
                , ( "backgroundColor", "#677077" )
                , ( "color", "rgba(0,0,0,0)" )
                , ( "zIndex", "10" )
                , ( "boxShadow", "5px 5px 10px rgba(0,0,0,0.5)" )
                ]
    else if dot.fretNo == "-30" then
        style
            [ ( "transition", "all 0.5s ease" )
            , ( "position", "absolute" )
            , ( "top", dot.stringNo ++ "px" )
            , ( "right", dot.fretNo ++ "px" )
            , ( "width", "15px" )
            , ( "height", "25px" )
            , ( "borderRadius", "7px" )
            , ( "backgroundColor", "rgba(0,0,0,0)" )
            , ( "color", "#777" )
            , ( "textTransform", "uppercase" )
            ]
    else
        style
            [ ( "transition", "all 0.5s ease" )
            , ( "position", "absolute" )
            , ( "top", dot.stringNo ++ "px" )
            , ( "right", dot.fretNo ++ "px" )
            , ( "width", "15px" )
            , ( "height", "25px" )
            , ( "borderRadius", "7px" )
            , ( "backgroundColor", dot.tint )
            , ( "boxShadow", "5px 5px 10px rgba(0,0,0,0.5)" )
            , ( "color", "rgba(0,0,0,0)" )
            , ( "zIndex", "5" )
            ]
