module Fretboard exposing (fretboardPage)

import Html exposing (..)
import Html.Attributes exposing (..)
import List exposing (map)


fretboardPage model =
    let
        frets note =
            div [ style [ ( "padding", "20px" ) ] ] [ text note ]
    in
        div [ style [ ( "margin", "50px auto" ) ] ]
            [ div [ style [ ( "display", "flex" ) ] ]
                (List.map frets <| List.reverse stringE)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets <| List.reverse stringA)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets <| List.reverse stringD)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets <| List.reverse stringG)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets <| List.reverse stringB)
            , div [ style [ ( "display", "flex" ) ] ]
                (List.map frets <| List.reverse stringe)
            ]


stringE =
    [ "e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e" ]


stringA =
    [ "a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a" ]


stringD =
    [ "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d" ]


stringG =
    [ "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g" ]


stringB =
    [ "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b" ]


stringe =
    [ "e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e" ]
