module Fingerpick.Types exposing (..)

import Chords.Types as Chords exposing (ChordChartData)


type alias Model =
    { musKey : String
    , fingerPickPattern : { a : List Int, b : List Int }
    , displayedChords : ChordChartData
    }


type Msg
    = Randomize Int Int
    | FingerPickPatternBuilderA (List Int)
    | FingerPickPatternBuilderB (List Int)
