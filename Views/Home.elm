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
        [ div [ titleStyle "50px" "#fff" ] [ text "FRETBOARD THEORY" ]
        , div [ titleStyle "20px" "#E8175D" ] [ text "Applied Music Theory For Guitarists" ]
        , div [ chartContainerStyle "row" ]
            [ chordChartModel model 1 "ii" .ii .ii
            , chordChartModel model 4 "V" .v .v
            , chordChartModel model 0 "I" .i .i
            ]
        , div [ titleStyle "20px" "#fff" ] [ text "This site provides an interactive experience to help guitarists get a basic understanding of important music theory concepts such as" ]
        , div [ style [ ( "color", "#E8175D" ), ( "margin ", "0 auto" ), ( "textDecoration", "none" ), ( "display", "flex" ), ( "justifyContent", "center" ) ] ]
            [ span [ style [ ( "paddingRight", "20px" ) ] ] [ text "CHORDS" ]
            , span [ style [ ( "paddingRight", "20px" ) ] ] [ text "SCALES" ]
            , span [ style [ ( "paddingRight", "20px" ) ] ] [ text "NOTES OF THE FRETBOARD" ]
            , span [ style [ ( "paddingRight", "20px" ) ] ] [ text "RHYTHM & STRUMMING" ]
            ]
        , div []
            [ span [] [ text "Click the " ]
            , span [ style [ ( "border", "1px solid #5CE6CD" ), ( "borderRadius", "10px" ), ( "padding", "0 5px" ), ( "fontSize", "14px" ), ( "color", "#5CE6CD" ) ] ] [ text "?" ]
            , span [] [ text " logo on each page to read important concepts. " ]
            ]
        , div [ style [ ( "color", " #fff" ) ] ] [ text "Use the menu on the right to select a topic or select a musical key.  Click on any chords or scales to hear how they sound." ]
        ]
