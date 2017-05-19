module Main exposing (main, init, update, send, subscriptions, Route, Msg(..))

import List.Extra exposing (getAt)
import Logic.Routing as Routing
import Logic.Audio exposing (noteSorter)
import Pages.Fretboard exposing (noteStringPos, noteFretPos)
import Pages.MainViews exposing (mainView)
import Pages.Chords exposing (init, Model, startKey)
import Pages.FingerPick exposing (init, Model)
import Pages.Strum exposing (init, Model)
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


type alias Model =
    { route : Route
    , currentPage : Page
    , fingerPickModel : Pages.FingerPick.Model
    , strumModel : Pages.Strum.Model
    , chordsModel : Pages.Chords.Model
    , scalesModel : Pages.Scales.Model
    , musKey : String
    , navMenuOpen : Bool
    , modalOpen : Bool
    , phxSocket : Phoenix.Socket.Socket Msg
    }

    
init location =
    let
        currentRoute =
            Routing.parseLocation location
    in
        ( { route = currentRoute
          , musKey ="C"
          , fingerPickModel = Pages.FingerPick.init
          , strumModel = Pages.Strum.init
          , chordsModel = Pages.Chords.init
          , fretboardModel = Pages.Fretboard.init
          , scalesModel = Pages.Scales.init
          , navMenuOpen = False
          , modalOpen = False
          , phxSocket = initPhoenixSocket
          }
        , joinChannel
        )




type Msg
    = ChangeKey String
    | OnLocationChange Location
    | NewUrl String
    | NoOp
    | ShowNavMenu
    | ShowModal
    | JoinChannel
    | SendMessage String
    | ReceiveMessage Json.Encode.Value
    | PhoenixMsg (Phoenix.Socket.Msg Msg)

type Page
    = Chords
    | FingerPick
    | Fretboard
    | Home
    | Scales
    | Strum

    



joinChannel : Cmd Msg
joinChannel =
    Task.succeed JoinChannel
        |> Task.perform identity


initPhoenixSocket =
    -- Phoenix.Socket.init "wss://damp-wave-74595.herokuapp.com/socket/websocket"
        Phoenix.Socket.init "ws:localhost:4000/socket/websocket"
        |>
            Phoenix.Socket.withDebug
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

        -
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
                


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ always Sub.none
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
