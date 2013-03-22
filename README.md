#Fancy
=====

A functional wrapper for javascript. Utilizes both Underscore.js and Oliver Steele's functional.js

Basically, it helps you do functional stuff better than either library on its own. Enough 'splainin, demo time:

###Demo

Need to break arrays into chunks of 2? (Turn [1, 3, 2, 2, 4, 8] into [[1, 3], [2, 2], [4, 8]] )
- .chunk(2)
- .groupBy('v,i -> 0 | i/2') //fancy bitwise or used as int-cast. 

Need to sort pairs by the second value? ( Turn [['dave', 3], ['suzy', 5], ['jones', 1]] into [['jones', 1], ['dave', 3], ['suzy' 5]]
- .sortBy("x[1]")

See if two words are anagrams in linear time:
- FancyArray(("word1").split("")).sameContents(("word2").split(""))

Remove odd numbers from a list:
- .reject("%2")

More examples: https://github.com/anfurny/Fancy/wiki/Sample-Use

### So how do I use it

So simply create a fancy array from any array 
- var sampleFancyArray = new FancyArray([1,2,3]);

Now underscore functions that normally take an array as a parameter can be called on the object.
- sampleFancyArray = sampleFancyArray.map(function(x) { return x + 1;});

Also, you can create functions from strings as you would in Oliver Steele's Functional.js library:
- sampleFancyArray = sampleFancyArray.map("+1"); //same as above

Also, there are FancyObjects, which are the same thing, but used on javascript objects.
- var sampleFancyObject = new FancyObject({a: 1, b:3, c: 2});
- sampleFancyObject.keys(); // ['a', 'b', 'c']

You can chain between FancyArrays and Objects
- sampleFancyObject.keys().invoke("toUpperCase").countBy().values(); // [1, 1, 1]

- If you stop wanting to type "FancyArray" it's aliased as FA. "FancyObject" is aliased as FO.

FancyArrays are extensions of arrays and thus should usually be interchangeable with arrays. The cases when they aren't (json serialization, .concat) you can convert back to an array with .toTrueArray() .

Also please checkout https://github.com/documentcloud/underscore/ and https://github.com/osteele/functional-javascript.

###Don't ask me:
 * How's this different than using underscore and functional js?
  * more concisce
 * How's that?
  * The one-off object it returns functions as an array for almost all uses.
  * By merging the two libraries, it's like when two super saiyins merge: super freakin' powerful.
  * Also, a few functions are added
 * Was that a dragon ball z reference?
  * Yes 
 * What underscore functions do you provide? 
  * Every underscore function that is under the Array or Collection section is in a FancyArray
  * Every underscore function that is under the Object or Collection section is in a FancyObject
 * Wait, what functions did you add fancyArray, besides what is in underscore?
   * toTrueArray
   * hasAll
   * sameContents
   * chunk
 * Okay, what functions did you add to fancyObject, besides what is in underscore?
   * meld
   * mapObj
   * filterObj
   * selectObj
   * rejectObj   
