module Types exposing (..)

import Navigation exposing (Location)
import Phoenix.Socket
import Json.Encode
import Chords.Types as Chords
import Fingerpick.Types as Fingerpick
import Fretboard.Types as Fretboard
import Home.Types as Home
import Scales.Types as Scales
import Strum.Types as Strum
import Html


type alias Model =
    { route : Route
    , musKey : String
    , navMenuOpen : Bool
    , modalOpen : Bool
    , phxSocket : Phoenix.Socket.Socket Msg
    , sliderValue : Int
    , chords : Chords.Model
    , fingerpick : Fingerpick.Model
    , fretboard : Fretboard.Model
    , home : Home.Model
    , scales : Scales.Model
    , strum : Strum.Model
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
    | ChordsMsg Chords.Msg
    | FingerpickMsg Fingerpick.Msg
    | FretboardMsg Fretboard.Msg
    | HomeMsg Home.Msg
    | ScalesMsg Scales.Msg
    | StrumMsg Strum.Msg


type Route
    = ChordsPage String
    | ScalesPage String
    | FretboardPage String
    | NotFoundPage
    | HomePage
    | StrummingPage
    | FingerPickingPage
