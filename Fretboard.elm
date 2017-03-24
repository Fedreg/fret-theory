module Fretboard exposing (..)

import Html exposing (div, hr, text)
import Html.Events exposing (onClick)
import Html.Attributes exposing (style, property)
import String exposing (split, toInt)
import List exposing (map, range)
import Styles exposing (..)
import Types exposing (..)
import InlineHover exposing (hover)
import Json.Encode as Encode
import List.Extra exposing (getAt)


fretboardPage model =
    let
        highlight =
            [ ( "background-color", "#111" )
            , ( "border", "2px solid #3A86FF" )
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
                [ div [ fretboardStringStyle ]
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
        , hr [ hrLedgerStyleHi model 180 ] []
        , hr [ hrLedgerStyleHi model 165 ] []
        , hr [ hrLedgerStyleHi model 150 ] []
        , hr [ hrLedgerStyleLo model 35 ] []
        , hr [ hrLedgerStyleLo model 20 ] []
        , hr [ hrLedgerStyleLo model 5 ] []
        ]


noteStringPos stringNo =
    let
        num =
            Result.withDefault 0 <| String.toInt stringNo
    in
        case num of
            6 ->
                0

            5 ->
                20

            4 ->
                50

            3 ->
                81

            2 ->
                103

            1 ->
                134

            _ ->
                0


noteFretPos index =
    let
        num =
            Result.withDefault 0 <| String.toInt index
    in
        num * 10
