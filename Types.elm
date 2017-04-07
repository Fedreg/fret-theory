module Types exposing (..)

import Navigation exposing (Location)


type alias Model =
    { route : Route
    , musKey : String
    , index : Int
    , currentChord : List String
    , notePosition : Int
    , showAccidental : String
    , sliderValue : Int
    }


type alias Dot =
    { tint : String
    , stringNo : String
    , fretNo : String
    }


type alias ChordChartData =
    { i : String
    , ii : String
    , iii : String
    , iv : String
    , v : String
    , vi : String
    , vii : String
    , bars : List String
    , names : List String
    }


type alias ChordAudioData =
    { i : List String
    , ii : List String
    , iii : List String
    , iv : List String
    , v : List String
    , vi : List String
    , vii : List String
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
    | ChangeSliderValue String
    | NoOp


type Route
    = ChordChartPage String
    | ScalesPage String
    | FretboardPage
    | NotFoundPage
