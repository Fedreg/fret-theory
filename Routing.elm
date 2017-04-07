module Routing exposing (..)

import Navigation exposing (Location)
import Types exposing (Route(..), Msg(NoOp))
import UrlParser exposing (..)


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map ChordChartPage (s "chords" </> string)
        , map ScalesPage (s "scales" </> string)
        , map FretboardPage (s "fretboard")
        ]


parseLocation location =
    case (parseHash matchers location) of
        Just route ->
            route

        Nothing ->
            NotFoundPage


modelUpdateOnHash model location =
    case model.route of
        ChordChartPage key ->
            parseHash (s "chords" </> string) location

        ScalesPage key ->
            parseHash (s "scales" </> string) location

        FretboardPage ->
            parseHash (s "fretboard" </> string) location

        NotFoundPage ->
            parseHash (s "" </> string) location


chordsPath : String -> String
chordsPath key =
    "#chords/" ++ key


scalesPath : String -> String
scalesPath key =
    "#scales/" ++ key


fretboardPath : String
fretboardPath =
    "#fretboard"
