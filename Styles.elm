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
        , ( "color", "#777" )
        ]



-- FRETBOARD


fretboardContainerStyle =
    style
        [ ( "margin", "50px" )
        , ( "width", "90%" )
          --, ( "border", "2px solid #555" )
        , ( "position", "relative" )
        ]


fretboardStringStyle =
    style [ ( "display", "flex" ) ]


fretNoteStyle =
    style
        [ ( "width", "100px" )
        , ( "padding", "14px 5px" )
        , ( "textTransform", "uppercase" )
        , ( "color", "#777" )
        , ( "fontSize", "10px" )
        , ( "textAlign", "center" )
        , ( "borderBottom", "1px solid #222" )
        , ( "borderCollapse", "collapse" )
        , ( "transition", "all 0.4s ease" )
        , ( "backgroundColor", "#111" )
        , ( "zIndex", "1" )
        ]


fretBlankStyle =
    style
        [ ( "color", "rgba(0,0,0,0)" )
        , ( "width", "100px" )
        , ( "padding", "5px" )
        , ( "backgroundColor", "#111" )
        ]


fretNumberStyle =
    style
        [ ( "width", "100px" )
        , ( "marginBottom", "-70px" )
        , ( "padding", "5px" )
        , ( "textTransform", "uppercase" )
        , ( "color", "#3A86FF" )
        , ( "fontSize", "20px" )
        , ( "textAlign", "center" )
        ]


noteGroupStyle =
    style
        [ ( "postion", "relative" ) ]


notationContainerStyle =
    style
        [ ( "width", "350px" )
        , ( "padding", "50px 10px" )
        , ( "margin", "70px auto" )
        , ( "backgroundColor", "#111" )
        , ( "position", "relative" )
        , ( "textAlign", "center" )
        ]


notationClefStyle =
    style
        [ ( "fontSize", "140px" )
        , ( "position", "absolute" )
        , ( "bottom", "0" )
        , ( "left", "30px" )
        , ( "color", "#fff" )
        ]


notationNoteStyle offset =
    style
        [ ( "width", "20px" )
        , ( "height", "20px" )
        , ( "borderRadius", "10px" )
        , ( "position", "absolute" )
        , ( "bottom", (toString offset) ++ "px" )
        , ( "left", "50%" )
        , ( "backgroundColor", "#3A86FF" )
        , ( "transition", "all 0.5s ease" )
        , ( "zIndex", "1" )
        ]


notationAccidentalStyle offset visibility =
    style
        [ ( "fontSize", "28px" )
        , ( "position", "absolute" )
        , ( "marginBottom", "-10px" )
        , ( "bottom", (toString offset) ++ "px" )
        , ( "left", "44%" )
        , ( "color", "#3A86FF" )
        , ( "opacity", visibility )
        , ( "transition", "opacity 0.5s ease" )
        , ( "zIndex", "1" )
        ]


hrStyle =
    style
        [ ( "width", "280px" )
        , ( "margin", "0 auto" )
        , ( "padding", "10px" )
        ]


hrLedgerStyleHi model offset =
    let
        pos =
            model.notePosition

        visibility =
            if pos > offset then
                "1"
            else
                "0"
    in
        style
            [ ( "position", "absolute" )
            , ( "bottom", (toString offset) ++ "px" )
            , ( "left", "45%" )
            , ( "width", "50px" )
            , ( "margin", "0 auto" )
            , ( "padding", "10px" )
            , ( "lineHeight", "30px" )
            , ( "opacity", visibility )
            , ( "transition", "opacity 0.5s ease" )
            , ( "zIndex", "0" )
            ]


hrLedgerStyleLo model offset =
    let
        pos =
            model.notePosition

        visibility =
            if pos < (offset + 20) then
                "1"
            else
                "0"
    in
        style
            [ ( "position", "absolute" )
            , ( "bottom", (toString offset) ++ "px" )
            , ( "left", "45%" )
            , ( "width", "50px" )
            , ( "margin", "0 auto" )
            , ( "padding", "10px" )
            , ( "lineHeight", "30px" )
            , ( "opacity", visibility )
            , ( "transition", "opacity 0.5s ease" )
            , ( "zIndex", "0" )
            ]



-- CHORDS


chordBarPosStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "-15px" )
        , ( "right", "30%" )
        , ( "color", "#3A86FF" )
        , ( "transition", "all 0.3s ease" )
        ]


chartStyle =
    style
        [ ( "position", "relative" )
        , ( "width", "180px" )
        , ( "height", "153px" )
        , ( "border", "1px solid #333" )
        , ( "borderBottom", "none" )
        ]


stringStyle =
    style
        [ ( "width", "180px" )
        , ( "height", "30px" )
        , ( "borderBottom", "1px solid #333" )
        ]


nutStyle =
    style
        [ ( "width", "10px" )
        , ( "height", "153px" )
        , ( "backgroundColor", "#333" )
        , ( "borderBottom", "1px solid #333" )
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
        , ( "borderRight", "1px solid #333" )
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
                , ( "backgroundColor", "#333" )
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
