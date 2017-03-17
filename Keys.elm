module Keys exposing (keys, keyList)


keyList : List String
keyList =
    [ "Major Keys", "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F" ]


{-| Defines dot placement of each chord.
-}
keys : String -> { bars : List String, i : String, iv : String, names : List String, v : String, vi : String }
keys key =
    case key of
        "C" ->
            { i = "06x353242030121010"
            , iv = "06x06x343232121010"
            , v = "263152040030323413"
            , vi = "06x050242332121010"
            , names = [ "C", "F", "G", "A Min", "5" ]
            , bars = [ "", "", "", "" ]
            }

        "G" ->
            { i = "263152040030323413"
            , iv = "06x253142030323413"
            , v = "06x05x040132323212"
            , vi = "060152242030020010"
            , names = [ "G", "C9", "D", "E Min", "0" ]
            , bars = [ "", "", "", "" ]
            }

        "D" ->
            { i = "06x05x040132323212"
            , iv = "263152040030323413"
            , v = "06x050142232322010"
            , vi = "06x152040030323212"
            , names = [ "D", "G", "A", "B Min", "7" ]
            , bars = [ "", "", "", "" ]
            }

        "A" ->
            { i = "06x050142232322010"
            , iv = "06x05x040132323212"
            , v = "060252342131020010"
            , vi = "162050040232322010"
            , names = [ "A", "D", "E", "F# Min", "2" ]
            , bars = [ "", "", "", "" ]
            }

        "E" ->
            { i = "060252342131020010"
            , iv = "06x050142232322010"
            , v = "060252141332020412"
            , vi = "06x05x344434223112"
            , names = [ "E", "A", "B7", "C# Min", "9" ]
            , bars = [ "", "", "", "" ]
            }

        "B" ->
            { i = "06xb52244334424112"
            , iv = "060252342131020010"
            , v = "b62354444233122112"
            , vi = "b62354444132122112"
            , names = [ "B", "E", "F#", "G# Min", "4" ]
            , bars = [ "", "", "", "4" ]
            }

        "F#" ->
            { i = "b62354444233122112"
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "06xb52344434223112"
            , names = [ "F#", "B", "C#", "D# Min", "11" ]
            , bars = [ "", "", "4", "6" ]
            }

        "Db" ->
            { i = "06xb52244334424112"
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "06xb52344434223112"
            , names = [ "Db", "Gb", "Ab", "Bb Min", "6" ]
            , bars = [ "4", "", "4", "" ]
            }

        "Ab" ->
            { i = "b62354444233122112"
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "b61353443131121111"
            , names = [ "Ab", "Db", "Eb", "F Min", "1" ]
            , bars = [ "4", "4", "6", "" ]
            }

        "Eb" ->
            { i = "06xb52244334424112"
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "06xb52344434223112"
            , names = [ "Eb", "Ab", "Bb", "C Min", "4" ]
            , bars = [ "6", "4", "6", "3" ]
            }

        "Bb" ->
            { i = "06xb51243333423111"
            , iv = "06xb52244334424112"
            , v = "b61353443232121111"
            , vi = "b62354444132122112"
            , names = [ "Bb", "Eb", "F", "G Min", "3" ]
            , bars = [ "", "6", "", "3" ]
            }

        "F" ->
            { i = "06x05x343232121010"
            , iv = "06xb51243333423111"
            , v = "06x353242030121010"
            , vi = "06x05x040232423111"
            , names = [ "F", "Bb", "C", "D Min", "10" ]
            , bars = [ "", "", "", "" ]
            }

        -- --12 Minor Keys.
        -- "a" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "e" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "b" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "f#" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "c#" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "g#" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "d#" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "bb" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "f" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "c" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "g" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        --
        -- "d" ->
        --     { i = [ "b2q", "f#2q", "b3q", "d#3q", "f#4q", "c0s" ]
        --     , iv = [ "e2q", "b2q", "e3q", "g#3q", "b3q", "e4q" ]
        --     , v = [ "f#2q", "c#3q", "f#3q", "a#3q", "c#4q", "f#4q" ]
        --     , vi = [ "g#2q", "d#2q", "g#3q", "b3q", "d#3q", "g#4q" ]
        --     , names = [ "B", "E", "F#", "G#", "4" ]
        --     }
        _ ->
            { i = ""
            , iv = ""
            , v = ""
            , vi = ""
            , names = [ "", "", "", "", "" ]
            , bars = [ "" ]
            }
