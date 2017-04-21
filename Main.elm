port module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import List.Extra exposing (getAt)
import Assets.Logic.Routing as Routing
import Assets.Logic.Types exposing (Model, Msg(..), Route(..), PlayBundle)
import Assets.Logic.Audio exposing (noteSorter)
import Assets.Views.Home exposing (homePage)
import Assets.Views.Chords exposing (chordChartPage, keyList)
import Assets.Views.Scales exposing (scalesPage)
import Assets.Views.Fretboard exposing (fretboardPage, noteStringPos, noteFretPos)
import Assets.Views.Strum exposing (strumPage)
import Navigation exposing (Location)
import Time exposing (..)
import Update.Extra.Infix exposing ((:>))
import Json.Decode exposing (..)
import InlineHover exposing (hover)
import Random exposing (..)
import Assets.Styles.MainStyles exposing (..)


main =
    Navigation.program OnLocationChange
        { init = init
        , update = update
        , view = mainView
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
          , notePosition = 80.0
          , showAccidental = "0"
          , sliderValue = 1
          , navMenuOpen = False
          , pitchShift = 0
          , modalOpen = False
          , strumArrow = [ 1, 2, 1, 1, 2, 1, 1, 1 ]
          }
        , Cmd.none
        )


port send : PlayBundle -> Cmd msg


update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        ShowNavMenu ->
            ( { model | navMenuOpen = not model.navMenuOpen, modalOpen = False }, Cmd.none )

        ShowModal ->
            ( { model | modalOpen = not model.modalOpen }, Cmd.none )

        Randomize ->
            ( model, Random.generate StrumArrowDirection <| Random.list 8 (Random.int 1 2) )

        StrumArrowDirection numList ->
            ( { model | strumArrow = numList }, Cmd.none )

        OnLocationChange location ->
            let
                newRoute =
                    Routing.parseLocation location

                newKey =
                    Maybe.withDefault "C" <| Routing.modelUpdateOnHash model location
            in
                ( { model | route = newRoute, musKey = newKey, modalOpen = False }, Cmd.none )

        ChangeKey key ->
            ( { model | musKey = key, navMenuOpen = False }
            , Cmd.none
            )

        Play chord hzShift ->
            ( { model | currentChord = chord, pitchShift = hzShift }, Cmd.none )
                :> update ResetIndex
                :> update SendNotes

        ResetIndex ->
            ( { model | index = 0 }, Cmd.none )

        SendNotes ->
            let
                note =
                    noteSorter <| Maybe.withDefault "e2w" <| getAt model.index model.currentChord

                shiftedNote =
                    { note | frequency = note.frequency * (1.059463 ^ (toFloat model.pitchShift)), sustain = note.sustain * (toFloat model.sliderValue / 2) }
            in
                ( { model | index = model.index + 1 }
                , send (PlayBundle shiftedNote "triangle")
                )

        DrawNote index string accidental ->
            let
                stringOffset =
                    noteStringPos string

                fretOffset =
                    noteFretPos index

                finalOffset =
                    fretOffset + stringOffset
            in
                ( { model | notePosition = finalOffset, showAccidental = accidental }, Cmd.none )

        ChangeSliderValue newVal ->
            let
                val =
                    Result.withDefault 1 <| String.toInt newVal
            in
                ( { model | sliderValue = val }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        val =
            toFloat model.sliderValue / 10.0
    in
        if model.index < List.length model.currentChord then
            Time.every (val * Time.second) (always SendNotes)
        else
            Sub.none


mainView : Model -> Html Msg
mainView model =
    div [ style [ ( "position", "relative" ), ( "overflow", "hidden" ) ] ]
        [ nav model
        , modalIcon model
        , page model
        ]


nav : Model -> Html Msg
nav model =
    div [ navMenuStyle model ]
        [ navIcon model
        , div []
            [ hover highlight a [ href Routing.homePath, navItemStyle ] [ text "HOME" ]
            , hover highlight a [ href (Routing.scalesPath model.musKey), navItemStyle ] [ text "SCALES" ]
            , hover highlight a [ href (Routing.chordsPath model.musKey), navItemStyle ] [ text "CHORDS" ]
            , hover highlight a [ href (Routing.fretboardPath model.musKey), navItemStyle ] [ text "FRETBOARD" ]
            , hover highlight a [ href Routing.strumPath, navItemStyle ] [ text "STRUMMING" ]
            , div [ style [ ( "marginTop", "100px" ), ( "color", "#E91750" ) ] ] [ text "SELECT KEY:" ]
            , keyListView model
            ]
        ]


navIcon : Model -> Html Msg
navIcon model =
    div [ navIconStyle model, onClick ShowNavMenu ]
        [ hr [ navIconStyleHr ] []
        , hr [ navIconStyleHr ] []
        , hr [ navIconStyleHr ] []
        ]


keyListView : Model -> Html Msg
keyListView model =
    let
        keyOptions key =
            hover highlight span [ keyListStyle, onClick <| ChangeKey key ] [ text key ]
    in
        div [ keyListContainerStyle ]
            [ div [ textContainerStyle ]
                (List.map keyOptions keyList)
            ]


page : Model -> Html Msg
page model =
    case model.route of
        ChordChartPage key ->
            chordChartPage model

        FretboardPage key ->
            fretboardPage model

        ScalesPage key ->
            scalesPage model

        HomePage ->
            homePage model

        StrumPage ->
            strumPage model

        NotFoundPage ->
            div [ style [ ( "margin", "100px auto" ), ( "color", "#E91750" ) ] ] [ text ("Page Not Found " ++ model.musKey) ]


modalIcon : Model -> Html Msg
modalIcon model =
    div [ modalIconStyle model, onClick ShowModal ] [ text "?" ]
