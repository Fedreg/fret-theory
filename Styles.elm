module Styles exposing (..)

import Html.Attributes exposing (..)


chartStyle =
    style [ ( "position", "relative" ), ( "width", "180px" ), ( "height", "153px" ), ( "border", "3px solid #333" ), ( "borderBottom", "none" ) ]


stringStyle =
    style [ ( "width", "180px" ), ( "height", "30px" ), ( "borderBottom", "3px solid #333" ) ]


nutStyle =
    style [ ( "width", "10px" ), ( "height", "153px" ), ( "backgroundColor", "#333" ), ( "borderBottom", "3px solid #333" ) ]


chartContainerStyle direction =
    style [ ( "display", "flex" ), ( "margin", "25px auto" ), ( "flexDirection", direction ) ]


fretStyle fret =
    style [ ( "position", "absolute" ), ( "top", "0" ), ( "right", (Basics.toString (43 * fret) ++ "px") ), ( "height", "150px" ), ( "borderRight", "3px solid #333" ) ]


chordNameStyle =
    style [ ( "color", "#E8F1F2" ), ( "fontSize", "50px" ), ( "marginLeft", "150px" ), ( "margin", "0 auto" ) ]


chordFunctionStyle =
    style [ ( "color", "#3A86FF" ), ( "fontSize", "30px" ), ( "marginLeft", "150px" ), ( "margin", "0 auto" ) ]


fretMarkerStyle dot =
    if dot.tint == "bar" then
        let
            stringHeight =
                Result.withDefault -15 (String.toInt dot.stringNo)

            barSize =
                toString (160 - stringHeight) ++ "px"
        in
            style [ ( "transition", "all 0.5s ease" ), ( "position", "absolute" ), ( "top", dot.stringNo ), ( "right", dot.fretNo ), ( "width", "25px" ), ( "height", barSize ), ( "borderRadius", "13px" ), ( "backgroundColor", "#E8F1F2" ) ]
    else if dot.fretNo == "-40" then
        let
            textColor =
                "#777"
        in
            style [ ( "transition", "all 0.5s ease" ), ( "position", "absolute" ), ( "top", dot.stringNo ), ( "right", dot.fretNo ), ( "width", "25px" ), ( "height", "25px" ), ( "borderRadius", "13px" ), ( "backgroundColor", "rgba(0,0,0,0)" ), ( "color", textColor ), ( "textTransform", "uppercase" ) ]
    else
        style [ ( "transition", "all 0.5s ease" ), ( "position", "absolute" ), ( "top", dot.stringNo ), ( "right", dot.fretNo ), ( "width", "25px" ), ( "height", "25px" ), ( "borderRadius", "13px" ), ( "backgroundColor", dot.tint ), ( "color", "rgba(0,0,0,0)" ) ]
