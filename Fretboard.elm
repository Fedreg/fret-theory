module Fretboard exposing (..)

import Html exposing (div, hr, text, span)
import Html.Events exposing (onClick)
import Html.Attributes exposing (style, property)
import String exposing (split, toInt)
import List exposing (map, range)
import Types exposing (..)
import InlineHover exposing (hover)
import Json.Encode as Encode
import List.Extra exposing (getAt)


fretboardPage model =
    let
        highlight =
            [ ( "background-color", "#E91750" )
            , ( "transform", "scale(1.5, 1.5)" )
            , ( "color", "#fff" )
            , ( "z-index", "2" )
            ]

        frets info =
            let
                stringData =
                    String.split "/" info

                index =
                    Maybe.withDefault "0" <| getAt 1 stringData

                stringNo =
                    Maybe.withDefault "0" <| getAt 0 stringData

                note =
                    Maybe.withDefault "0" <| getAt 2 stringData

                sharp =
                    case String.length note of
                        1 ->
                            "0"

                        2 ->
                            "1"

                        _ ->
                            "0"
            in
                hover highlight div [ fretNoteStyle, onClick (Types.DrawNote index stringNo sharp) ] [ text note ]

        fretNumberMarkers num =
            div [ fretNumberStyle ] [ text <| toString num ]

        blank note =
            div [ fretBlankStyle ] [ text note ]
    in
        div [ style [ ( "position", "relative" ) ] ]
            [ div [ fretboardContainerStyle ]
                [ div [ fretboardTitleStyle ] [ text "CLICK ON A FRET TO SEE THE MUSICAL NOTE" ]
                , div [ fretboardStringStyle ]
                    (List.map frets <| List.reverse stringE)
                , div [ fretboardStringStyle ]
                    (List.map frets <| List.reverse stringA)
                , div [ fretboardStringStyle ]
                    (List.map frets <| List.reverse stringD)
                , div [ fretboardStringStyle ]
                    (List.map frets <| List.reverse stringG)
                , div [ fretboardStringStyle ]
                    (List.map frets <| List.reverse stringB)
                , div [ fretboardStringStyle ]
                    (List.map frets <| List.reverse stringe)
                , div [ fretboardStringStyle ]
                    (List.map blank <| List.reverse stringe)
                , div [ fretboardStringStyle ]
                    (List.map fretNumberMarkers <| List.reverse fretNumbers)
                ]
            , fretNotation model
            ]


fretNumbers =
    List.range 0 12


stringE =
    [ "6/0/e", "6/1/f", "6/1/f#", "6/2/g", "6/2/g#", "6/3/a", "6/3/a#", "6/4/b", "6/5/c", "6/5/c#", "6/6/d", "6/6/d#", "6/7/e" ]


stringA =
    [ "5/0/a", "5/0/a#", "5/1/b", "5/2/c", "5/2/c#", "5/3/d", "5/3/d#", "5/4/e", "5/5/f", "5/5/f#", "5/6/g", "5/6/g#", "5/7/a" ]


stringD =
    [ "4/0/d", "4/0/d#", "4/1/e", "4/2/f", "4/2/f#", "4/3/g", "4/3/g#", "4/4/a", "4/4/a#", "4/5/b", "4/6/c", "4/6/c#", "4/7/d" ]


stringG =
    [ "3/0/g", "3/0/g#", "3/1/a", "3/1/a#", "3/2/b", "3/3/c", "3/3/c#", "3/4/d", "3/4/d#", "3/5/e", "3/6/f", "3/6/f#", "3/7/g" ]


stringB =
    [ "2/0/b", "2/1/c", "2/1/c#", "2/2/d", "2/2/d#", "2/3/e", "2/4/f", "2/4/f#", "2/5/g", "2/5/g#", "2/6/a", "2/6/a#", "2/7/b" ]


stringe =
    [ "1/0/e", "1/1/f", "1/1/f#", "1/2/g", "1/2/g#", "1/3/a", "1/3/a#", "1/4/b", "1/5/c", "1/5/c#", "1/6/d", "1/6/d#", "1/7/e" ]


revealNotes =
    [ ( "opacity", "1" )
    , ( "z-index", "500" )
    , ( "transform", "scale(3,3)" )
    ]


{-| Draws the musical staff and ledge lines.
-}
fretNotation model =
    div [ notationContainerStyle ]
        [ div [ notationClefStyle, property "innerHTML" (Encode.string "&#x1d11e;") ] []
        , div [ notationNoteStyle model.notePosition ] []
        , div [ notationAccidentalStyle model.notePosition model.showAccidental ] [ text "#" ]
        , hr [ hrStyle ] []
        , hr [ hrStyle ] []
        , hr [ hrStyle ] []
        , hr [ hrStyle ] []
        , hr [ hrStyle ] []
        , hr [ hrLedgerStyleHi model 195 ] []
        , hr [ hrLedgerStyleHi model 175 ] []
        , hr [ hrLedgerStyleHi model 155 ] []
        , hr [ hrLedgerStyleLo model 30 ] []
        , hr [ hrLedgerStyleLo model 10 ] []
        , hr [ hrLedgerStyleLo model -10 ] []
        ]


{-| Determines note x position per string.
-}
noteStringPos stringNo =
    let
        num =
            Result.withDefault 0 <| String.toInt stringNo
    in
        case num of
            6 ->
                -8

            5 ->
                22

            4 ->
                52

            3 ->
                82

            2 ->
                104

            1 ->
                136

            _ ->
                0


{-| More specifically determines note x position per note on fretboard.
-}
noteFretPos index =
    let
        num =
            Result.withDefault 0 <| String.toInt index
    in
        toFloat num * 10.1



-- STYLES


fretboardTitleStyle =
    style
        [ ( "fontSize", "20px" )
        , ( "textAlign", "center" )
        , ( "marginBottom", "30px" )
        , ( "color", "#E9175D" )
        ]


fretboardContainerStyle =
    style
        [ ( "margin", "50px" )
        , ( "width", "90%" )
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
        , ( "fontSize", "12px" )
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
        , ( "color", "#E91750" )
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


{-| Dynamicall adds high or low ledger lines as needed
-}
notationNoteStyle offset =
    style
        [ ( "width", "18px" )
        , ( "height", "18px" )
        , ( "borderRadius", "9px" )
        , ( "position", "absolute" )
        , ( "bottom", (toString offset) ++ "px" )
        , ( "left", "50%" )
        , ( "backgroundColor", "#E91750" )
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
        , ( "color", "#E91750" )
        , ( "opacity", visibility )
        , ( "transition", "all 0.5s ease" )
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
            , ( "opacity", visibility )
            , ( "transition", "opacity 0.5s ease" )
            , ( "zIndex", "0" )
            ]
