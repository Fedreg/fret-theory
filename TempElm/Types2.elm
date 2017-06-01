module Logic.Types exposing (..)

import Navigation exposing (Location)
import Phoenix.Socket
import Json.Encode


type alias Model =
    { route : Route
    , musKey : String
    , index : Int
    , currentChord : List String
    , displayedChords : ChordChartData
    , notePosition : Float
    , showAccidental : String
    , sliderValue : Int
    , navMenuOpen : Bool
    , pitchShift : Int
    , modalOpen : Bool
    , strumArrow : List (List Int)
    , strumGroupNumber : String
    , fingerPickPattern : { a : List Int, b : List Int }
    , phxSocket : Phoenix.Socket.Socket Msg
    }


type alias Dot =
    { tint : String
    , stringNo : String
    , fretNo : String
    }


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


type alias ChordAudioData =
    { i : List String
    , ii : List String
    , iii : List String
    , iv : List String
    , v : List String
    , vi : List String
    , vii : List String
    }


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


type Msg
    = ChangeKey String
    | ChangeSliderValue String
    | ChangeStrumGroupNumber String
    | DrawNote String String String
    | FingerPickPatternBuilderA (List Int)
    | FingerPickPatternBuilderB (List Int)
    | JoinChannel
    | NewUrl String
    | NoOp
    | OnLocationChange Location
    | PhoenixMsg (Phoenix.Socket.Msg Msg)
    | Play (List String) Int
    | Randomize Int Int
    | ReceiveMessage Json.Encode.Value
    | ResetIndex
    | SendMessage String
    | SendNotes
    | ShowModal
    | ShowNavMenu
    | StrumArrowDirection (List (List Int))


type Route
    = ChordsPage String
    | ScalesPage String
    | FretboardPage String
    | NotFoundPage
    | HomePage
    | StrummingPage
    | FingerPickingPage
