module Views.Fretboard exposing (fretboardPage, fretNotation, noteFretPos, noteStringPos)

import Html exposing (Html, div, span, text, hr, img)
import Html.Events exposing (onClick)
import Html.Attributes exposing (style, src)
import Logic.Types exposing (Model, Msg(..))
import InlineHover exposing (hover)
import List.Extra exposing (getAt, elemIndex)
import Styles.FretboardStyles exposing (..)


fretboardPage : Model -> Html Msg
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
                if List.member note (notesInKey model.musKey) then
                    hover highlight div [ fretNoteStyle "#222", onClick (DrawNote index stringNo sharp) ] [ text note ]
                else
                    hover highlight div [ fretNoteStyle "#ccc", onClick (DrawNote index stringNo sharp) ] [ text note ]

        fretNumberMarkers num =
            div [ fretNumberStyle ] [ text <| toString num ]

        blank note =
            div [ fretBlankStyle ] [ text note ]
    in
        div [ style [ ( "position", "relative" ) ] ]
            [ div [ fretboardContainerStyle ]
                [ div [ fretboardTitleStyle ] [ text "Click On The Fret To See A Musical Note" ]
                , div [ fretboardTitleStyle ] [ text ("KEY OF " ++ model.musKey) ]
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
            , fretboardModal model
            ]


fretNumbers : List Int
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


revealNotes : List ( String, String )
revealNotes =
    [ ( "opacity", "1" )
    , ( "z-index", "500" )
    , ( "transform", "scale(3,3)" )
    ]


{-| Draws the musical staff and ledge lines.
--
-}
fretNotation : Model -> Html Msg
fretNotation model =
    div [ notationContainerStyle ]
        [ img [ notationClefStyle, src "Public/clefDark.png" ] []
        , div [ notationNoteStyle model.notePosition ] []
        , div [ notationAccidentalStyle model.notePosition model.showAccidental ] [ text "#" ]
        , hr [ hrStyle ] []
        , hr [ hrStyle ] []
        , hr [ hrStyle ] []
        , hr [ hrStyle ] []
        , hr [ hrStyle ] []
        , hr [ hrLedgerStyleHi model.notePosition 195.0 ] []
        , hr [ hrLedgerStyleHi model.notePosition 175.0 ] []
        , hr [ hrLedgerStyleHi model.notePosition 155.0 ] []
        , hr [ hrLedgerStyleLo model.notePosition 30.0 ] []
        , hr [ hrLedgerStyleLo model.notePosition 10.0 ] []
        , hr [ hrLedgerStyleLo model.notePosition -10.0 ] []
        ]


{-| Determines note x position per string.
-}
noteStringPos : String -> Float
noteStringPos stringNo =
    let
        num =
            Result.withDefault 0 <| String.toInt stringNo
    in
        case num of
            6 ->
                -8.0

            5 ->
                22.0

            4 ->
                52.0

            3 ->
                82.0

            2 ->
                104.0

            1 ->
                136.0

            _ ->
                0.0


{-| More specifically determines note x position per note on fretboard.
-}
noteFretPos : String -> Float
noteFretPos index =
    let
        num =
            Result.withDefault 0 <| String.toInt index
    in
        toFloat num * 10.25


chromaticNotesList : List String
chromaticNotesList =
    [ "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b" ]


{-| Determines which notes are in key to highlight them on the fretboard page
-}
notesInKey : String -> List String
notesInKey key =
    let
        index =
            -- If Key is a flat key (like Eb), will switch to enharmonic # (D#).
            if String.length key == 2 && String.slice 1 2 key == "b" then
                let
                    newIndex =
                        String.toLower <| String.slice 0 1 key
                in
                    (Maybe.withDefault 0 <| elemIndex newIndex chromaticNotesList) - 1
            else
                Maybe.withDefault 0 <| elemIndex (String.toLower key) chromaticNotesList

        noteList =
            []

        intervalListMajor =
            [ 0, 2, 4, 5, 7, 9, 11 ]

        intervalListMinor =
            [ 0, 2, 3, 5, 7, 8, 10 ]

        mapper =
            List.map (\a -> inserter (index + a))

        inserter n =
            let
                a =
                    if n > 11 then
                        n - 12
                    else
                        n
            in
                (Maybe.withDefault "c" <| getAt a chromaticNotesList)
    in
        -- Determines major or minor key and inserts into blank list.
        if String.toUpper key == key then
            noteList ++ mapper intervalListMajor
        else
            noteList ++ mapper intervalListMinor


fretboardModal : Model -> Html Msg
fretboardModal model =
    div [ fretboardModalStyle model ]
        [ div [ closeModalIcon, onClick ShowModal ] [ text "close" ]
        , div [] [ text ("Fretboard Page. Instructions Coming Soon! Key: " ++ model.musKey) ]
        ]
