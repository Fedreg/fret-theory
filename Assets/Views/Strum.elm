module Assets.Views.Strum exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Assets.Logic.Types exposing (Model, Msg(Randomize, ShowModal))
import Assets.Styles.StrumStyles exposing (..)


strumPage : Model -> Html Msg
strumPage model =
    let
        beats a =
            div [ style [ ( "margin", "0 55px" ) ] ] [ text <| toString a ]

        arrows a b =
            div [ strumArrowStyle a b ] [ arrow ]
    in
        div [ strumPageStyle ]
            [ div [ style [ ( "display", "flex" ) ] ]
                (List.map2 arrows model.strumArrow [ 1, 2, 1, 2, 1, 2, 1, 2 ])
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map beats <| List.range 1 8)
            , button [ buttonStyle, onClick Randomize ] [ text "Generate Random Strum Pattern" ]
            , strumModal model
            ]


{-| The up / down arrow itself.  Made up of a rotated div and a hr.
-}
arrow : Html Msg
arrow =
    let
        baseStyles height width x y =
            style
                [ ( "transform", "rotate(45deg)" )
                , ( "width", width )
                , ( "height", height )
                , ( "borderTop", "9px solid #fff" )
                , ( "borderLeft", "9px solid #fff" )
                , ( "marginTop", "50px" )
                , ( "marginLeft", x )
                , ( "marginTop", y )
                ]
    in
        div [ baseStyles "50px" "50px" "0" "0" ]
            [ hr [ baseStyles "1px" "100px" "-20px" "25px" ] [] ]


strumModal : Model -> Html Msg
strumModal model =
    div [ strumModalStyle model ]
        [ div [ closeModalIcon, onClick ShowModal ] [ text "close" ]
        , div [] [ text ("Strum Page. Instructions Coming Soon!") ]
        ]
