module Routing exposing (..)

import Navigation exposing (Location)
import Types exposing (Route(..))
import UrlParser exposing (..)


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map ChordChartPage (s "chords")
        , map ScalesPage (s "scales")
        ]


parseLocation : Location -> Route
parseLocation location =
    case (parseHash matchers location) of
        Just route ->
            route

        Nothing ->
            NotFoundPage


chordsPath : String
chordsPath =
    "#chords"


scalesPath : String
scalesPath =
    "#scales"
