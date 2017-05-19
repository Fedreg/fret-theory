module Styles.ChordStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)


-- import Pages.Chords exposing (Dot)


chordsPageStyle : Attribute msg
chordsPageStyle =
    style
        [ ( "textAlign", "center" )
        , ( "width", "95vw" )
        , ( "paddingTop", "125px" )
        ]


chordBarPosStyle : Attribute msg
chordBarPosStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "-15px" )
        , ( "right", "30%" )
        , ( "color", "#03a9f4" )
        , ( "transition", "all 0.3s ease" )
        ]


chartStyle : Attribute msg
chartStyle =
    style
        [ ( "position", "relative" )
        , ( "width", "180px" )
        , ( "height", "151px" )
        , ( "border", "1px solid #607d8b" )
        , ( "borderTopLeftRadius", "10px" )
        , ( "borderBottomLeftRadius", "10px" )
        , ( "boxShadow", "0 10px 20px rgba(0,0,0,0.25)" )
        ]


stringStyle : Attribute msg
stringStyle =
    style
        [ ( "width", "180px" )
        , ( "height", "30px" )
        , ( "borderBottom", "1px solid #607d8b" )
        ]


nutStyle : Attribute msg
nutStyle =
    style
        [ ( "width", "10px" )
        , ( "height", "151px" )
        , ( "backgroundColor", "#333" )
        , ( "borderBottom", "1px solid #333" )
        , ( "boxShadow", "5px 10px 20px  rgba(0,0,0,0.25)" )
        ]


chartContainerStyle : String -> Attribute msg
chartContainerStyle direction =
    style
        [ ( "position", "relative" )
        , ( "display", "flex" )
        , ( "margin", "25px auto" )
        , ( "flexDirection", direction )
        , ( "transition", "all 0.3s ease" )
        , ( "cursor", "pointer" )
        ]


fretStyle : Int -> Attribute msg
fretStyle fret =
    style
        [ ( "position", "absolute" )
        , ( "top", "0" )
        , ( "right", Basics.toString (43 * fret) ++ "px" )
        , ( "height", "150px" )
        , ( "borderRight", "1px solid #607d8b" )
        ]


chordNameStyle : Attribute msg
chordNameStyle =
    style
        [ ( "color", "#000" )
        , ( "fontSize", "25px" )
        , ( "marginLeft", "150px" )
        , ( "margin", "0 auto" )
        ]


chordFunctionStyle : Attribute msg
chordFunctionStyle =
    style
        [ ( "color", "#999" )
        , ( "fontSize", "20px" )
        , ( "marginLeft", "150px" )
        , ( "margin", "0 auto" )
        ]


fingerChartStyle : Attribute msg
fingerChartStyle =
    style
        [ ( "display", "flex" )
        , ( "flexDirection", "column" )
        , ( "position", "absolute" )
        , ( "top", "100px" )
        , ( "left", "20px" )
        ]


fingerChartDotStyle : String -> Attribute msg
fingerChartDotStyle col =
    style
        [ ( "width", "15px" )
        , ( "height", "25px" )
        , ( "borderRadius", "7px" )
        , ( "backgroundColor", col )
        ]


fingerChartTextStyle : Attribute msg
fingerChartTextStyle =
    style
        [ ( "padding", "15px" )
        , ( "lineHeight", "9px" )
        ]


{-| Determines if fret marker dot is a bar, a dot, or a 'X', or 'O'.
-}



-- fretMarkerStyle : Dot -> Attribute msg


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
                , ( "boxShadow", "5px 5px 10px rgba(0,0,0,0.25)" )
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
            , ( "boxShadow", "5px 5px 10px rgba(0,0,0,0.25)" )
            , ( "color", "rgba(0,0,0,0)" )
            , ( "zIndex", "5" )
            ]


soloOnNumberStyle : Attribute msg
soloOnNumberStyle =
    style
        [ ( "fontSize", "25px" )
        , ( "color", "#03a9f4" )
        ]


soloOnTextStyle : Attribute msg
soloOnTextStyle =
    style
        [ ( "fontSize", "18px" )
        , ( "paddingBottom", "50px" )
        , ( "color", "#A8A7A7" )
        , ( "textDecoration", "inherit" )
        ]


soloOnLinkStyle : Attribute msg
soloOnLinkStyle =
    style [ ( "color", "#aaa" ) ]
