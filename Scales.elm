module Scales exposing (scalesPage)

import Html exposing (..)
import Html.Attributes exposing (..)
import List exposing (map)


scalesPage model =
    h1 [ style [ ( "margin", "100px auto" ) ] ] [ text ("Scales Page! WIP!  " ++ toString model.musKey) ]
