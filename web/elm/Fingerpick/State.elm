module Fingerpick.State exposing (..)

import Fingerpick.Types as FT exposing (..)
import Random exposing (..)
import Logic.Types as App exposing (Model)


initialModel : FT.Model
initialModel =
    { musKey = App.Model.musKey
    , fingerPickPattern = initFingerPickPattern
    }


initialCommands : Cmd Msg
initialCommands =
    Cmd.none


initFingerPickPattern : { a : List Int, b : List Int }
initFingerPickPattern =
    { a = [ 2, 0, 0, 3, 0, 1, 0, 2 ]
    , b = [ 5, 0, 4, 0, 5, 0, 5, 0 ]
    }


update : Msg -> FT.Model -> ( FT.Model, Cmd Msg )
update msg model =
    case msg of
        Randomize hi lo ->
            ( model
            , Cmd.batch
                [ Random.generate FingerPickPatternBuilderA <| Random.list 8 (Random.int hi lo)
                , Random.generate FingerPickPatternBuilderB <| Random.list 8 (Random.int hi lo)
                ]
            )
                ! []

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


subscriptions : FT.Model -> Sub Msg
subscriptions model =
    always Sub.none
