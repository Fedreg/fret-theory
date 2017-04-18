module Home exposing (homePage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Chords exposing (chordChartModel, chartContainerStyle)
import Fretboard exposing (..)
import Scales exposing (..)


homePage model =
    div [ homePageStyle ]
        [ div [ titleStyle "50px" "#fff" ] [ text "FRETBOARD THEORY" ]
        , div [ titleStyle "20px" "#E8175D" ] [ text "Basic Music Theory For Guitarists" ]
        , div [ chartContainerStyle "row" ]
            [ Chords.chordChartModel model 1 "ii" .ii .ii
            , Chords.chordChartModel model 4 "V" .v .v
            , Chords.chordChartModel model 0 "I" .i .i
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



-- STYLES


homePageStyle =
    style
        [ ( "textAlign", "center" )
        , ( "backgroundColor", "#000" )
        , ( "paddingTop", "80px" )
        ]


titleStyle fontSize color =
    style
        [ ( "margin", "0 auto" )
        , ( "fontSize", fontSize )
        , ( "color", color )
        , ( "zIndex", "50" )
        ]
