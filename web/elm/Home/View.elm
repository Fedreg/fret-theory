module Home.View exposing (homePage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Chords.View exposing (chordChartModel)


-- import Fretboard.View exposing (..)
-- import Views.Scales exposing (..)

import Logic.Types exposing (Model, Msg(..))
import Home.Styles exposing (..)
import Chords.Styles exposing (chartContainerStyle)


homePage : Model -> Html Msg
homePage model =
    div [ homePageStyle ]
        [ div [ titleStyle "30px" "#444" ] [ text "Applied Music Theory For Guitarists" ]
        , div [ chartContainerStyle "row" ]
            [ chordChartModel model 1 "ii" .ii .ii
            , chordChartModel model 4 "V" .v .v
            , chordChartModel model 0 "I" .i .i
            ]
        , div [ secondaryTitleStyle "" "" ]
            [ div [] [ text "This site provides an interactive experience to help guitarists get a basic understanding of important music theory concepts such as" ]
            , div [ homePageTextListStyle ]
                [ span [ homePageTextListItemStyle ] [ text "CHORDS" ]
                , span [ homePageTextListItemStyle ] [ text "SCALES" ]
                , span [ homePageTextListItemStyle ] [ text "NOTES OF THE FRETBOARD" ]
                , span [ homePageTextListItemStyle ] [ text "RHYTHM & STRUMMING" ]
                , span [ homePageTextListItemStyle ] [ text "FINGERPICKING" ]
                ]
            , div []
                [ span [] [ text "Click the " ]
                , span [ homePageModalIconStyle ] [ text "i" ]
                , span [] [ text " logo on the upper right to get started. " ]
                ]
            , div [ style [ ( "color", " #777" ) ] ] [ text "Use the menu on the right to select a topic or select a musical key.  Click on any chords or scales to hear how they sound." ]
            ]
        ]
