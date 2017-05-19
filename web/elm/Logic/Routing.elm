module Logic.Routing exposing (..)

import Navigation exposing (Location)
import UrlParser exposing (..)


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map HomeRoute (s "home")
        , map ChordsRoute (s "chords" </> string)
        , map ScalesRoute (s "scales" </> string)
        , map FretboardRoute (s "fretboard" </> string)
        , map StrummingRoute (s "strumming")
        , map FingerPickingRoute (s "fingerpicking")
        ]


parseLocation : Location -> Route
parseLocation location =
    case parseHash matchers location of
        Just route ->
            route

        Nothing ->
            NotFoundRoute



-- modelUpdateOnHash : Model -> Location -> Maybe String
-- modelUpdateOnHash model location =
--     case model.route of
--         ChordsRoute _ ->
--             parseHash (s "chords" </> string) location
--         ScalesRoute _ ->
--             parseHash (s "scales" </> string) location
--         FretboardRoute _ ->
--             parseHash (s "fretboard" </> string) location
--         StrummingRoute ->
--             parseHash (s "strum" </> string) location
--         FingerPickingRoute ->
--             parseHash (s "fingerpicking" </> string) location
--         HomeRoute ->
--             parseHash (s "home" </> string) location
--         NotFoundRoute ->
--             parseHash (s "" </> string) location


chordsPath : String -> String
chordsPath key =
    "#chords/" ++ key


scalesPath : String -> String
scalesPath key =
    "#scales/" ++ key


fretboardPath : String -> String
fretboardPath key =
    "#fretboard/" ++ key


strummingPath : String
strummingPath =
    "#strumming/"


homePath : String
homePath =
    "#home/"


fingerPickingPath : String
fingerPickingPath =
    "#fingerpicking/"


type Route
    = ChordsRoute String
    | ScalesRoute String
    | FretboardRoute String
    | NotFoundRoute
    | HomeRoute
    | StrummingRoute
    | FingerPickingRoute
