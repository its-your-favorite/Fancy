#Fancy
=====

A functional wrapper for javascript. Utilizes both Underscore.js and Oliver Steele's functional.js

Basically, it helps you do functional stuff better than either library on its own. Enough 'splainin, demo time:

##Demo
-----

Need to break arrays into chunks of 2? (Turn [1, 3, 2, 2, 4, 8] into [[1, 3], [2, 2], [4, 8]] )
- .chunk(2)
- .groupBy('v,i->0|i/2')

Need to sort pairs by the second value? ( Turn [['dave', 3], ['suzy', 5], ['jones', 1]] into [['jones', 1], ['dave', 3], ['suzy' 5]]
- .sortBy("x[1]")

See if two words are anagrams in linear time:
- FancyArray(("word1").split("")).sameContents(("word2").split(""))

Remove odd numbers from a list:
- .reject("%2")

 benefits:
 * Like underscore .chain method, but returns a more usable one-off.
 * integrates oliver steele's functional
 * assumes identity for filter
  
 The combination of the two libraries. So suppose I want to take an object, and return a sorted representation of its values.
 sure, .pairs helps, but there is no effective way to use "pluck" into "sortBy", thus requiring a
    .pairs.sort(function (a,b) { return (a[1] < b[1])*2-1; }) //remember we can sort alphabetical things
 By connecting the two libraries we can get the grace we sought: 
    .pairs.sortBy("x[1]")
