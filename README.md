Fancy
=====

A functional wrapper for javascript. Utilizes both Underscore.js and Oliver Steele's functional.js


 * benefits:
 * - Like underscore .chain method, but returns a more usable one-off.
 * - integrates oliver steele's functional
 * - assumes identity for filter
 * - The combination of the two libraries. So suppose I want to take an object, and return a sorted representation of its values.
 *  sure, .pairs helps, but there is no effective way to plug in pluck and sortBy, thus requiring a .pairs.sort(function (a,b) { return (a[1] < b[1])*2-1; }) //remember we can sort alphabetical things
 *  By connecting the two libraries we can get the grace we sought: .pairs.sortBy("x[1]")
