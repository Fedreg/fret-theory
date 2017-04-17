module Routing exposing (..)

import Navigation exposing (Location)
import Types exposing (Route(..), Msg(NoOp))
import UrlParser exposing (..)


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map HomePage (s "home")
        , map ChordChartPage (s "chords" </> string)
        , map ScalesPage (s "scales" </> string)
        , map FretboardPage (s "fretboard" </> string)
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

        FretboardPage key ->
            parseHash (s "fretboard" </> string) location

        HomePage ->
            parseHash (s "home" </> string) location

        NotFoundPage ->
            parseHash (s "" </> string) location


chordsPath : String -> String
chordsPath key =
    "#chords/" ++ key


scalesPath : String -> String
scalesPath key =
    "#scales/" ++ key


fretboardPath : String -> String
fretboardPath key =
    "#fretboard/" ++ key


homePath : String
homePath =
    "#home/"
