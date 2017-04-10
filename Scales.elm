module Scales exposing (scalesPage)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)
import List exposing (map)
import Types exposing (ScaleData, Msg(ChangeKey))
import Chords exposing (keyList)


scalesPage model =
    let
        keyOptions key =
            option [ value key ] [ text key ]
    in
        div [ style [ ( "display", "flex" ), ( "flexDirection", "column" ), ( "alignItems", "center" ) ] ]
            [ select [ style [ ( "color", "#fff" ), ( "width", "200px" ), ( "marginTop", "25px" ), ( "borderColor", "#ddd" ) ], Html.Events.onInput ChangeKey ]
                (List.map keyOptions Chords.keyList)
            , ionianModeView model
            , aeolianModeView model
            , lydianModeView model
            , mixolydianModeView model
            , dorianModeView model
            ]


ionianModeView model =
    let
        data accessor =
            (scaleStringSchema (fretOffset model) model.musKey ionianMode) |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "24px" ) ] ] [ text (toString a) ]
    in
        div [ style [ ( "position", "relative" ), ( "margin", "0 auto" ) ] ]
            [ h6 [] [ text "MAJOR SCALE" ]
            , stringView
            , div [ style [ ( "margin", "5px 480px" ) ] ] (List.map markup <| data .one)
            , div [ style [ ( "margin", "5px 400px" ) ] ] (List.map markup <| data .two)
            , div [ style [ ( "margin", "5px 300px" ) ] ] (List.map markup <| data .three)
            , div [ style [ ( "margin", "5px 200px" ) ] ] (List.map markup <| data .four)
            , div [ style [ ( "margin", "5px 100px" ) ] ] (List.map markup <| data .five)
            , div [ style [ ( "margin", "5px 20px" ) ] ] (List.map markup <| data .six)
            ]


aeolianModeView model =
    let
        computedOffset =
            if (fretOffset model) < 0 then
                (fretOffset model) + 12
            else
                (fretOffset model)

        data accessor =
            (scaleStringSchema computedOffset model.musKey aeolianMode) |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "24px" ) ] ] [ text (toString a) ]
    in
        div [ style [ ( "position", "relative" ), ( "margin", "0 auto" ) ] ]
            [ h6 [] [ text "MINOR SCALE" ]
            , stringView
            , div [ style [ ( "margin", "5px 420px" ) ] ] (List.map markup <| data .one)
            , div [ style [ ( "margin", "5px 340px" ) ] ] (List.map markup <| data .two)
            , div [ style [ ( "margin", "5px 260px" ) ] ] (List.map markup <| data .three)
            , div [ style [ ( "margin", "5px 180px" ) ] ] (List.map markup <| data .four)
            , div [ style [ ( "margin", "5px 100px" ) ] ] (List.map markup <| data .five)
            , div [ style [ ( "margin", "5px 20px" ) ] ] (List.map markup <| data .six)
            ]


lydianModeView model =
    let
        data accessor =
            (scaleStringSchema (fretOffset model) model.musKey lydianMode) |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "24px" ) ] ] [ text (toString a) ]
    in
        div [ style [ ( "position", "relative" ), ( "margin", "0 auto" ) ] ]
            [ h6 [] [ text "LYDIAN MODE" ]
            , stringView
            , div [ style [ ( "margin", "5px 420px" ) ] ] (List.map markup <| data .one)
            , div [ style [ ( "margin", "5px 340px" ) ] ] (List.map markup <| data .two)
            , div [ style [ ( "margin", "5px 260px" ) ] ] (List.map markup <| data .three)
            , div [ style [ ( "margin", "5px 180px" ) ] ] (List.map markup <| data .four)
            , div [ style [ ( "margin", "5px 100px" ) ] ] (List.map markup <| data .five)
            , div [ style [ ( "margin", "5px 20px" ) ] ] (List.map markup <| data .six)
            ]


mixolydianModeView model =
    let
        data accessor =
            (scaleStringSchema (fretOffset model) model.musKey mixolydianMode) |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "24px" ) ] ] [ text (toString a) ]
    in
        div [ style [ ( "position", "relative" ), ( "margin", "0 auto" ) ] ]
            [ h6 [] [ text "MIXOLYDIAN MODE" ]
            , stringView
            , div [ style [ ( "margin", "5px 420px" ) ] ] (List.map markup <| data .one)
            , div [ style [ ( "margin", "5px 340px" ) ] ] (List.map markup <| data .two)
            , div [ style [ ( "margin", "5px 260px" ) ] ] (List.map markup <| data .three)
            , div [ style [ ( "margin", "5px 180px" ) ] ] (List.map markup <| data .four)
            , div [ style [ ( "margin", "5px 100px" ) ] ] (List.map markup <| data .five)
            , div [ style [ ( "margin", "5px 20px" ) ] ] (List.map markup <| data .six)
            ]


dorianModeView model =
    let
        data accessor =
            (scaleStringSchema (fretOffset model) model.musKey dorianMode) |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "24px" ) ] ] [ text (toString a) ]
    in
        div [ style [ ( "position", "relative" ), ( "margin", "0 auto" ) ] ]
            [ h6 [] [ text "DORIAN MODE" ]
            , stringView
            , div [ style [ ( "margin", "5px 420px" ) ] ] (List.map markup <| data .one)
            , div [ style [ ( "margin", "5px 340px" ) ] ] (List.map markup <| data .two)
            , div [ style [ ( "margin", "5px 260px" ) ] ] (List.map markup <| data .three)
            , div [ style [ ( "margin", "5px 180px" ) ] ] (List.map markup <| data .four)
            , div [ style [ ( "margin", "5px 100px" ) ] ] (List.map markup <| data .five)
            , div [ style [ ( "margin", "5px 20px" ) ] ] (List.map markup <| data .six)
            ]


stringView =
    div [ stringContainerStyle ]
        [ div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        ]



{- Basic layout for notes per string. -}


scaleStringSchema offset key scale =
    let
        mapper =
            List.map (\a -> a + offset)
    in
        { one = mapper scale.e
        , two = mapper scale.b
        , three = mapper scale.g
        , four = mapper scale.d
        , five = mapper scale.a
        , six = mapper scale.e6
        }



{- Shifts scale schema numbers up or down depending on key. -}


fretOffset model =
    case model.musKey of
        "C" ->
            0

        "G" ->
            -5

        "D" ->
            2

        "A" ->
            -3

        "E" ->
            4

        "B" ->
            -1

        "F#" ->
            -6

        "Db" ->
            1

        "Ab" ->
            -4

        "Eb" ->
            3

        "Bb" ->
            -2

        "F" ->
            -7

        "a" ->
            0

        "e" ->
            -5

        "b" ->
            2

        "f#" ->
            -3

        "c#" ->
            4

        "g#" ->
            -1

        "d#" ->
            6

        "a#" ->
            1

        "f" ->
            -4

        "c" ->
            3

        "g" ->
            -2

        "d" ->
            5

        _ ->
            0



-- Layout of scales in frets per string.


ionianMode =
    { e = [ 7, 8, 10 ]
    , b = [ 8, 10 ]
    , g = [ 7, 9, 10 ]
    , d = [ 7, 9, 10 ]
    , a = [ 7, 8, 10 ]
    , e6 = [ 8, 10 ]
    }


aeolianMode =
    { e = [ 5, 7, 8 ]
    , b = [ 5, 6, 8 ]
    , g = [ 4, 5, 7 ]
    , d = [ 5, 7 ]
    , a = [ 5, 7, 8 ]
    , e6 = [ 5, 7, 8 ]
    }


lydianMode =
    { e = [ 7, 8 ]
    , b = [ 7, 8, 10 ]
    , g = [ 7, 9 ]
    , d = [ 7, 9, 10 ]
    , a = [ 7, 9, 10 ]
    , e6 = [ 8, 10 ]
    }


mixolydianMode =
    { e = [ 8, 10 ]
    , b = [ 8, 10, 11 ]
    , g = [ 7, 9, 10 ]
    , d = [ 7, 8, 10 ]
    , a = [ 7, 8, 10 ]
    , e6 = [ 8, 10 ]
    }


dorianMode =
    { e = [ 8, 10, 11 ]
    , b = [ 8, 10, 11 ]
    , g = [ 7, 8, 10 ]
    , d = [ 7, 8, 10 ]
    , a = [ 8, 10 ]
    , e6 = [ 8, 10, 11 ]
    }



-- STYLES


stringStyle =
    style
        [ ( "width", "800px" )
        , ( "borderBottom", "1px solid #777" )
        , ( "marginTop", "42px" )
        ]


stringContainerStyle =
    style
        [ ( "position", "absolute" )
        , ( "top", "20px" )
        , ( "left", "0" )
        ]
