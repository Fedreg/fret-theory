module Views.MainViews exposing (mainView)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import String exposing (..)
import Logic.Routing as Routing
import Logic.Types exposing (Model, Msg(..), Route(..), PlayBundle)
import Logic.Audio exposing (noteSorter)
import Views.Home exposing (homePage)
import Views.Chords exposing (chordChartPage, keyList)
import Views.Scales exposing (scalesPage)
import Views.Fretboard exposing (fretboardPage, noteStringPos, noteFretPos)
import Views.Strum exposing (strumPage)
import Styles.MainStyles exposing (..)
import InlineHover exposing (hover)


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


modalIcon : Model -> Html Msg
modalIcon model =
    div [ modalIconStyle model, onClick ShowModal ] [ text "?" ]


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
