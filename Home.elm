module Home exposing (homePage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Chords exposing (chordChartModel)
import Fretboard exposing (..)
import Scales exposing (..)


homePage model =
    div [ homePageStyle ]
        [ div [ headerImg2Style ] []
        , div [ headerImgStyle ] []
        , div [ titleStyle "50px" "#fff" ] [ text "Music Theory Basics" ]
        , div [ titleStyle "30px" "#bbb" ] [ text "For Guitarists" ]
        , div [] [ text "THIS SITE WILL HELP TEACH YOU ABOUT SOME OF THE FUNDAMENTALS OF MUSIC THEORY INCLUDING" ]
        , ul []
            [ li [] [ text "Chords" ]
            , li [] [ text "Scales" ]
            , li [] [ text "Notes of the fretboard" ]
            ]
        , span [] [ text "click the " ]
        , navIcon
        , span [] [ text " on the upper right to navigate." ]
        , div [ style [ ( "margin", "0 auto" ), ( "display", "flex" ), ( "justifyContent", "center" ), ( "width", "800px" ) ] ]
            [ Chords.chordChartModel model 0 "I" .i .i
            , fretNotation model
            ]
        ]


navIcon =
    div [ navIconStyle ]
        [ hr [ navIconStyleHr ] []
        , hr [ navIconStyleHr ] []
        , hr [ navIconStyleHr ] []
        ]



-- STYLES


homePageStyle =
    style
        [ ( "textAlign", "center" )
        , ( "backgroundColor", "#000" )
        ]


titleStyle fontSize color =
    style
        [ ( "margin", "-220px auto 220px" )
        , ( "fontSize", fontSize )
        , ( "color", color )
        , ( "zIndex", "50" )
        ]


headerImgStyle =
    style
        [ ( "height", "350px" )
        , ( "width", "100vw" )
        , ( "background", "url(Public/GuitarHeader2.jpg) center center" )
        , ( "backgroundSize", "cover" )
        , ( "opacity", "0.25" )
        , ( "zIndex", "1" )
        , ( "borderBottom", "1px solid #fff" )
        ]


headerImg2Style =
    style
        [ ( "position", "absolute" )
        , ( "top", "0" )
        , ( "height", "350px" )
        , ( "width", "100vw" )
        , ( "background", "url(Public/GuitarHeader.jpg) center center" )
        , ( "backgroundSize", "cover" )
        , ( "opacity", "0.1" )
        , ( "zIndex", "0" )
        ]


navIconStyle =
    style
        [ ( "width", "25px" )
        ]


navIconStyleHr =
    style
        [ ( "borderTop", "1px solid #E91750" )
        , ( "margin", "0 0 5px" )
        ]
