port module Logic.Ports exposing (send)

import Logic.Audio exposing (PlayBundle)


port send : PlayBundle -> Cmd msg
