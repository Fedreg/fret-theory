module Views.Home exposing (homePage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Views.Chords exposing (chordChartModel)
import Views.Fretboard exposing (..)
import Views.Scales exposing (..)
import Logic.Types exposing (Model, Msg(..))
import Styles.HomeStyles exposing (..)
import Styles.ChordStyles exposing (chartContainerStyle)


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
            , div [ style [ ( "color", "#444" ), ( "margin ", "0 auto" ), ( "textDecoration", "none" ), ( "fontSize", "24px" ) ] ]
                [ span [ style [ ( "paddingRight", "30px" ) ] ] [ text "CHORDS" ]
                , span [ style [ ( "paddingRight", "30px" ) ] ] [ text "SCALES" ]
                , span [ style [ ( "paddingRight", "30px" ) ] ] [ text "NOTES OF THE FRETBOARD" ]
                , span [ style [ ( "paddingRight", "30px" ) ] ] [ text "RHYTHM & STRUMMING" ]
                , span [ style [ ( "paddingRight", "30px" ) ] ] [ text "FINGERPICKING" ]
                ]
            , div []
                [ span [] [ text "Click the " ]
                , span
                    [ style [ ( "fontSize", "20px" ), ( "fontWeight", "700" ), ( "color", "#03a9f4" ) ] ]
                    [ text "i" ]
                , span [] [ text " logo on the upper right to get started. " ]
                ]
            , div [ style [ ( "color", " #777" ) ] ] [ text "Use the menu on the right to select a topic or select a musical key.  Click on any chords or scales to hear how they sound." ]
            ]
        ]
