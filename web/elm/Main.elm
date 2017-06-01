module Main2 exposing (main)

import Navigation exposing (Location, newUrl)
import Html
import View exposing (..)
import State exposing (..)


main =
    Navigation.program OnLocationChange
        { init = State.init
        , update = State.update
        , view = View.mainView
        , subscriptions = State.subscriptions
        }
