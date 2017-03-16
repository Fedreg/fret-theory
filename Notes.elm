module Notes exposing (..)

import String exposing (..)


type alias Note =
    { frequency : Float
    , octave : Int
    , sustain : Float
    }


notes key =
    case key of
        "c" ->
            { i = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            , iv = [ "f2q", "c3q", "f3q", "a3q", "c3q", "f4q" ]
            , v = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , vi = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            }

        "g" ->
            { i = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , iv = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            , v = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , vi = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            }

        --
        -- "d" ->
        --     { i = "06x05x040132323212"
        --     , iv = "263152040030323413"
        --     , v = "06x050142232322010"
        --     , vi = "06x152040030323212"
        --     , names = [ "D", "G", "A", "Bmin", "7" ]
        --     }
        --
        -- "a" ->
        --     { i = "06x050142232322010"
        --     , iv = "06x05x040132323212"
        --     , v = "060252342131020010"
        --     , vi = "162050040232322010"
        --     , names = [ "A", "D", "E", "F#min", "2" ]
        --     }
        --
        -- "e" ->
        --     { i = "060252342131020010"
        --     , iv = "06x050142232322010"
        --     , v = "060252141332020412"
        --     , vi = "06x05x344434223112"
        --     , names = [ "E", "A", "B7", "C#min", "9" ]
        --     }
        --
        -- "b" ->
        --     { i = "06xb52244334424112"
        --     , iv = "060252342131020010"
        --     , v = "b62354444233122112"
        --     , vi = "b62354444132122112"
        --     , names = [ "B", "E", "F#", "G#min", "4" ]
        --     }
        _ ->
            { i = [ "" ]
            , iv = [ "" ]
            , v = [ "" ]
            , vi = [ "" ]
            }


noteSorter : String -> Note
noteSorter string =
    -- let
    --     _ =
    --         Debug.log "Note_" string
    -- in
    case (String.length string) of
        3 ->
            Note (frequencies <| slice 0 1 string) (octave <| Result.withDefault 0 <| toInt <| slice 1 2 string) (sustain <| slice 2 3 string)

        4 ->
            if slice 1 2 string == "#" then
                Note (frequencies <| slice 0 2 string) (octave <| Result.withDefault 0 <| toInt <| slice 2 3 string) (sustain <| slice 3 4 string)
            else
                Note (frequencies <| slice 0 1 string) (octave <| Result.withDefault 0 <| toInt <| slice 1 2 string) (sustain <| slice 2 4 string)

        5 ->
            Note (frequencies <| slice 0 2 string) (octave <| Result.withDefault 0 <| toInt <| slice 2 3 string) (sustain <| slice 3 5 string)

        _ ->
            Note 0.0 0 0.0


sustain : String -> Float
sustain duration =
    -- let
    --     _ =
    --         Debug.log "Duration_" duration
    -- in
    case duration of
        "w" ->
            4.0

        "h" ->
            2.0

        "q" ->
            1.0

        "e" ->
            0.5

        "s" ->
            0.25

        "w." ->
            6.0

        "h." ->
            3.0

        "q." ->
            1.5

        "e." ->
            0.75

        "s." ->
            0.375

        _ ->
            0.0


octave : Int -> Int
octave num =
    -- let
    --     _ =
    --         Debug.log "octave_" octave
    -- in
    case num of
        1 ->
            1

        _ ->
            2 ^ (num - 1)


frequencies : String -> Float
frequencies note =
    -- let
    --     _ =
    --         Debug.log "Note_" note
    -- in
    case note of
        "c" ->
            130.81

        "c#" ->
            139.0

        "d" ->
            146.83

        "d#" ->
            156.0

        "e" ->
            164.81

        "f" ->
            174.61

        "f#" ->
            185.0

        "g" ->
            196.0

        "g#" ->
            208.0

        "a" ->
            220.0

        "a#" ->
            233.0

        "b" ->
            246.94

        "r" ->
            0.0

        _ ->
            0.0



--
--
-- tempo : Int -> Float
-- tempo bpm =
-- 			    (Basics.toFloat 60 / Basics.toFloat bpm) * 0.5
