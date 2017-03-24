module Styles exposing (..)

import Html.Attributes exposing (..)


-- NAV


navStyle =
    style
        [ ( "textAlign", "center" ) ]


navItemStyle =
    style
        [ ( "margin", "10px auto" )
        , ( "padding", "5px" )
        , ( "color", "#fff" )
        ]



-- FRETBOARD


fretboardContainerStyle =
    style
        [ ( "margin", "50px" )
        , ( "width", "90%" )
        , ( "border", "2px solid #444" )
        , ( "position", "relative" )
        ]


fretboardStringStyle =
    style [ ( "display", "flex" ) ]


fretNoteStyle =
    style
        [ ( "width", "100px" )
        , ( "padding", "5px" )
        , ( "textTransform", "uppercase" )
        , ( "color", "#3A86FF" )
        , ( "fontSize", "20px" )
        , ( "textAlign", "center" )
        , ( "border", "1px solid #333" )
        , ( "borderBottom", "3px solid #333" )
        , ( "borderCollapse", "collapse" )
        , ( "transition", "all 0.4s ease" )
        , ( "backgroundColor", "#111" )
        , ( "zIndex", "1" )
        ]


fretBlankStyle =
    style
        [ ( "color", "rgba(0,0,0,0)" )
        , ( "border", "1px solid #222" )
        , ( "width", "100px" )
        , ( "padding", "5px" )
        , ( "backgroundColor", "#111" )
        ]


fretNumberStyle =
    style
        [ ( "width", "100px" )
          --, ( "position", "absolute" )
          --, ( "left", "0" )
        , ( "marginBottom", "-70px" )
        , ( "padding", "5px" )
        , ( "textTransform", "uppercase" )
        , ( "color", "#333" )
        , ( "fontSize", "20px" )
        , ( "textAlign", "left" )
        ]


noteGroupStyle =
    style
        [ ( "postion", "relative" ) ]


notationContainerStyle =
    style
        [ ( "width", "300px" )
        , ( "padding", "50px 10px" )
        , ( "margin", "70px auto" )
        , ( "backgroundColor", "#111" )
        , ( "position", "relative" )
          --, ( "top", "0" )
          --, ( "transform", "scale(-99,-99)" )
        , ( "textAlign", "center" )
        , ( "border", "1px solid #333" )
        ]


notationClefStyle =
    style
        [ ( "fontSize", "140px" )
        , ( "position", "absolute" )
        , ( "bottom", "0" )
        , ( "left", "10px" )
        , ( "color", "#fff" )
        ]


notationNoteStyle offset =
    style
        [ ( "width", "20px" )
        , ( "height", "20px" )
        , ( "borderRadius", "10px" )
        , ( "position", "absolute" )
        , ( "bottom", offset )
        , ( "left", "50%" )
        , ( "backgroundColor", "#3A86FF" )
        ]


notationAccidentalStyle offset visibility =
    style
        [ ( "fontSize", "28px" )
        , ( "position", "absolute" )
        , ( "marginBottom", "-10px" )
        , ( "bottom", offset )
        , ( "left", "44%" )
        , ( "color", "#3A86FF" )
        , ( "visibility", visibility )
        ]


hrStyle =
    style
        [ ( "width", "280px" )
        , ( "margin", "0 auto" )
        , ( "padding", "10px" )
        ]



-- CHORDS


chordBarPosStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "-15px" )
        , ( "right", "30%" )
        , ( "color", "deepPink" )
        , ( "transition", "all 0.3s ease" )
        ]


chartStyle =
    style
        [ ( "position", "relative" )
        , ( "width", "180px" )
        , ( "height", "153px" )
        , ( "border", "3px solid #333" )
        , ( "borderBottom", "none" )
        ]


stringStyle =
    style
        [ ( "width", "180px" )
        , ( "height", "30px" )
        , ( "borderBottom", "3px solid #333" )
        ]


nutStyle =
    style
        [ ( "width", "10px" )
        , ( "height", "153px" )
        , ( "backgroundColor", "#333" )
        , ( "borderBottom", "3px solid #333" )
        ]


chartContainerStyle direction =
    style
        [ ( "position", "relative" )
        , ( "display", "flex" )
        , ( "margin", "25px auto" )
        , ( "flexDirection", direction )
        , ( "transition", "all 0.3s ease" )
        ]


fretStyle fret =
    style
        [ ( "position", "absolute" )
        , ( "top", "0" )
        , ( "right", (Basics.toString (43 * fret) ++ "px") )
        , ( "height", "150px" )
        , ( "borderRight", "3px solid #333" )
        ]


chordNameStyle =
    style
        [ ( "cursor", "pointer" )
        , ( "color", "#E8F1F2" )
        , ( "fontSize", "50px" )
        , ( "marginLeft", "150px" )
        , ( "margin", "0 auto" )
        ]


chordFunctionStyle =
    style
        [ ( "cursor", "pointer" )
        , ( "color", "#3A86FF" )
        , ( "fontSize", "30px" )
        , ( "marginLeft", "150px" )
        , ( "margin", "0 auto" )
        ]


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
                , ( "top", dot.stringNo )
                , ( "right", dot.fretNo )
                , ( "width", "25px" )
                , ( "height", barSize )
                , ( "borderRadius", "13px" )
                , ( "backgroundColor", "#777" )
                , ( "color", "rgba(0,0,0,0)" )
                ]
    else if dot.fretNo == "-40" then
        let
            textColor =
                "#777"
        in
            style
                [ ( "transition", "all 0.5s ease" )
                , ( "position", "absolute" )
                , ( "top", dot.stringNo )
                , ( "right", dot.fretNo )
                , ( "width", "25px" )
                , ( "height", "25px" )
                , ( "borderRadius", "13px" )
                , ( "backgroundColor", "rgba(0,0,0,0)" )
                , ( "color", textColor )
                , ( "textTransform", "uppercase" )
                ]
    else
        style
            [ ( "transition", "all 0.5s ease" )
            , ( "position", "absolute" )
            , ( "top", dot.stringNo )
            , ( "right", dot.fretNo )
            , ( "width", "25px" )
            , ( "height", "25px" )
            , ( "borderRadius", "13px" )
            , ( "backgroundColor", dot.tint )
            , ( "color", "rgba(0,0,0,0)" )
            ]
