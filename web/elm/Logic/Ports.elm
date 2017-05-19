port module Logic.Ports exposing (send)

import Logic.Types exposing (PlayBundle)


port send : PlayBundle -> Cmd msg
