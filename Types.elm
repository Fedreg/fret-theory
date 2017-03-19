module Types exposing (..)


type alias Model =
    { musKey : String
    , index : Int
    , currentChord : List String
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
