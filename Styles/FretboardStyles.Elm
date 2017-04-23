module Styles.FretboardStyles exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Logic.Types exposing (Model)


fretboardTitleStyle : Attribute msg
fretboardTitleStyle =
    style
        [ ( "fontSize", "14px" )
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
        , ( "fontSize", "12px" )
        , ( "textAlign", "center" )
        , ( "borderBottom", "1px solid #222" )
        , ( "borderCollapse", "collapse" )
        , ( "transition", "all 0.4s ease" )
        , ( "backgroundColor", "#000" )
        , ( "zIndex", "1" )
        ]


fretBlankStyle : Attribute msg
fretBlankStyle =
    style
        [ ( "color", "rgba(0,0,0,0)" )
        , ( "width", "100px" )
        , ( "padding", "5px" )
        , ( "backgroundColor", "#000" )
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
        , ( "backgroundColor", "#000" )
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
        , ( "color", "#fff" )
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
        , ( "backgroundColor", "#5CE6CD" )
        , ( "transition", "all 0.5s ease" )
        , ( "zIndex", "1" )
        ]


notationAccidentalStyle : Float -> String -> Attribute msg
notationAccidentalStyle offset visibility =
    style
        [ ( "fontSize", "28px" )
        , ( "position", "absolute" )
        , ( "marginBottom", "-10px" )
        , ( "bottom", (toString offset) ++ "px" )
        , ( "left", "44%" )
        , ( "color", "#5CE6CD" )
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
            , ( "transition", "opacity 0.5s ease" )
            , ( "zIndex", "0" )
            ]


fretboardModalStyle : Model -> Attribute msg
fretboardModalStyle model =
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
