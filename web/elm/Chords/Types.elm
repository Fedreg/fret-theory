module Chords.Types exposing (..)


type alias Model =
    { musKey : String
    , displayedChords : ChordChartData
    , currentChord : List String
    , index : Int
    , pitchShift : Int
    , sliderValue : Int
    }


type Msg
    = Play (List String) Int
    | ResetIndex
    | SendNotes


type alias ChordChartData =
    { i : String
    , ii : String
    , iii : String
    , iv : String
    , v : String
    , vi : String
    , vii : String
    , i7 : String
    , iv7 : String
    , v7 : String
    , vi7 : String
    , bars : List String
    , names : List String
    , key : String
    }


type alias Dot =
    { tint : String
    , stringNo : String
    , fretNo : String
    }
