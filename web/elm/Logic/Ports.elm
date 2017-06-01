port module Logic.Ports exposing (send)

import Types exposing (PlayBundle)


port send : PlayBundle -> Cmd msg
