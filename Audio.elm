module Audio exposing (..)

import String exposing (..)
import Types exposing (..)
import List.Extra exposing (getAt)


{-| Defines audio Notes to be played for each string of every chord. "c0s" is default for no sound.
-}
notes : String -> ChordAudioData
notes key =
    case key of
        -- 12 Major Keys
        "C" ->
            { i = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            , ii = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            , iii = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , iv = [ "f3q", "a3q", "c4q", "e4q", "c0s", "c0s" ]
            , v = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , vi = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , vii = [ "b2q", "f3q", "g#3q", "d4q", "c0s", "c0s" ]
            }

        "G" ->
            { i = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , ii = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , iii = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            , iv = [ "c3q", "e3q", "g3q", "d4q", "g4q", "c0s" ]
            , v = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , vi = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , vii = [ "f#2q", "c3q", "f#3q", "a3q", "d#4q", "f#4q" ]
            }

        "D" ->
            { i = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , ii = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , iii = [ "f#2q", "a2q", "d3q", "a3q", "c#4q", "e4q" ]
            , iv = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , v = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            , vi = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            , vii = [ "c#3q", "f#3q", "b3q", "e4q", "e4q", "c0s" ]
            }

        --
        "A" ->
            { i = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            , ii = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            , iii = [ "g#3q", "c#4q", "e4q", "g#4q", "c0s", "c0s" ]
            , iv = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , v = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            , vi = [ "f#2q", "a2q", "d3q", "a3q", "c#4q", "e4q" ]
            , vii = [ "g#2q", "d3q", "g#3q", "b3q", "f4q", "g#4q" ]
            }

        "E" ->
            { i = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            , ii = [ "f#2q", "a2q", "d3q", "a3q", "c#4q", "e4q" ]
            , iii = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , iv = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            , v = [ "b2q", "d#3q", "a3q", "b3q", "f#4q", "c0s" ]
            , vi = [ "g#3q", "c#4q", "e4q", "g#4q", "c0s", "c0s" ]
            , vii = [ "d#3q", "a3q", "c4q", "f#4q", "c0s", "c0s" ]
            }

        "B" ->
            { i = [ "b2q", "f#3q", "b3q", "d#4q", "f#4q", "c0s" ]
            , ii = [ "c#3q", "g#3q", "c#4q", "e4q", "g#4q", "c0s" ]
            , iii = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            , vi = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , vii = [ "a#2q", "e3q", "g3q", "c#4q", "e4q", "c0s" ]
            }

        "F#" ->
            { i = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            , ii = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , iii = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "c0s" ]
            , iv = [ "b2q", "f#3q", "b3q", "d#4q", "f#4q", "c0s" ]
            , v = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            , vi = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , vii = [ "f3q", "b3q", "d4q", "g#4q", "c0s", "c0s" ]
            }

        "Db" ->
            { i = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            , ii = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , iii = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            , iv = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            , v = [ "g#3q", "d#3q", "g#4q", "b#3q", "d#4q", "g#4q" ]
            , vi = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "c0s" ]
            , vii = [ "c3q", "f#3q", "a3q", "d#4q", "c0s", "c0s" ]
            }

        "Ab" ->
            { i = [ "g#2q", "d#3q", "g#3q", "c4q", "d#4q", "g#4q" ]
            , ii = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "c0s" ]
            , iii = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , iv = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            , v = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            , vi = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            , vii = [ "g3q", "c#4q", "e4q", "a#4q", "c0s", "c0s" ]
            }

        "Eb" ->
            { i = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            , ii = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            , iii = [ "g2q", "d2q", "g3q", "a#3q", "d4q", "g4q" ]
            , iv = [ "g#2q", "d#3q", "g#3q", "c4q", "d#4q", "g#4q" ]
            , v = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "a#4q" ]
            , vi = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , vii = [ "d3q", "g#3q", "b3q", "f4q", "c0s", "c0s" ]
            }

        "Bb" ->
            { i = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            , ii = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , iii = [ "d3q", "a3q", "d4q", "f4q", "a4q", "c0s" ]
            , iv = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            , v = [ "f2q", "c3q", "f3q", "a3q", "c4q", "f4q" ]
            , vi = [ "g2q", "d3q", "g3q", "a#3q", "d4q", "g4q" ]
            , vii = [ "d#3q", "a3q", "c4q", "f#4q", "c0s", "c0s" ]
            }

        "F" ->
            { i = [ "f3q", "a3q", "c4q", "e4q", "c0s", "c0s" ]
            , ii = [ "g2q", "d2q", "g3q", "a#3q", "d4q", "g4q" ]
            , iii = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , iv = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            , v = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            , vi = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            , vii = [ "" ]
            }

        -- 12 Minor Keys.
        "a" ->
            { i = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , ii = [ "b2q", "f3q", "g#3q", "d4q", "c0s", "c0s" ]
            , iii = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            , iv = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            , v = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , vi = [ "f3q", "a3q", "c4q", "e4q", "c0s", "c0s" ]
            , vii = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            }

        "e" ->
            { i = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , ii = [ "f#2", "c3q", "f#3q", "a3q", "d#4q", "f#4q" ]
            , iii = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , iv = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , v = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            , vi = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            , vii = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            }

        "b" ->
            { i = [ "b2q", "d3q", "g3q", "d4q", "f#4q", "c0s" ]
            , ii = [ "c#3q", "g3q", "a#3q", "e4q", "c0s", "c0s" ]
            , iii = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , iv = [ "e2q", "b2q", "e3q", "g3q", "b3q", "e4q" ]
            , v = [ "f#2q", "a2q", "d3q", "a3q", "c#4q", "e4q" ]
            , vi = [ "g2q", "b2q", "d3q", "g3q", "d4q", "g4q" ]
            , vii = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            }

        "f#" ->
            { i = [ "f#2q", "a2q", "c#3q", "a3q", "c#4q", "f#4q" ]
            , ii = [ "g#2q", "d3q", "g#3q", "b3q", "f4q", "g#4q" ]
            , iii = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            , iv = [ "b2q", "d3q", "f#3q", "d4q", "f#4q", "c0s" ]
            , v = [ "c#q3", "g#3q", "c#4q", "e4q", "g#4q", "c0s" ]
            , vi = [ "d3q", "a3q", "d4q", "f#4q", "c0s", "c0s" ]
            , vii = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            }

        "c#" ->
            { i = [ "c#3q", "g#3q", "c#4q", "e4q", "g#4q", "c0s" ]
            , ii = [ "d#3q", "a3q", "c4q", "f#4q", "c0s", "c0s" ]
            , iii = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            , iv = [ "f#2q", "c#3q", "f#3q", "a3q", "c#4q", "f#4q" ]
            , v = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , vi = [ "a2q", "e3q", "a3q", "c#4q", "e4q", "c0s" ]
            , vii = [ "b2q", "f#3q", "b3q", "d#4q", "f#4q", "c0s" ]
            }

        "g#" ->
            { i = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , ii = [ "a#2q", "e3q", "g3q", "c#4q", "e4q", "c0s" ]
            , iii = [ "c2q", "g3q", "c3q", "e4q", "g4q", "c0s" ]
            , iv = [ "c#q3", "g#3q", "c#4q", "e4q", "g#4q", "c0s" ]
            , v = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , vi = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
            , vii = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            }

        "d#" ->
            { i = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , ii = [ "f3q", "b3q", "d4q", "g#4q", "c0s", "c0s" ]
            , iii = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            , iv = [ "g#2q", "d#3q", "g#3q", "b3q", "d#4q", "g#4q" ]
            , v = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "a#4q" ]
            , vi = [ "b2q", "f#3q", "b3q", "d#4q", "f#4q", "c0s" ]
            , vii = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            }

        "bb" ->
            { i = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "a#4q" ]
            , ii = [ "c3q", "f#3q", "a3q", "d#4q", "c0s", "c0s" ]
            , iii = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            , iv = [ "d#3q", "a#3q", "d#4q", "f#4q", "a#4q", "c0s" ]
            , v = [ "f3q", "c4q", "f4q", "g#4q", "c5q", "c0s" ]
            , vi = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
            , vii = [ "g#2q", "d#3q", "g#3q", "c4q", "d#4q", "g#4q" ]
            }

        "f" ->
            { i = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            , ii = [ "g3q", "c#4q", "e4q", "a#5q", "c0s", "c0s" ]
            , iii = [ "g#2q", "d#3q", "g#3q", "c4q", "d#4q", "g#4q" ]
            , iv = [ "a#2q", "f3q", "a#3q", "c#4q", "f4q", "c0s" ]
            , v = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , vi = [ "c#3q", "g#3q", "c#4q", "f4q", "g#4q", "c0s" ]
            , vii = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            }

        "c" ->
            { i = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , ii = [ "d3q", "g#3q", "b3q", "f4q", "c0s", "c0s" ]
            , iii = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            , iv = [ "f2q", "c3q", "f3q", "g#3q", "c4q", "f4q" ]
            , v = [ "g2q", "d3q", "g3q", "a#3q", "d4q", "g4q" ]
            , vi = [ "g#2q", "d#3q", "g#3q", "c4q", "d#4q", "g#4q" ]
            , vii = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            }

        "g" ->
            { i = [ "g2q", "d3q", "g3q", "a#3q", "d4q", "g4q" ]
            , ii = [ "d#3q", "a3q", "c4q", "f#4q", "c0s", "c0s" ]
            , iii = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            , iv = [ "c3q", "g3q", "c4q", "d#4q", "g4q", "c0s" ]
            , v = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            , vi = [ "d#3q", "a#3q", "d#4q", "g4q", "a#4q", "c0s" ]
            , vii = [ "f3q", "a3q", "c4q", "e4q", "c0s", "c0s" ]
            }

        "d" ->
            { i = [ "d3q", "a3q", "d4q", "f4q", "c0s", "c0s" ]
            , ii = [ "a#2q", "e3q", "g3q", "d4q", "e5q", "c0s" ]
            , iii = [ "f3q", "a3q", "c4q", "e4q", "c0s", "c0s" ]
            , iv = [ "g2q", "d3q", "g3q", "a#3q", "d4q", "g4q" ]
            , v = [ "a2q", "e3q", "a3q", "c4q", "e4q", "c0s" ]
            , vi = [ "a#2q", "f3q", "a#3q", "d4q", "f4q", "c0s" ]
            , vii = [ "c3q", "e3q", "g3q", "c4q", "e4q", "c0s" ]
            }

        _ ->
            { i = [ "" ]
            , ii = [ "" ]
            , iii = [ "" ]
            , iv = [ "" ]
            , v = [ "" ]
            , vi = [ "" ]
            , vii = [ "" ]
            }


{-| List of half-steps from root note for each scale.  Will be fed into 440 * (1.059463..)x
-}
scales : String -> List String
scales scale =
    case scale of
        "major" ->
            [ "c3s", "d3s", "e3s", "f3s", "g3s", "a3s", "b3s", "c4s", "d4s", "e4s", "f4s", "g4s", "a4s", "b4s", "c5s" ]

        "minor" ->
            [ "c3s", "d3s", "d#3s", "f3s", "g3s", "g#3s", "a#3s", "c4s", "d4s", "d#4s", "f4s", "g4s", "g#4s", "a#4s", "c5s" ]

        "majPentatonic" ->
            [ "c3s", "d3s", "e3s", "g3s", "a3s", "c4s", "d4s", "e4s", "g4s", "a4s", "c5s" ]

        "minPentatonic" ->
            [ "c3s", "d#3s", "f3s", "g3s", "a#3s", "c4s", "d#4s", "f4s", "g4s", "a#4s", "c5s" ]

        "lydian" ->
            [ "c3s", "d3s", "e3s", "f#3s", "g3s", "a3s", "b3s", "c4s", "d4s", "e4s", "f#4s", "g4s", "a4s", "b4s", "c5s" ]

        "mixolydian" ->
            [ "c3s", "d3s", "e3s", "f3s", "g3s", "a3s", "a#3s", "c4s", "d4s", "e4s", "f4s", "g4s", "a4s", "a#4s", "c5s" ]

        "dorian" ->
            [ "c3s", "d3s", "d#3s", "f3s", "g3s", "a3s", "a#3s", "c4s", "d4s", "d#4s", "f4s", "g4s", "a4s", "a#4s", "c5s" ]

        _ ->
            []


{-| Builds the Note to from a string to send to the web audio function.
-}
noteSorter : String -> Note
noteSorter string =
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
    case num of
        1 ->
            1

        _ ->
            2 ^ (num - 1)


frequencies : String -> Float
frequencies note =
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


stringToNote : List String -> Int -> List Note
stringToNote chord n =
    let
        chordList =
            []

        note =
            Maybe.withDefault "c0s" <| getAt n chord

        computedNote =
            noteSorter note
    in
        if n < List.length chord then
            computedNote :: chordList
        else
            stringToNote chord (n + 1)


scaleBuilder : List Float -> String -> Int -> List Float
scaleBuilder scale key n =
    let
        baseHz =
            frequencies key

        exponent =
            Maybe.withDefault 1 <| getAt n scale

        scaleList =
            []

        note =
            baseHz * (1.059463 ^ exponent)
    in
        if n < List.length scale then
            note :: scaleList
        else
            scaleBuilder scale key (n + 1)



--ii-V sub: Substitute ii for IV, so that you have a ii-V turnaround. For example, if you're playing in the key of C, the V chord is G7 and the ii chord is Dm7. So instead of C-F-G7, play C-Dm7-G7. This is far and away the easiest and most common substitution, and in fact it's the standard turnaround in jazz.
--Secondary Dominants: Use secondary dominants, i.e. V chords of V chords. Again, if you're playing in the key of C, the V chord is G7 and the V of G is D7, so instead of playing C-F-G7, play C-D7-G7 instead. You can extend this as much as you want, i.e. use V chords of V chords of V chords, etc. Entire songs have been written around this idea ("Salty Dog" comes to mind).
--Tritone Subs: In general, you can make what's called a "tritone substitution" on any dominant chord (i.e. any 7th chord). It works like this: if the root of the V chord is X, replace the chord with a 7th chord whose root is a tritone away from X. So in the key of C, again the V chord is a G7. The note that's a tritone away from G is D♭, so replace the G7 with a D♭7. Combined with the ii-for-IV substitution, the turnaround goes from C-F-G to C-Dm7-D♭7, which has some really nice voice-leading in the bass notes. Combine tritone subs with secondary dominants and you can have a field day with different patterns and substitutions.
--Diminished Subs: Every diminished chord is a 7th chord with a flatted 9 in four different ways. For example, the diminished chord with the notes D♭-E-G-B♭ is, simultaneously, a C7-9, an E♭7-9, an F♯7-9, and an A7-9. This offers a dizzying array of substitutional opportunities, and it also means that diminished scales and arpeggios sound great over 7th chords.
--Median Subs: Another general substitution is called a "median substitution". For this, you replace a chord whose root note is X with a chord whose root note is a third above or a third below X. You want to stay within the diatonic harmony of the key you're playing in, so the new chord may not be the same type of chord as the original. For example, if you're playing in the key of C, you can replace the I chord (C Major) with a iii chord (Em7) or a vi chord (Am7), because iii is a third above I and vi is a third below I. In fact, the ii-for-IV substitution I mentioned first is just a median sub (ii being a third below IV).
