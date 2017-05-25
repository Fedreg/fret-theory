module Modal.View exposing (modal, modalIcon)

import Html exposing (Html, div, span, a, text, h3, h4)
import Html.Attributes exposing (style, class)
import Html.Events exposing (onClick)
import Logic.Types exposing (Model, Msg(ShowModal), Route(..))
import Modal.Styles exposing (..)
import Strum.View exposing (strumGroup)
import Markdown exposing (toHtml)


modal : Model -> Html Msg
modal model =
    let
        key =
            model.musKey
    in
        case model.route of
            ChordsPage key ->
                chordModal model

            ScalesPage key ->
                scalesModal model

            FretboardPage key ->
                fretboardModal model

            NotFoundPage ->
                div [] []

            HomePage ->
                homeModal model

            StrummingPage ->
                strummingModal model

            FingerPickingPage ->
                fingerPickModal model


modalIcon : Model -> Html Msg
modalIcon model =
    div [ modalIconStyle model, onClick ShowModal ] [ text "i" ]


homeModal : Model -> Html Msg
homeModal model =
    div [ modalStyle model ]
        [ div [ modalContentStyle ]
            [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
            , h3 [ modalHeaderStyle ] [ text "Guide" ]
            , toHtml [] homeModalContent
            ]
        ]


homeModalContent : String
homeModalContent =
    """
#### HOW TO USE THIS WEBSITE
***
This site is broken up into several sections:
* **CHORDS**
* **SCALES**
* **FRETBOARD**
* **STRUMMING**
* **FINGERPICKING**
***
Start with **CHORDS** and **STRUMMING**.

Once those are making sense proceed to **SCALES**.

Save the **FRETBOARD** and **FINGERPICKING** sections for last.
"""


chordModal : Model -> Html Msg
chordModal model =
    div [ modalStyle model ]
        [ div [ modalContentStyle ]
            [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
            , h3 [ modalHeaderStyle ] [ text "Chords" ]
            , toHtml [] chordModalContent
            ]
        ]


chordModalContent : String
chordModalContent =
    """
Chords are defined as two or more harmonic pitches that are sounded simultaneously.  Most chords played on the guitar consist of 3 notes but many contain 4 or more pitches.
Chords are comprised of the **1st**, **3rd**, & **5th** notes of their corresponding scales.  For example:
* a C MAJOR **SCALE** contains the notes **C D E F G A B C**
* a C MAJOR **CHORD** contains the notes **C E G**, the **1st**, **3rd**, & **5th** notes of the C MAJOR SCALE.
* a G MAJOR **SCALE** contains the notes **G A B C D E F# G**
* a G MAJOR **CHORD** contains the notes **G B D**, the **1st**, **3rd**, & **5th** notes of the G MAJOR SCALE.
***
##### Numeric Chords (i.e. 7th, 9th, 11th, etc.)
**7th chords** are the same as regular chords but in addition to the standard chord pitches, they also contain the **7th** pitch of the scale.
Similarly, **9th chords** add the **9th** pitch of the scale.

For the scope of this site, we will concentrate on the basic 6 chords:
* **MAJOR** _written as_ **M** ex: **CM**, or simply **C**
* **MINOR** _written as_ **m** ex: **Cm**
* **MAJOR 7TH** _written as_ **M7** ex: **CM7**
* **MINOR 7TH** _written as_ **m7** ex: **Cm7**
* **DOMINANT 7TH** _written as_ **7** ex: **C7**
* **DIMINISHED 7TH** _written as_ **dim7** ex: **Cdim7**
***
##### Chord Functions
Within any given key, chords are defined by their function, or number, using roman numerals. Within the **C MAJOR SCALE** the **C** chord has the function **I** because it is built off the
first pitch of the scale. The **Dm** chord, has the function **ii** because it is built off the 2nd pitch of the scale.  _Note the lowercase **ii** because the chord is minor_
You should begin by learning the **I**, **IV**,**V**, & **vi** chords of any given key as those are by far the most commonly played chords.
***
##### How To Learn
* Begin by learning the **I**, **IV**,**V**, & **vi** chords in the keys **C, G, D** & **Am**.
* Once those are comfortable start looking at some of the bar chords in other keys.
* _NOTE: In some of the "easier" keys, we have modified chords that would normally require bar chords to make them more accessible._
* Once you feel comfortable with basic chords, start looking at 7th chords.
* A great way to improve your mastery of chords is to memorize the "shape" of the chord away from the guitar.
In other words, practice the shape of the chord without placing it on the fretboard.  This will accelerate your muscle memory patterning and increase your
ability to quickly move your fingers into that chord position.
"""


fingerPickModal : Model -> Html Msg
fingerPickModal model =
    div [ modalStyle model ]
        [ div [ modalContentStyle ]
            [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
            , h3 [ modalHeaderStyle ] [ text "FingerPicking" ]
            , toHtml [] fingerPickModalContent
            ]
        ]


fingerPickModalContent =
    ""


fretboardModal : Model -> Html Msg
fretboardModal model =
    div [ modalStyle model ]
        [ div [ modalContentStyle ]
            [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
            , h3 [ modalHeaderStyle ] [ text "FretBoard" ]
            , toHtml [] fretboardModalContent
            ]
        ]


fretboardModalContent : String
fretboardModalContent =
    ""


scalesModal : Model -> Html Msg
scalesModal model =
    div [ modalStyle model ]
        [ div [ modalContentStyle ]
            [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
            , h3 [ modalHeaderStyle ] [ text "Scales" ]
            , toHtml [] scalesModalContent
            ]
        ]


scalesModalContent : String
scalesModalContent =
    """
Scales are usually defined as a collection of 8 notes grouped together by a specific formula of whole **W** and half **H** steps and spanning one musical octve **C2 to C3, for example**. You can think of a half step as moving up or down one fret and a whole step as moving up or down 2 frets.
**ASCENDING** Scales are played from the lowest pitch note to the highest; **DESCENDING** from the highest pitch to lowest.
##### Scale Formulas
* **MAJOR SCALE** **W-W-H-W-W-W-H** (AKA: Ionian Mode)
* ** MINOR SCALE** **W-H-W-W-H-W-W** (AKA: Aeolian Mode)
* **LYDIAN MODE** **W-W-W-H-W-W-H**
* **MIXOLYDIAN MODE** **W-W-H-W-W-H-W**
* **DORIAN MODE** **W-H-W-W-H-W-W**
* **MAJOR  PENTATONIC** Made up of the  **1st**,**2nd**,**3rd**,**5th**, & **6th** notes of the **MAJOR SCALE**
* **MINOR  PENTATONIC** Made up of the  **1st**,**3rd**,**4th**,**5th**, & **6th** notes of the **MINOR SCALE**
***
##### How To Learn
* Start by memorizing the  **MINOR PENTATONIC SCALE**. You will use this scale A LOT.
* Then proceed to the **MINOR SCALE**, **MAJOR SCALE** & **MAJOR PENTATONIC SCALE**, in that order.
* A good way to practice these is to play **each note** **4 times ascending**, then **2 times descending**, then **1 time ascending & descending**.
"""


strummingModal : Model -> Html Msg
strummingModal model =
    div [ modalStyle model ]
        [ div [ modalContentStyle ]
            [ div [ closeModalIcon, onClick ShowModal ] [ text "x" ]
            , h3 [ modalHeaderStyle ] [ text "Strumming" ]
            , toHtml [] strumModalContent
            , strumGroup "0.75,0.75" [ 1, 2, 1, 1, 2, 1, 1, 1 ] "#444" "#FFF" "none" "0"
            , strumGroup "0.75,0.75" [ 1, 1, 1, 2, 1, 1, 1, 2 ] "#444" "#FFF" "none" "0"
            , strumGroup "0.75,0.75" [ 1, 1, 2, 1, 1, 2, 1, 1 ] "#444" "#FFF" "none" "0"
            , strumGroup "0.75,0.75" [ 2, 1, 2, 1, 2, 1, 2, 1 ] "#444" "#FFF" "none" "0"
            ]
        ]


strumModalContent : String
strumModalContent =
    """
When it comes to strumming it is easiest to think of a repeating 8 beat pattern
##### **COUNT: 1 2 3 4 5 6 7 8 - 1 2 3 4 5 6 7 8 - 1 2 3 4 5 6 7 8**
* With your hand strumming down on any ODD beat and up on any EVEN beat.
* Thus your down strums would fall on every 1 3 5 or 7 and your up strums on 2 4 6 or 8
* Your strumming hand should always be following this up down pattern, hovering over the strings even if they do not strum the string
***
##### How To Learn
* Practice strumming **down** on all counts **1 3 5 7**
* Practice strumming **up** on all counts **2 4 6 8**
* Use the random strum generator to create a practice pattern choose from one of the patterns below.
* Be sure that your hand is always moving in the correct direction (down of 1 3 5 7, up on 2 4 6 8)
***
##### Common Strum Patterns
"""
