module Strum.Types exposing (..)


type alias Model =
    { strumArrow : List (List Int)
    , strumGroupNumber : String
    }


type Msg
    = Randomize Int Int
    | StrumArrowDirection (List (List Int))
    | ChangeStrumGroupNumber String
