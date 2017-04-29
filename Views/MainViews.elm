module Views.MainViews exposing (mainView)

import Html exposing (Html, div, span, hr, text, a)
import Html.Attributes exposing (style, href)
import Html.Events exposing (onClick)
import Logic.Routing as Routing
import Logic.Types exposing (Model, Msg(..), Route(..), PlayBundle)
import Views.Home exposing (homePage)
import Views.Chords exposing (chordChartPage, keyList)
import Views.Scales exposing (scalesPage)
import Views.Fretboard exposing (fretboardPage)
import Views.Strum exposing (strumPage)
import Views.FingerPick exposing (fingerPickingPage)
import Styles.MainStyles exposing (..)
import InlineHover exposing (hover)


mainView : Model -> Html Msg
mainView model =
    div [ style [ ( "position", "relative" ), ( "overflow", "hidden" ), ( "padding", "5px" ) ] ]
        [ nav model
        , page model
        ]


nav : Model -> Html Msg
nav model =
    div [ navMenuStyle model ]
        [ navIcon model
        , modalIcon model
        , div []
            [ hover highlight a [ href Routing.homePath, navItemStyle ] [ text "HOME" ]
            , hover highlight a [ href (Routing.scalesPath model.musKey), navItemStyle ] [ text "SCALES" ]
            , hover highlight a [ href (Routing.chordsPath model.musKey), navItemStyle ] [ text "CHORDS" ]
            , hover highlight a [ href (Routing.fretboardPath model.musKey), navItemStyle ] [ text "FRETBOARD" ]
            , hover highlight a [ href Routing.strumPath, navItemStyle ] [ text "STRUMMING" ]
            , hover highlight a [ href Routing.fingerPickingPath, navItemStyle ] [ text "FINGERPICKING" ]
            , div [ navItemStyle, style [ ( "marginTop", "100px" ), ( "color", "#E91750" ) ] ] [ text "SELECT KEY:" ]
            , div [ style [ ( "position", "relative" ) ] ] [ keyListView model ]
            , signature
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
            hover highlight span [ keyListStyle model.navMenuOpen, onClick <| ChangeKey key ] [ text key ]
    in
        div [ keyListContainerStyle model.navMenuOpen ]
            [ div [ textContainerStyle model.navMenuOpen ]
                (List.map keyOptions keyList)
            ]


modalIcon : Model -> Html Msg
modalIcon model =
    div [ modalIconStyle model, onClick ShowModal ] [ text "?" ]


signature : Html Msg
signature =
    div [ signatureStyle ]
        [ hover highlight a [ href "https://www.github.com/fedreg", style [ ( "color", "#000" ) ] ] [ text "Built 2017 by FedReg (v. 0.1)" ] ]


page : Model -> Html Msg
page model =
    case model.route of
        ChordChartPage _ ->
            chordChartPage model

        FretboardPage _ ->
            fretboardPage model

        ScalesPage _ ->
            scalesPage model

        HomePage ->
            homePage model

        StrumPage ->
            strumPage model

        FingerPickingPage ->
            fingerPickingPage model

        NotFoundPage ->
            div [ style [ ( "margin", "100px auto" ), ( "color", "#E91750" ) ] ] [ text ("Page Not Found " ++ model.musKey) ]
