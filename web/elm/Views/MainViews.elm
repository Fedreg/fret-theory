module Views.MainViews exposing (mainView)

import Html exposing (Html, div, span, hr, text, a, input)
import Html.Attributes exposing (style, href, value, type_, href)
import Html.Events exposing (onClick, onInput)
import Logic.Routing as Routing
import Logic.Types exposing (Model, Msg(..), Route(..), PlayBundle)
import Views.Home exposing (homePage)
import Views.Chords exposing (chordChartPage, keyList)
import Views.Scales exposing (scalesPage)
import Views.Fretboard exposing (fretboardPage)
import Views.Strum exposing (strumPage)
import Views.FingerPick exposing (fingerPickingPage)
import Views.Modal exposing (..)
import Styles.MainStyles exposing (..)
import InlineHover exposing (hover)


mainView : Model -> Html Msg
mainView model =
    div [ style [ ( "position", "relative" ), ( "overflow", "hidden" ), ( "padding", "5px" ) ] ]
        [ nav model
        , page model
        , modal model
        ]


nav : Model -> Html Msg
nav model =
    div [ navMenuStyle model ]
        [ navIcon model
        , modalIcon model
        , div []
            [ hover highlight a [ onClick <| NewUrl Routing.homePath, navItemStyle model.navMenuOpen ] [ text "HOME" ]
            , hover highlight a [ onClick <| NewUrl (Routing.chordsPath model.musKey), navItemStyle model.navMenuOpen ] [ text "CHORDS" ]
            , hover highlight a [ onClick <| NewUrl (Routing.scalesPath model.musKey), navItemStyle model.navMenuOpen ] [ text "SCALES" ]
            , hover highlight a [ onClick <| NewUrl (Routing.fretboardPath model.musKey), navItemStyle model.navMenuOpen ] [ text "FRETBOARD" ]
            , hover highlight a [ onClick <| NewUrl Routing.strumPath, navItemStyle model.navMenuOpen ] [ text "STRUMMING" ]
            , hover highlight a [ onClick <| NewUrl Routing.fingerPickingPath, navItemStyle model.navMenuOpen ] [ text "FINGERPICKING" ]
            , playbackSpeedSlider model
            , div [ navItemStyle model.navMenuOpen, style [ ( "color", "#000" ) ] ] [ text "SELECT KEY:" ]
            , div [ style [ ( "position", "relative" ) ] ] [ keyListView model ]
            , signature
            ]
        ]


navIcon : Model -> Html Msg
navIcon model =
    div [ navIconStyle model, onClick ShowNavMenu ]
        [ hr [ navIconStyleHr model.navMenuOpen ] []
        , hr [ navIconStyleHr model.navMenuOpen ] []
        , hr [ navIconStyleHr model.navMenuOpen ] []
        ]


keyListView : Model -> Html Msg
keyListView model =
    let
        keyOptions key =
            if key == model.musKey then
                span [ keyListStyle model.navMenuOpen, onClick <| ChangeKey key, style [ ( "color", "#03a9f4" ) ] ] [ text key ]
            else
                span [ keyListStyle model.navMenuOpen, onClick <| ChangeKey key, style [ ( "color", "#fff" ) ] ] [ text key ]
    in
        div [ keyListContainerStyle model.navMenuOpen ]
            [ div [ textContainerStyle model.navMenuOpen ]
                (List.map keyOptions keyList)
            ]


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
            div [ style [ ( "margin", "100px auto" ), ( "color", "#03a9f4" ) ] ] [ text ("Page Not Found " ++ model.musKey) ]


playbackSpeedSlider : Model -> Html Msg
playbackSpeedSlider model =
    div [ navItemStyle model.navMenuOpen, style [ ( "marginTop", "25px" ) ] ]
        [ div [] [ text ("+ " ++ "AUDIO SPEED" ++ " -") ]
        , input
            [ type_ "range"
            , Html.Attributes.min "1"
            , Html.Attributes.max "10"
            , value <| toString model.sliderValue
            , onInput ChangeSliderValue
            ]
            []
        ]
