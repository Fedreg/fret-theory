module Views.Scales exposing (scalesPage)

import Html exposing (Html, div, span, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Logic.Types exposing (ScaleData, ScaleSchemaData, Msg(Play, ShowModal), Model)
import Views.Chords exposing (keyList, playbackSpeedSlider)
import List.Extra exposing (getAt, elemIndex)
import Logic.Audio exposing (scales)
import Styles.ScalesStyles exposing (..)


scalesPage : Model -> Html Msg
scalesPage model =
    div []
        [ playbackSpeedSlider "SCALE PLAYBACK SPEED" model
        , div [ scalePageStyle ]
            [ ionianModeView model
            , aeolianModeView model
            , majorPentatonicView model
            , minorPentatonicView model
            , lydianModeView model
            , mixolydianModeView model
            , dorianModeView model
            , scalesModal model
            ]
        ]


ionianModeView : Model -> Html Msg
ionianModeView model =
    let
        data accessor =
            scaleStringSchema (fretOffset model) model.musKey ionianMode |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "18px" ) ] ] [ text (toString a) ]
    in
        div [ scaleContainerStyle, onClick (Play (scales "major") (fretOffset model)) ]
            [ div [ scaleTitleStyle ] [ scaleNameMajor model " MAJOR SCALE " "" "" ]
            , stringView
            , div [ fretNumberStyle "490px" ] (List.map markup <| data .one)
            , div [ fretNumberStyle "420px" ] (List.map markup <| data .two)
            , div [ fretNumberStyle "320px" ] (List.map markup <| data .three)
            , div [ fretNumberStyle "220px" ] (List.map markup <| data .four)
            , div [ fretNumberStyle "120px" ] (List.map markup <| data .five)
            , div [ fretNumberStyle "50px" ] (List.map markup <| data .six)
            ]


aeolianModeView : Model -> Html Msg
aeolianModeView model =
    let
        computedOffset =
            if fretOffset model - 3 < -8 then
                fretOffset model + 9
            else
                fretOffset model - 3

        data accessor =
            scaleStringSchema computedOffset model.musKey aeolianMode |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "18px" ) ] ] [ text (toString a) ]
    in
        div [ scaleContainerStyle, onClick (Play (scales "minor") (fretOffset model)) ]
            [ div [ scaleTitleStyle ] [ scaleNameMinor model " MINOR SCALE " ]
            , stringView
            , div [ fretNumberStyle "460px" ] (List.map markup <| data .one)
            , div [ fretNumberStyle "380px" ] (List.map markup <| data .two)
            , div [ fretNumberStyle "320px" ] (List.map markup <| data .three)
            , div [ fretNumberStyle "240px" ] (List.map markup <| data .four)
            , div [ fretNumberStyle "150px" ] (List.map markup <| data .five)
            , div [ fretNumberStyle "50px" ] (List.map markup <| data .six)
            ]


majorPentatonicView : Model -> Html Msg
majorPentatonicView model =
    let
        data accessor =
            scaleStringSchema (fretOffset model) model.musKey majorPentatonicMode |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "18px" ) ] ] [ text (toString a) ]
    in
        div [ scaleContainerStyle, onClick (Play (scales "majPentatonic") (fretOffset model)) ]
            [ div [ scaleTitleStyle ] [ scaleNameMajor model " MAJOR PENTATONIC SCALE " "" "" ]
            , stringView
            , div [ fretNumberStyle "450px" ] (List.map markup <| data .one)
            , div [ fretNumberStyle "370px" ] (List.map markup <| data .two)
            , div [ fretNumberStyle "290px" ] (List.map markup <| data .three)
            , div [ fretNumberStyle "210px" ] (List.map markup <| data .four)
            , div [ fretNumberStyle "130px" ] (List.map markup <| data .five)
            , div [ fretNumberStyle "50px" ] (List.map markup <| data .six)
            ]


minorPentatonicView : Model -> Html Msg
minorPentatonicView model =
    let
        computedOffset =
            if fretOffset model - 3 < -8 then
                fretOffset model + 9
            else
                fretOffset model - 3

        data accessor =
            scaleStringSchema computedOffset model.musKey minorPentatonicMode |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "18px" ) ] ] [ text (toString a) ]
    in
        div [ scaleContainerStyle, onClick (Play (scales "minPentatonic") (fretOffset model)) ]
            [ div [ scaleTitleStyle ] [ scaleNameMinor model " MINOR PENTATONIC SCALE " ]
            , stringView
            , div [ fretNumberStyle "450px" ] (List.map markup <| data .one)
            , div [ fretNumberStyle "370px" ] (List.map markup <| data .two)
            , div [ fretNumberStyle "290px" ] (List.map markup <| data .three)
            , div [ fretNumberStyle "210px" ] (List.map markup <| data .four)
            , div [ fretNumberStyle "130px" ] (List.map markup <| data .five)
            , div [ fretNumberStyle "50px" ] (List.map markup <| data .six)
            ]


lydianModeView : Model -> Html Msg
lydianModeView model =
    let
        data accessor =
            scaleStringSchema (fretOffset model) model.musKey lydianMode |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "18px" ) ] ] [ text (toString a) ]
    in
        div [ scaleContainerStyle, onClick (Play (scales "lydian") (fretOffset model)) ]
            [ div [ scaleTitleStyle ] [ scaleNameMajor model " LYDIAN MODE " " ( #4 ) " "Maj7" ]
            , stringView
            , div [ fretNumberStyle "490px" ] (List.map markup <| data .one)
            , div [ fretNumberStyle "390px" ] (List.map markup <| data .two)
            , div [ fretNumberStyle "320px" ] (List.map markup <| data .three)
            , div [ fretNumberStyle "220px" ] (List.map markup <| data .four)
            , div [ fretNumberStyle "120px" ] (List.map markup <| data .five)
            , div [ fretNumberStyle "50px" ] (List.map markup <| data .six)
            ]


mixolydianModeView : Model -> Html Msg
mixolydianModeView model =
    let
        data accessor =
            scaleStringSchema (fretOffset model) model.musKey mixolydianMode |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "18px" ) ] ] [ text (toString a) ]
    in
        div [ scaleContainerStyle, onClick (Play (scales "mixolydian") (fretOffset model)) ]
            [ div [ scaleTitleStyle ] [ scaleNameMajor model " MIXOLYDIAN MODE " " ( b7 ) " "7" ]
            , stringView
            , div [ fretNumberStyle "490px" ] (List.map markup <| data .one)
            , div [ fretNumberStyle "390px" ] (List.map markup <| data .two)
            , div [ fretNumberStyle "320px" ] (List.map markup <| data .three)
            , div [ fretNumberStyle "220px" ] (List.map markup <| data .four)
            , div [ fretNumberStyle "120px" ] (List.map markup <| data .five)
            , div [ fretNumberStyle "50px" ] (List.map markup <| data .six)
            ]


dorianModeView : Model -> Html Msg
dorianModeView model =
    let
        data accessor =
            scaleStringSchema (fretOffset model) model.musKey dorianMode |> accessor

        markup a =
            span [ style [ ( "paddingRight", "10px" ), ( "fontSize", "18px" ) ] ] [ text (toString a) ]
    in
        div [ scaleContainerStyle, onClick (Play (scales "dorian") (fretOffset model)) ]
            [ div [ scaleTitleStyle ] [ scaleNameMajor model " DORIAN MODE " " ( b3, b7 ) " "min7" ]
            , stringView
            , div [ fretNumberStyle "500px" ] (List.map markup <| data .one)
            , div [ fretNumberStyle "410px" ] (List.map markup <| data .two)
            , div [ fretNumberStyle "310px" ] (List.map markup <| data .three)
            , div [ fretNumberStyle "210px" ] (List.map markup <| data .four)
            , div [ fretNumberStyle "140px" ] (List.map markup <| data .five)
            , div [ fretNumberStyle "40px" ] (List.map markup <| data .six)
            ]


stringView : Html Msg
stringView =
    div [ stringContainerStyle ]
        [ div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        , div [ stringStyle ] []
        ]


{-| Basic layout for notes per string.
-}
scaleStringSchema : Int -> String -> ScaleData -> ScaleSchemaData
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


{-| Shifts scale schema numbers up or down depending on key.
-}
fretOffset : Model -> Int
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


scaleNameMajor : Model -> String -> String -> String -> Html Msg
scaleNameMajor model scaleName modifiedNotes matchingChord =
    let
        index =
            Maybe.withDefault 0 <| elemIndex model.musKey keyList

        slicer =
            String.slice 0 1

        playOver =
            " play over " ++ model.musKey ++ matchingChord
    in
        if slicer (String.toUpper model.musKey) == slicer model.musKey then
            div []
                [ span [] [ text model.musKey ]
                , span [ style [ ( "color", "#777" ) ] ] [ text scaleName ]
                , span [ style [ ( "color", "#5CE6CD" ) ] ] [ text modifiedNotes ]
                , span [ style [ ( "color", "#000" ) ] ] [ text playOver ]
                ]
        else
            div []
                [ span [] [ text (Maybe.withDefault "C" <| getAt (index - 12) keyList) ]
                , span [ style [ ( "color", "#777" ) ] ] [ text scaleName ]
                , span [ style [ ( "color", "#5CE6CD" ) ] ] [ text modifiedNotes ]
                , span [ style [ ( "color", "#000" ) ] ] [ text ", relative major" ]
                ]


scaleNameMinor : Model -> String -> Html Msg
scaleNameMinor model scaleName =
    let
        index =
            Maybe.withDefault 0 <| elemIndex model.musKey keyList

        slicer =
            String.slice 0 1

        playOver =
            "play over " ++ String.toUpper model.musKey ++ "min"
    in
        if slicer (String.toLower model.musKey) == slicer model.musKey then
            div []
                [ span [] [ text (String.toUpper (slicer model.musKey) ++ String.slice 1 2 model.musKey) ]
                , span [ style [ ( "color", "#777" ) ] ] [ text (" " ++ scaleName) ]
                , span [ style [ ( "color", "#000" ) ] ] [ text playOver ]
                ]
        else
            div []
                [ span [] [ text (String.toUpper (Maybe.withDefault "a" <| getAt (index + 12) keyList)) ]
                , span [ style [ ( "color", "#777" ) ] ] [ text scaleName ]
                , span [ style [ ( "color", "#000" ) ] ] [ text (" , relative minor") ]
                ]


scalesModal : Model -> Html Msg
scalesModal model =
    div [ scaleModalStyle model ]
        [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
        , div [] [ text ("Scale Page. Instructions Coming Soon! Key: " ++ model.musKey) ]
        ]


{-| Layout of scales in frets per string.
-}
ionianMode : ScaleData
ionianMode =
    { e = [ 7, 8, 10 ]
    , b = [ 8, 10 ]
    , g = [ 7, 9, 10 ]
    , d = [ 7, 9, 10 ]
    , a = [ 7, 8, 10 ]
    , e6 = [ 8, 10 ]
    }


aeolianMode : ScaleData
aeolianMode =
    { e = [ 8, 10, 11 ]
    , b = [ 8, 9, 11 ]
    , g = [ 8, 10 ]
    , d = [ 8, 10, 12 ]
    , a = [ 8, 10, 11 ]
    , e6 = [ 8, 10, 11 ]
    }


majorPentatonicMode : ScaleData
majorPentatonicMode =
    { e = [ 8, 10 ]
    , b = [ 8, 10 ]
    , g = [ 7, 10 ]
    , d = [ 7, 10 ]
    , a = [ 7, 10 ]
    , e6 = [ 8, 10 ]
    }


minorPentatonicMode : ScaleData
minorPentatonicMode =
    { e = [ 8, 11 ]
    , b = [ 8, 11 ]
    , g = [ 8, 10 ]
    , d = [ 8, 10 ]
    , a = [ 8, 10 ]
    , e6 = [ 8, 11 ]
    }


lydianMode : ScaleData
lydianMode =
    { e = [ 7, 8, 10 ]
    , b = [ 7, 8, 10 ]
    , g = [ 7, 9 ]
    , d = [ 7, 9, 10 ]
    , a = [ 7, 9, 10 ]
    , e6 = [ 8, 10 ]
    }


mixolydianMode : ScaleData
mixolydianMode =
    { e = [ 8, 10 ]
    , b = [ 8, 10, 11 ]
    , g = [ 7, 9, 10 ]
    , d = [ 7, 8, 10 ]
    , a = [ 7, 8, 10 ]
    , e6 = [ 8, 10 ]
    }


dorianMode : ScaleData
dorianMode =
    { e = [ 8, 10, 11 ]
    , b = [ 8, 10, 11 ]
    , g = [ 7, 8, 10 ]
    , d = [ 7, 8, 10 ]
    , a = [ 8, 10 ]
    , e6 = [ 8, 10, 11 ]
    }
