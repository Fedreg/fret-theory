module Keys exposing (keys, keyList)


keyList : List String
keyList =
    [ "Major Keys", "C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F", "Minor Keys", "a", "e", "b", "f#", "c#", "g#", "d#", "bb", "f", "c", "g", "d" ]


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
            , names = [ "C", "F", "G", "Am", "5" ]
            , bars = [ "", "", "", "" ]
            }

        "G" ->
            { i = "263152040030323413"
            , iv = "06x253142030323413"
            , v = "06x05x040132323212"
            , vi = "060152242030020010"
            , names = [ "G", "C9", "D", "Em", "0" ]
            , bars = [ "", "", "", "" ]
            }

        "D" ->
            { i = "06x05x040132323212"
            , iv = "263152040030323413"
            , v = "06x050142232322010"
            , vi = "06x152040030323212"
            , names = [ "D", "G", "A", "Bm", "7" ]
            , bars = [ "", "", "", "" ]
            }

        "A" ->
            { i = "06x050142232322010"
            , iv = "06x05x040132323212"
            , v = "060252342131020010"
            , vi = "162050040232322010"
            , names = [ "A", "D", "E", "F#m", "2" ]
            , bars = [ "", "", "", "" ]
            }

        "E" ->
            { i = "060252342131020010"
            , iv = "06x050142232322010"
            , v = "060252141332020412"
            , vi = "06x05x344434223112"
            , names = [ "E", "A", "B7", "C#m", "9" ]
            , bars = [ "", "", "", "" ]
            }

        "B" ->
            { i = "06xb52244334424112"
            , iv = "060252342131020010"
            , v = "b62354444233122112"
            , vi = "b62354444132122112"
            , names = [ "B", "E", "F#", "G#m", "4" ]
            , bars = [ "", "", "", "4" ]
            }

        "F#" ->
            { i = "b62354444233122112"
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "06xb52344434223112"
            , names = [ "F#", "B", "C#", "D#m", "11" ]
            , bars = [ "", "", "4", "6" ]
            }

        "Db" ->
            { i = "06xb52244334424112"
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "06xb52344434223112"
            , names = [ "Db", "Gb", "Ab", "Bbm", "6" ]
            , bars = [ "4", "", "4", "" ]
            }

        "Ab" ->
            { i = "b62354444233122112"
            , iv = "06xb52244334424112"
            , v = "06xb52244334424112"
            , vi = "b61353443131121111"
            , names = [ "Ab", "Db", "Eb", "Fm", "1" ]
            , bars = [ "4", "4", "6", "" ]
            }

        "Eb" ->
            { i = "06xb52244334424112"
            , iv = "b62354444233122112"
            , v = "b62354444233122112"
            , vi = "06xb52344434223112"
            , names = [ "Eb", "Ab", "Bb", "Cm", "4" ]
            , bars = [ "6", "4", "6", "3" ]
            }

        "Bb" ->
            { i = "06xb51243333423111"
            , iv = "06xb52244334424112"
            , v = "b61353443232121111"
            , vi = "b62354444132122112"
            , names = [ "Bb", "Eb", "F", "Gm", "3" ]
            , bars = [ "", "6", "", "3" ]
            }

        "F" ->
            { i = "06x05x343232121010"
            , iv = "06xb51243333423111"
            , v = "06x353242030121010"
            , vi = "06x05x040232423111"
            , names = [ "F", "Bb", "C", "Dm", "10" ]
            , bars = [ "", "", "", "" ]
            }

        -- --12mor Keys.
        "a" ->
            { i = "06x050242332121010"
            , iv = "06x05x040232423111"
            , v = "060152242030020010"
            , vi = "06x05x343232121010"
            , names = [ "Am", "Dm", "Em", "F", "5" ]
            , bars = [ "", "", "", "" ]
            }

        "e" ->
            { i = "060152242030020010"
            , iv = "06x050242332121010"
            , v = "06x152040030323212"
            , vi = "06x353242030121010"
            , names = [ "Em", "Am", "Bm", "C", "0" ]
            , bars = [ "", "", "", "" ]
            }

        "b" ->
            { i = "06x05x344434223112"
            , iv = "060152242030020010"
            , v = "162050040232322010"
            , vi = "263152040030323413"
            , names = [ "Bm", "Em", "F#m", "G", "7" ]
            , bars = [ "", "", "", "" ]
            }

        "f#" ->
            { i = "b62354444132122112"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "06x05x040132323212"
            , names = [ "F#m", "Bm", "C#m", "D", "2" ]
            , bars = [ "", "", "4", "" ]
            }

        "c#" ->
            { i = "06xb52344434223112"
            , iv = "b62354444132122112"
            , v = "b62354444132122112"
            , vi = "06x050142232322010"
            , names = [ "C#m", "F#m", "G#m", "A", "9" ]
            , bars = [ "4", "", "4", "" ]
            }

        "g#" ->
            { i = "b62354444132122112"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "060152242131020010"
            , names = [ "G#m", "C#m", "D#m", "E", "4" ]
            , bars = [ "4", "4", "6", "" ]
            }

        "d#" ->
            { i = "06xb52344434223112"
            , iv = "b62354444132122112"
            , v = "b62354444132122112"
            , vi = "06xb52244334424112"
            , names = [ "D#m", "G#m", "A#m", "B", "11" ]
            , bars = [ "6", "4", "6", "" ]
            }

        "bb" ->
            { i = "b62354444132122112"
            , iv = "06xb52344434223112"
            , v = "06xb52344434223112"
            , vi = "b62354444233122112"
            , names = [ "Bbm", "Ebm", "Fm", "Gb", "6" ]
            , bars = [ "6", "6", "8", "" ]
            }

        "f" ->
            { i = "b61353443131111111"
            , iv = "06xb51343433222111"
            , v = "06xb52344434223112"
            , vi = "06xb52244334424112"
            , names = [ "Fm", "Bbm", "Cm", "Db", "1" ]
            , bars = [ "", "", "3", "4" ]
            }

        "c" ->
            { i = "06xb52344434223112"
            , iv = "b61353443131121111"
            , v = "b62354444132122112"
            , vi = "b62354444233122112"
            , names = [ "Cm", "Fm", "Gm", "Ab", "8" ]
            , bars = [ "3", "", "3", "6" ]
            }

        "g" ->
            { i = "b62354444132122112"
            , iv = "06xb52344434223112"
            , v = "06x05x040232423111"
            , vi = "06xb52244334424112"
            , names = [ "Gm", "Cm", "Dm", "Eb", "3" ]
            , bars = [ "3", "3", "", "6" ]
            }

        "d" ->
            { i = "06x05x040232423111"
            , iv = "b62354444132122112"
            , v = "06x050242332121010"
            , vi = "06xb51243333423111"
            , names = [ "Dm", "Gm", "Am", "Bb", "10" ]
            , bars = [ "", "3", "", "" ]
            }

        _ ->
            { i = ""
            , iv = ""
            , v = ""
            , vi = ""
            , names = [ "", "", "", "", "" ]
            , bars = [ "" ]
            }
