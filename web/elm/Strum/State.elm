module Strum.State exposing (..)

import Strum.Types exposing (..)
import Random exposing (..)


initialModel : Model
initialModel =
    { strumArrow = initStrumArrows
    , strumGroupNumber = "1"
    }


initialCommands : Cmd Msg
initialCommands =
    Cmd.none


initStrumArrows : List (List Int)
initStrumArrows =
    [ [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    , [ 1, 2, 1, 1, 2, 1, 1, 1 ]
    ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Randomize hi lo ->
            ( model, Random.generate StrumArrowDirection <| Random.list 4 <| Random.list 8 (Random.int hi lo) )

         StrumArrowDirection numList ->
            { model | strumArrow = numList } ! []

        ChangeStrumGroupNumber text ->
            { model | strumGroupNumber = text } ! []


subscriptions : Model -> Sub Msg
subscriptions model =
    always Sub.none
    