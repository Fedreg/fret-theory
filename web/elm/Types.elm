module Types exposing (..)

import Navigation exposing (Location)
import Phoenix.Socket
import Json.Encode


type alias Model =
    { route : Route
    , musKey : String
    , navMenuOpen : Bool
    , modalOpen : Bool
    , phxSocket : Phoenix.Socket.Socket Msg
    , sliderValue : Int
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
    | ChangeSliderValue String
    | JoinChannel
    | NewUrl String
    | NoOp
    | OnLocationChange Location
    | PhoenixMsg (Phoenix.Socket.Msg Msg)
    | ReceiveMessage Json.Encode.Value
    | SendMessage String
    | ShowModal
    | ShowNavMenu


type Route
    = ChordsPage String
    | ScalesPage String
    | FretboardPage String
    | NotFoundPage
    | HomePage
    | StrummingPage
    | FingerPickingPage
