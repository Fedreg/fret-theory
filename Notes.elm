module Notes exposing (..)

import String exposing (..)


type alias Note =
    { frequency : Float
    , octave : Int
    , sustain : Float
    }


{-| Defines audio Notes to be played for each string of every chord.
-}
notes : String -> { i : List String, iv : List String, v : List String, vi : List String }
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

        "Db" ->
            { i = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            , iv = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            , v = [ "g#3q", "d#3q", "g#4q", "b#3q", "d#4q", "g#5q" ]
            , vi = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "c0s" ]
            }

        "Ab" ->
            { i = [ "g#2q", "d#3q", "g#3q", "c4q", "d#4q", "g#4q" ]
            , iv = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            , v = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            , vi = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            }

        "Eb" ->
            { i = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            , iv = [ "g#2q", "d#3q", "g#3q", "c4q", "d#4q", "g#4q" ]
            , v = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "a#4q" ]
            , vi = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            }

        "Bb" ->
            { i = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            , iv = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            , v = [ "f2q", "c3q", "f3q", "a3q", "c4q", "f4q" ]
            , vi = [ "g2q", "d2q", "g3q", "a#3q", "d4q", "g4q" ]
            }

        "F" ->
            { i = [ "f3q", "a3q", "c4q", "e4q", "c0s", "c0s" ]
            , iv = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            , v = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            , vi = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            }

        -- 12 Minor Keys.
        "a" ->
            { i = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , iv = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            , v = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , vi = [ "f3q", "a3q", "c4q", "e4q", "c0s", "c0s" ]
            }

        "e" ->
            { i = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , iv = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , v = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            , vi = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            }

        "b" ->
            { i = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            , iv = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , v = [ "f#2q", "a2q", "d3q", "a3q", "c#4q", "e4q" ]
            , vi = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            }

        "f#" ->
            { i = [ "f#2q", "a2q", "d3q", "a3q", "c#4q", "e4q" ]
            , iv = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            , v = [ "c#q3", "g#3q", "c#4q", "e4q", "g#4q", "c0s" ]
            , vi = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            }

        "c#" ->
            { i = [ "c#q3", "g#3q", "c#4q", "e4q", "g#4q", "c0s" ]
            , iv = [ "f#2q", "a2q", "d3q", "a3q", "c#4q", "e4q" ]
            , v = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , vi = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            }

        "g#" ->
            { i = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , iv = [ "c#q3", "g#3q", "c#4q", "e4q", "g#4q", "c0s" ]
            , v = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , vi = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            }

        "d#" ->
            { i = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , iv = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , v = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "c0s" ]
            , vi = [ "b2q", "f#3q", "b3q", "d#4q", "f#4q", "c0s" ]
            }

        "bb" ->
            { i = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "c0s" ]
            , iv = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , v = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            , vi = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            }

        "f" ->
            { i = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            , iv = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "c0s" ]
            , v = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , vi = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            }

        "c" ->
            { i = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , iv = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            , v = [ "g2q", "d3q", "g3q", "a#3q", "d4q", "g4q" ]
            , vi = [ "g#2q", "d#3q", "g#3q", "c4q", "d#4q", "g#4q" ]
            }

        "g" ->
            { i = [ "g2q", "d3q", "g3q", "a#3q", "d4q", "g4q" ]
            , iv = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , v = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            , vi = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            }

        "d" ->
            { i = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            , iv = [ "g2q", "d3q", "g3q", "a#3q", "d4q", "g4q" ]
            , v = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , vi = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            }

        _ ->
            { i = [ "" ]
            , iv = [ "" ]
            , v = [ "" ]
            , vi = [ "" ]
            }


{-| Builds the Note to from a string to send to the web audio function.
-}
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
