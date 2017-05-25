module State exposing (..)

import List.Extra exposing (getAt)
import Logic.Routing as Routing
import Types exposing (Model, Msg(..), Route(..), PlayBundle, ChordChartData)
import Logic.Audio exposing (noteSorter)
import View exposing (mainView)
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


init location =
    let
        currentRoute =
            Routing.parseLocation location
    in
        ( { route = currentRoute
          , musKey = "C"
          , sliderValue = 1
          , navMenuOpen = False
          , modalOpen = False
          , phxSocket = initPhoenixSocket
          }
        , Logic.Update.joinChannel
        )


initPhoenixSocket =
    -- Phoenix.Socket.init "wss://damp-wave-74595.herokuapp.com/socket/websocket"
    Phoenix.Socket.init "ws:localhost:4000/socket/websocket"
        |> Phoenix.Socket.withDebug
        |> Phoenix.Socket.on "chord_select"
            "chordChannel:chords"
            ReceiveMessage


joinChannel : Cmd Msg
joinChannel =
    Task.succeed JoinChannel
        |> Task.perform identity


chordDecoder : JD.Decoder ChordChartData
chordDecoder =
    JDP.decode ChordChartData
        |> JDP.required "i" JD.string
        |> JDP.required "ii" JD.string
        |> JDP.required "iii" JD.string
        |> JDP.required "iv" JD.string
        |> JDP.required "v" JD.string
        |> JDP.required "vi" JD.string
        |> JDP.required "vii" JD.string
        |> JDP.required "i7" JD.string
        |> JDP.required "iv7" JD.string
        |> JDP.required "v7" JD.string
        |> JDP.required "vi7" JD.string
        |> JDP.required "bars" (JD.list JD.string)
        |> JDP.required "names" (JD.list JD.string)
        |> JDP.required "key" JD.string


update msg model =
    case msg of
        NoOp ->
            model ! []

        JoinChannel ->
            let
                channel =
                    Phoenix.Channel.init "chordChannel:chords"

                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.join channel model.phxSocket
            in
                ( { model | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )

        PhoenixMsg msg ->
            let
                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.update msg model.phxSocket
            in
                ( { model | phxSocket = phxSocket }
                , Cmd.map PhoenixMsg phxCmd
                )

        SendMessage key ->
            let
                payload =
                    (JE.object
                        [ ( "key", JE.string key )
                        ]
                    )

                push_ =
                    Phoenix.Push.init "chord_select" "chordChannel:chords"
                        |> Phoenix.Push.withPayload payload

                ( phxSocket, phxCmd ) =
                    Phoenix.Socket.push push_ model.phxSocket
            in
                { model | phxSocket = phxSocket }
                    ! [ Cmd.map PhoenixMsg phxCmd ]

        ReceiveMessage message ->
            let
                updatedChords =
                    JE.encode 0 message
                        |> JD.decodeString chordDecoder
                        |> Result.withDefault startKey
            in
                { model | displayedChords = updatedChords } ! []

        ShowNavMenu ->
            { model | navMenuOpen = not model.navMenuOpen, modalOpen = False } ! []

        ShowModal ->
            { model | modalOpen = not model.modalOpen } ! []

        OnLocationChange location ->
            let
                newRoute =
                    Routing.parseLocation location

                newKey =
                    Maybe.withDefault "C" <| Routing.modelUpdateOnHash model location
            in
                { model | route = newRoute, musKey = newKey, modalOpen = False, navMenuOpen = False } ! []

        NewUrl url ->
            ( model, Navigation.newUrl url )

        ChangeKey key ->
            ( { model | musKey = key, navMenuOpen = False }
            , joinChannel
            )
                :> update (SendMessage key)

        -- :> update JoinChannel
        ChangeSliderValue newVal ->
            let
                val =
                    Result.withDefault 1 <| String.toInt newVal
            in
                { model | sliderValue = val } ! []


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
