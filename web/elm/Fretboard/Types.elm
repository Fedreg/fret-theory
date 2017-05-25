module Fretboard.Types exposing (..)


type alias Model =
    { musKey : String
    , notePosition : Float
    , showAccidental : String
    }


type Msg
    = DrawNote String String String
