module Home.State exposing (..)

import Home.Types as HT exposing (..)
import Types as App exposing (Model)


initialModel : HT.Model
initialModel =
    { musKey = "C"
    , displayedChords = initialKey
    }


{-| Default key loaded in at init
-}
initialKey : ChordChartData
initialKey =
    { i = "06x353242030121010"
    , ii = "06x05x040232423111"
    , iii = "060152242030020010"
    , iv = "06x06x343232121010"
    , v = "263152040030323413"
    , vi = "06x050242332121010"
    , vii = "06x15224343432301x"
    , i7 = "06x353242433121010"
    , iv7 = "06x05x142334223414"
    , v7 = "363252040030020111"
    , vi7 = "06x050242030121010"
    , names = [ "C", "Dm", "Em", "F", "G", "Am", "Bdim7", "CM7", "FM7", "G7", "Am7", "5" ]
    , bars = [ "", "", "", "", "", "", "", "", "3", "", "" ]
    , key = "C"
    }


initialCommands : Cmd Msg
initialCommands =
    Cmd.none


update : Msg -> HT.Model -> ( HT.Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            model ! []


subscriptions : HT.Model -> Sub Msg
subscriptions model =
    Sub.none
