#Fancy
=====

A functional wrapper for javascript. Utilizes both Underscore.js and Oliver Steele's functional.js

Basically, it helps you do functional stuff better than either library on its own. Enough 'splainin, demo time:

###Demo

Need to break arrays into chunks of 2? (Turn [1, 3, 2, 2, 4, 8] into [[1, 3], [2, 2], [4, 8]] )
- .chunk(2)
- .groupBy('v,i->0|i/2')

Need to sort pairs by the second value? ( Turn [['dave', 3], ['suzy', 5], ['jones', 1]] into [['jones', 1], ['dave', 3], ['suzy' 5]]
- .sortBy("x[1]")

See if two words are anagrams in linear time:
- FancyArray(("word1").split("")).sameContents(("word2").split(""))

Remove odd numbers from a list:
- .reject("%2")

###Don't ask me:
 * How's this different than using underscore and functional js?
  * more concisce
 * How's that?
  * The one-off object it returns functions as an array for almost all uses.
  * By integrating the two libraries, it's basically like Gotenks
  * Also, a few functions are added like filterObj
 * Was that a dragon ball z reference?
  * Yes 
