module Home exposing (homePage)

import Html exposing (..)
import Html.Attributes exposing (..)


homePage model =
    div [ homePageStyle ]
        [ div [ titleStyle ] [ text "MUSIC THEORY BASICS FOR GUITARISTS" ]
        , div [] [ text "THIS SITE WILL HELP TEACH YOU ABOUT SOME OF THE FUNDAMENTALS OF MUSIC THEORY INCLUDING" ]
        , ul []
            [ li [] [ text "Chords" ]
            , li [] [ text "Scales" ]
            , li [] [ text "Notes of the fretboard" ]
            ]
        , span [] [ text "click the " ]
        , navIcon
        , span [] [ text " on the upper right to navigate." ]
        ]



--navIcon : Html Msg


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
        , ( "padding", "50px" )
        ]


titleStyle =
    style
        [ ( "fontSize", "30px" )
        , ( "color", "#fff" )
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
