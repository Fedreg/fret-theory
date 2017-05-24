module Scales.Types exposing (..)


type alias Model =
    { musKey : String
    , currentChord : List String
    , index : Int
    , pitchShift : Int
    }


type Msg
    = Play (List String) Int
    | ResetIndex
    | SendNotes


type alias ScaleData =
    { e : List Int
    , b : List Int
    , g : List Int
    , d : List Int
    , a : List Int
    , e6 : List Int
    }


type alias ScaleSchemaData =
    { one : List Int
    , two : List Int
    , three : List Int
    , four : List Int
    , five : List Int
    , six : List Int
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
