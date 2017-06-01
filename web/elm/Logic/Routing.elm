module Logic.Routing exposing (..)

import Navigation exposing (Location)
import Types exposing (Route(..), Model, Msg)
import UrlParser exposing (..)


matchers : Parser (Route -> a) a
matchers =
    oneOf
        [ map HomePage (s "home")
        , map ChordsPage (s "chords" </> string)
        , map ScalesPage (s "scales" </> string)
        , map FretboardPage (s "fretboard" </> string)
        , map StrummingPage (s "strumming")
        , map FingerPickingPage (s "fingerpicking")
        ]


parseLocation : Location -> Route
parseLocation location =
    case parseHash matchers location of
        Just route ->
            route

        Nothing ->
            NotFoundPage


modelUpdateOnHash : Model -> Location -> Maybe String
modelUpdateOnHash model location =
    case model.route of
        ChordsPage _ ->
            parseHash (s "chords" </> string) location

        ScalesPage _ ->
            parseHash (s "scales" </> string) location

        FretboardPage _ ->
            parseHash (s "fretboard" </> string) location

        StrummingPage ->
            parseHash (s "strum" </> string) location

        FingerPickingPage ->
            parseHash (s "fingerpicking" </> string) location

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


strummingPath : String
strummingPath =
    "#strumming/"


homePath : String
homePath =
    "#home/"


fingerPickingPath : String
fingerPickingPath =
    "#fingerpicking/"
