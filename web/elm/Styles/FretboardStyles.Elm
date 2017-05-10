module Styles.FretboardStyles exposing (..)

import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.Types exposing (Model)


fretboardTitleStyle : Attribute msg
fretboardTitleStyle =
    style
        [ ( "fontSize", "16px" )
        , ( "textAlign", "center" )
        , ( "marginBottom", "30px" )
        , ( "color", "#fff" )
        ]


fretboardContainerStyle : Attribute msg
fretboardContainerStyle =
    style
        [ ( "margin", "50px" )
        , ( "width", "90%" )
        , ( "position", "relative" )
        ]


fretboardStringStyle : Attribute msg
fretboardStringStyle =
    style [ ( "display", "flex" ) ]


fretNoteStyle : String -> Attribute msg
fretNoteStyle color =
    style
        [ ( "width", "100px" )
        , ( "padding", "14px 5px" )
        , ( "textTransform", "uppercase" )
        , ( "color", color )
        , ( "fontSize", "14px" )
        , ( "textAlign", "center" )
        , ( "borderBottom", "1px solid #444" )
        , ( "borderCollapse", "collapse" )
        , ( "transition", "all 0.4s ease" )
        , ( "zIndex", "1" )
        ]


fretBlankStyle : Attribute msg
fretBlankStyle =
    style
        [ ( "color", "rgba(0,0,0,0)" )
        , ( "width", "100px" )
        , ( "padding", "5px" )
        ]


fretNumberStyle : Attribute msg
fretNumberStyle =
    style
        [ ( "width", "100px" )
        , ( "marginBottom", "-70px" )
        , ( "padding", "5px" )
        , ( "textTransform", "uppercase" )
        , ( "color", "#E91750" )
        , ( "fontSize", "20px" )
        , ( "textAlign", "center" )
        ]


noteGroupStyle : Attribute msg
noteGroupStyle =
    style
        [ ( "postion", "relative" ) ]


notationContainerStyle : Attribute msg
notationContainerStyle =
    style
        [ ( "width", "350px" )
        , ( "padding", "50px 10px" )
        , ( "margin", "70px auto" )
        , ( "position", "relative" )
        , ( "textAlign", "center" )
        ]


notationClefStyle : Attribute msg
notationClefStyle =
    style
        [ ( "position", "absolute" )
        , ( "bottom", "50px" )
        , ( "left", "40px" )
        , ( "height", "100px" )
        ]


{-| Dynamicall adds high or low ledger lines as needed
-}
notationNoteStyle : Float -> Attribute msg
notationNoteStyle offset =
    style
        [ ( "width", "18px" )
        , ( "height", "18px" )
        , ( "borderRadius", "9px" )
        , ( "position", "absolute" )
        , ( "bottom", (toString offset) ++ "px" )
        , ( "left", "50%" )
        , ( "backgroundColor", "#f2b632" )
        , ( "transition", "all 0.5s ease" )
        , ( "zIndex", "1" )
        ]


notationAccidentalStyle : Float -> String -> Attribute msg
notationAccidentalStyle offset visibility =
    style
        [ ( "fontSize", "28px" )
        , ( "position", "absolute" )
        , ( "marginBottom", "-10px" )
        , ( "bottom", (toString <| offset - 3) ++ "px" )
        , ( "left", "44%" )
        , ( "color", "#f2b632" )
        , ( "opacity", visibility )
        , ( "transition", "all 0.5s ease" )
        , ( "zIndex", "1" )
        ]


hrStyle : Attribute msg
hrStyle =
    style
        [ ( "width", "280px" )
        , ( "margin", "0 auto" )
        , ( "padding", "10px" )
        , ( "borderTop", "0.1rem solid #444" )
        ]


hrLedgerStyleHi : Float -> Float -> Attribute msg
hrLedgerStyleHi notePosition offset =
    let
        pos =
            notePosition

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
            , ( "opacity", visibility )
            , ( "borderTop", "0.1rem solid #444" )
            , ( "transition", "opacity 0.5s ease" )
            , ( "zIndex", "0" )
            ]


hrLedgerStyleLo : Float -> Float -> Attribute msg
hrLedgerStyleLo notePosition offset =
    let
        pos =
            notePosition

        visibility =
            if pos < (offset + 20.0) then
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
            , ( "opacity", visibility )
            , ( "borderTop", "0.1rem solid #444" )
            , ( "transition", "opacity 0.5s ease" )
            , ( "zIndex", "0" )
            ]
