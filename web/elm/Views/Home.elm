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
        [ div [ titleStyle "70px" "#fff" ] [ text "FRETBOARD THEORY" ]
        , div [ secondaryTitleStyle "20px" "#888" ] [ text "Applied Music Theory For Guitarists" ]
        , div [ chartContainerStyle "row" ]
            [ chordChartModel model 1 "ii" .ii .ii
            , chordChartModel model 4 "V" .v .v
            , chordChartModel model 0 "I" .i .i
            ]
        , div [ secondaryTitleStyle "" "" ]
            [ div [] [ text "This site provides an interactive experience to help guitarists get a basic understanding of important music theory concepts such as" ]
            , div [ style [ ( "color", "#aaa" ), ( "margin ", "0 auto" ), ( "textDecoration", "none" ), ( "display", "flex" ), ( "justifyContent", "center" ), ( "fontSize", "25px" ) ] ]
                [ span [ style [ ( "paddingRight", "30px" ) ] ] [ text "CHORDS" ]
                , span [ style [ ( "paddingRight", "30px" ) ] ] [ text "SCALES" ]
                , span [ style [ ( "paddingRight", "30px" ) ] ] [ text "NOTES OF THE FRETBOARD" ]
                , span [ style [ ( "paddingRight", "30px" ) ] ] [ text "RHYTHM & STRUMMING" ]
                ]
            , div []
                [ span [] [ text "Click the " ]
                , span [ style [ ( "border", "1px solid #E8175D" ), ( "borderRadius", "10px" ), ( "padding", "0 5px" ), ( "fontSize", "14px" ), ( "color", "#FFF" ) ] ] [ text "?" ]
                , span [] [ text " logo on the upper right to get started. " ]
                ]
            , div [ style [ ( "color", " #777" ) ] ] [ text "Use the menu on the right to select a topic or select a musical key.  Click on any chords or scales to hear how they sound." ]
            ]
        ]
