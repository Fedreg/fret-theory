port module Main exposing (main, init, update, send, subscriptions)

import List.Extra exposing (getAt)
import Logic.Routing as Routing
import Logic.Types exposing (Model, Msg(..), Route(..), PlayBundle, ChordChartData)
import Logic.Audio exposing (noteSorter)
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
          , strumArrow = [ 1, 2, 1, 1, 2, 1, 1, 1 ]
          , fingerPickPattern =
                { a = [ 2, 0, 0, 3, 0, 1, 0, 2 ]
                , b = [ 5, 0, 4, 0, 5, 0, 5, 0 ]
                }
          , phxSocket = initPhoenixSocket
          }
        , joinChannel
        )


port send : PlayBundle -> Cmd msg


joinChannel : Cmd Msg
joinChannel =
    Task.succeed JoinChannel
        |> Task.perform identity


initPhoenixSocket =
    -- Phoenix.Socket.init "wss://damp-wave-74595.herokuapp.com/socket/websocket"
    Phoenix.Socket.init "ws:localhost:4000/socket/websocket"
        |> Phoenix.Socket.withDebug
        |> Phoenix.Socket.on "chord_select"
            "chordChannel:chords"
            ReceiveMessage


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
                _ =
                    Debug.log "OutMessage Key" key

                _ =
                    Debug.log "OutMessage Pay" payload

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
                _ =
                    Debug.log "InMessage" message

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

        Randomize hi lo ->
            case model.route of
                StrumPage ->
                    ( model, Random.generate StrumArrowDirection <| Random.list 8 (Random.int hi lo) )

                FingerPickingPage ->
                    ( model
                    , Cmd.batch
                        [ Random.generate FingerPickPatternBuilderA <| Random.list 8 (Random.int hi lo)
                        , Random.generate FingerPickPatternBuilderB <| Random.list 8 (Random.int hi lo)
                        ]
                    )

                _ ->
                    (model ! [])

        StrumArrowDirection numList ->
            { model | strumArrow = numList } ! []

        FingerPickPatternBuilderA numList ->
            let
                pattern =
                    model.fingerPickPattern

                newPattern =
                    { pattern | a = numList }
            in
                { model | fingerPickPattern = newPattern } ! []

        FingerPickPatternBuilderB numList ->
            let
                pattern =
                    model.fingerPickPattern

                newPattern =
                    { pattern | b = numList }
            in
                { model | fingerPickPattern = newPattern } ! []

        OnLocationChange location ->
            let
                newRoute =
                    Routing.parseLocation location

                newKey =
                    Maybe.withDefault "C" <| Routing.modelUpdateOnHash model location
            in
                { model | route = newRoute, musKey = newKey, modalOpen = False } ! []

        NewUrl url ->
            ( model, Navigation.newUrl url )

        ChangeKey key ->
            ( { model | musKey = key, navMenuOpen = False }
            , joinChannel
            )
                :> update (SendMessage key)

        -- :> update JoinChannel
        Play chord hzShift ->
            { model | currentChord = chord, pitchShift = hzShift }
                ! []
                :> update ResetIndex
                :> update SendNotes

        ResetIndex ->
            { model | index = 0 } ! []

        SendNotes ->
            let
                note =
                    noteSorter <| Maybe.withDefault "e2w" <| getAt model.index model.currentChord

                shiftedNote =
                    { note | frequency = note.frequency * (1.059463 ^ toFloat model.pitchShift), sustain = note.sustain * (toFloat model.sliderValue / 2) }
            in
                ( { model | index = model.index + 1 }
                , send (PlayBundle shiftedNote "triangle")
                )

        DrawNote index string accidental ->
            let
                stringOffset =
                    noteStringPos string

                fretOffset =
                    noteFretPos index

                finalOffset =
                    fretOffset + stringOffset
            in
                { model | notePosition = finalOffset, showAccidental = accidental } ! []

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
