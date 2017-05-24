module Fingerpick.Types exposing (..)


type alias Model =
    { musKey : String
    , fingerPickPattern : { a : List Int, b : List Int }
    }


type Msg
    = Randomize Int Int
    | FingerPickPatternBuilderA (List Int)
    | FingerPickPatternBuilderB (List Int)
