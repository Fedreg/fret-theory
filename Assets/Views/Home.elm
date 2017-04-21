module Assets.Views.Home exposing (homePage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Assets.Views.Chords exposing (chordChartModel)
import Assets.Views.Fretboard exposing (..)
import Assets.Views.Scales exposing (..)
import Assets.Logic.Types exposing (Model, Msg(..))
import Assets.Styles.HomeStyles exposing (..)
import Assets.Styles.ChordStyles exposing (chartContainerStyle)


homePage : Model -> Html Msg
homePage model =
    div [ homePageStyle ]
        [ div [ titleStyle "50px" "#fff" ] [ text "FRETBOARD THEORY" ]
        , div [ titleStyle "20px" "#E8175D" ] [ text "Basic Music Theory For Guitarists" ]
        , div [ chartContainerStyle "row" ]
            [ chordChartModel model 1 "ii" .ii .ii
            , chordChartModel model 4 "V" .v .v
            , chordChartModel model 0 "I" .i .i
            ]
        , div [] [ text "THIS SITE WILL HELP TEACH YOU ABOUT SOME OF THE FUNDAMENTALS OF MUSIC THEORY INCLUDING" ]
        , ul []
            [ li [] [ text "Chords" ]
            , li [] [ text "Scales" ]
            , li [] [ text "Notes of the fretboard" ]
            ]
        , div [] [ text "Instructions and theory coming soon!!!" ]
        , div [] [ text "Use the menu on the right to navigate and select your key.  Click on the chord or scale to hear audio." ]
        ]
