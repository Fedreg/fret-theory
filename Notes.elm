module Notes exposing (..)

import String exposing (..)


type alias Note =
    { frequency : Float
    , octave : Int
    , sustain : Float
    }


notes key =
    case key of
        -- 12 Major Keys
        "C" ->
            { i = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            , iv = [ "f3q", "a3q", "c4q", "e4q", "c0s", "c0s" ]
            , v = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , vi = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            }

        "G" ->
            { i = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , iv = [ "c3q", "e3q", "g3q", "d4q", "g4q", "c0s" ]
            , v = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , vi = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            }

        "D" ->
            { i = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , iv = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , v = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            , vi = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            }

        --
        "A" ->
            { i = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            , iv = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , v = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            , vi = [ "f#2q", "a2q", "d3q", "a3q", "c#4q", "e4q" ]
            }

        "E" ->
            { i = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            , iv = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            , v = [ "b2q", "d#3q", "a3q", "b3q", "f#4q", "c0s" ]
            , vi = [ "g#3q", "c#4q", "e4q", "g#4q", "c0s", "c0s" ]
            }

        "B" ->
            { i = [ "b2q", "f#3q", "b3q", "d#4q", "f#4q", "c0s" ]
            , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            , vi = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            }

        "F#" ->
            { i = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            , iv = [ "b2q", "f#3q", "b3q", "d#4q", "f#4q", "c0s" ]
            , v = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            , vi = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            }

        -- "Db" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "Ab" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "Eb" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "Bb" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "F" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        -- 12 Minor Keys.
        -- "a" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "e" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "b" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "f#" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        -- "c#" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "g#" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "d#" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "bb" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "f" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "c" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "g" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     }
        --
        -- "d" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
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
