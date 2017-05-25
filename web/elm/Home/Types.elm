module Home.Types exposing (..)


type alias Model =
    { musKey : String
    , displayedChords : ChordChartData
    }


type Msg
    = NoOp


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
