module Types exposing (..)

import Navigation exposing (Location)


type alias Model =
    { route : Route
    , musKey : String
    , index : Int
    , currentChord : List String
    , notePosition : String
    , showAccidental : String
    }


type alias Dot =
    { tint : String
    , stringNo : String
    , fretNo : String
    }


type alias Note =
    { frequency : Float
    , octave : Int
    , sustain : Float
    }


type alias PlayBundle =
    { note : Note
    , waveType : String
    }


type Msg
    = ChangeKey String
    | SendNotes
    | Play (List String)
    | ResetIndex
    | OnLocationChange Location
    | DrawNote String String String


type Route
    = ChordChartPage
    | ScalesPage
    | FretboardPage
    | NotFoundPage
