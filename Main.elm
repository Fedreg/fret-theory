port module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import String exposing (..)
import List.Extra exposing (getAt)
import Routing
import Types exposing (..)
import Keys exposing (keys)
import Styles exposing (..)
import Notes exposing (..)
import Chords exposing (chordChartPage)
import Scales exposing (scalesPage)
import Fretboard exposing (..)
import Navigation exposing (Location)
import Time exposing (..)
import Update.Extra.Infix exposing ((:>))


main =
    Navigation.program Types.OnLocationChange
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init location =
    let
        currentRoute =
            Routing.parseLocation location
    in
        ( { route = currentRoute
          , musKey = "C"
          , index = 6
          , currentChord = []
          , notePosition = "0"
          , showAccidental = "hidden"
          }
        , Cmd.none
        )


port send : PlayBundle -> Cmd msg


update msg model =
    case msg of
        OnLocationChange location ->
            let
                newRoute =
                    Routing.parseLocation location
            in
                ( { model | route = newRoute }, Cmd.none )

        ChangeKey key ->
            ( { model | musKey = key }
            , Cmd.none
            )

        Play chord ->
            ( { model | currentChord = chord }, Cmd.none )
                :> update ResetIndex
                :> update SendNotes

        ResetIndex ->
            ( { model | index = 0 }, Cmd.none )

        SendNotes ->
            let
                note =
                    Notes.noteSorter <| Maybe.withDefault "e2w" <| getAt model.index model.currentChord
            in
                ( { model | index = model.index + 1 }
                , send (PlayBundle note "triangle")
                )

        DrawNote index string accidental ->
            let
                stringOffset =
                    noteStringPos string

                fretOffset =
                    noteFretPos index

                finalOffset =
                    toString (fretOffset + stringOffset) ++ "px"
            in
                ( { model | notePosition = finalOffset, showAccidental = accidental }, Cmd.none )


subscriptions model =
    if model.index < 6 then
        Time.every (0.1 * Time.second) (always SendNotes)
    else
        Sub.none


view : Model -> Html Msg
view model =
    div []
        [ div [ navStyle ]
            [ a [ href Routing.scalesPath, navItemStyle ] [ text "SCALES" ]
            , a [ href Routing.chordsPath, navItemStyle ] [ text "CHORDS" ]
            , a [ href Routing.fretboardPath, navItemStyle ] [ text "FRETBOARD" ]
            ]
        , page model
        ]


page : Model -> Html Msg
page model =
    case model.route of
        ChordChartPage ->
            Chords.chordChartPage model

        FretboardPage ->
            Fretboard.fretboardPage model

        ScalesPage ->
            Scales.scalesPage model

        NotFoundPage ->
            h1 [ style [ ( "margin", "100px auto" ) ] ] [ text "Page Not Found" ]
