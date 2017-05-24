module Main exposing (main, init, subscriptions)

import List.Extra exposing (getAt)
import Logic.Routing as Routing
import Logic.Types exposing (Model, Msg(..), Route(..), PlayBundle, ChordChartData)
import Logic.Audio exposing (noteSorter)
import Logic.Update exposing (update)
import Views.Fretboard exposing (noteStringPos, noteFretPos)
import Views.MainViews exposing (mainView)
import Views.Chords exposing (startKey)
import Navigation exposing (Location, newUrl)
import Time
import Update.Extra.Infix exposing ((:>))
import Random
import Phoenix.Socket
import Phoenix.Channel
import Phoenix.Push
import Json.Encode as JE
import Json.Decode as JD
import Json.Decode.Pipeline as JDP
import Task


main =
    Navigation.program OnLocationChange
        { init = init
        , update = update
        , view = mainView
        , subscriptions = subscriptions
        }


init location =
    let
        currentRoute =
            Routing.parseLocation location
    in
        ( { route = currentRoute
          , musKey = "C"
          , index = 6
          , currentChord = []
          , displayedChords = startKey
          , notePosition = 80.0
          , showAccidental = "0"
          , sliderValue = 1
          , navMenuOpen = False
          , pitchShift = 0
          , modalOpen = False
          , strumGroupNumber = "1"
          , strumArrow = initStrumArrows
          , fingerPickPattern = initFingerPickPattern
          , phxSocket = initPhoenixSocket
          }
        , Logic.Update.joinChannel
        )


initStrumArrows =
    [ [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    ]


initFingerPickPattern =
    { a = [ 2, 0, 0, 3, 0, 1, 0, 2 ]
    , b = [ 5, 0, 4, 0, 5, 0, 5, 0 ]
    }


initPhoenixSocket =
    -- Phoenix.Socket.init "wss://damp-wave-74595.herokuapp.com/socket/websocket"
    Phoenix.Socket.init "ws:localhost:4000/socket/websocket"
        |> Phoenix.Socket.withDebug
        |> Phoenix.Socket.on "chord_select"
            "chordChannel:chords"
            ReceiveMessage


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ let
            val =
                toFloat model.sliderValue / 10.0
          in
            if model.index < List.length model.currentChord then
                Time.every (val * Time.second) (always SendNotes)
            else
                Sub.none
        , Phoenix.Socket.listen model.phxSocket PhoenixMsg
        ]
