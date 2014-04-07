---
layout : post
title : Does my library suck?
---
This is a collection of tips on how to confidently say, "no, it doesn't suck!".  If you don't follow most of these, it probably will suck.

These are based on popular libraries of all shapes and sizes; 
common complaints I hear, and my personal experiences.

## Docs

Documentation is more important than the code quality.  If your docs 
aren't good, then no one will want to use your library.

There are two parts to docs.

### The fun docs

This usually goes in your README.  And introduction to the library,
why it exists, and a small usage example.  Maybe a few jokes.

Transparency is important.  Users want to know a few things off the bat before they look further:

 - tests
   - what's tested
   - known production use (i.e. "battle tested")
   - how to run the tests

 - browser support
   - exact IE version
   - iOS and Android versions (approximate or exact)
   - "Chrome, Firefox, Safari, Opera" generally means any release in the past year; be more specific if it's very recent versions only
   - recommend polyfills

It should also have a link to these:

### The borring docs

Plain, boring, consistent, and useful.  These lay out your public api, 
the expected types and return types.  Short descriptions and short examples
of each function.  You can generate this with jsdoc or many other options,
or write it by hand.  It doesn't matter as long as they're helpful.

If it's not in borring docs, it doesn't exist.

## Flexibility

Your library needs to work for a variety of users with a variety 
of existing technology.  These all boil down to "make no assumptions".

### UMD (universal module definition)

This ensures your library will work with any of the popular module systems. 
These are CommonJS (e.g. Browserify), AMD (e.g. RequireJS), and plain browser
globals.

Checkout [umdjs/umd][1] on GitHub.  You probably want [returnExports][2].

### DOM Flexibility

I see this far too often:

> Pass an id as the first parameter, e.g. `myModule("someid")`

No, no, no, NO!  Don't do this.  It's extremly inflexible and 
makes it a huge pain for people using libraries that supply the dom nodes.  What are they supposed to do; generate random IDs, attatch them to the element, and then give them to you, just so you can call
`document.getElementById`?  No!

If you want to allow the id shortcut, cool.  Also accept an element.

```js
function thingy(elementOrId) {
    var element;
    if (typeof elementOrId === "string") {
        element = document.getElementById(elementOrId);
    }
    else {
        element = elementOrId;
    }
}
```

### No Conflict

This may sound silly if your module has a global called Flubberblubber, but
believe me, it's a good idea.

```js
(function(root, factory){
/* ... umd ... */
}
(this, function(){
    var root = this;
    var Flubberblubber = {
        // ...
    }

    var originalFlubberblubber = root.Flubberblubber;
    Flubberblubber.noConflict = function(){
        root.Flubberblubber = originalFlubberblubber;
        return Flubberblubber;
    };

    return Flubberblubber;
}))
```

### Debug Builds

When your library has more than a few public methods, people are very
likely to make mistakes.  Us humans are very needy.  We need helpful
warnings when we're developing; we also don't want compromise on
file size in production.

#### Browserify and Envify

[Envify][3] is a browserify transform that replaces node-style enviromental variable lookup with constants.

```js
if (process.env.NODE_ENV !== "production") {
   console.warn("You don't want to do that, because ...");
}
```

Can be come this in your production build:

```js
if ("production" !== "production") {
   console.warn("You don't want to do that, because ...");
}
```

Then your minifier (e.g. [Uglify-JS][4]) says "the body of the if statement
is impossible to run, so I'll remove the whole thing."  And with this 
little hack, you can eliminate blocks of code from your production build,
while keeping them in your unminified build.

Side note: browserify will generate a UMD for you.  It's pure awesome.

#### Plain Uglify-JS

When running `uglify-js` you can do `-d ENV="production"`.  This is essentially the same as our envify solution but more confusing and I'm
not sure exactly how to make it work in the development build... (`window.ENV = "development"`?).

## Accessibility

You want your users to have access to your library.  If it's not available
through their usual channels, they might shy away from it.  This is the basic set of places it should ideally be:

- npm
- bower
- cdnjs (when it reaches popularity)

### Plugins

In addition to the UMD; it might make sense to create versions of your 
library that target specific frameworks or parent libraries.  These should be special builds or wrappers.

- jQuery wrapper for DOM related functionality (even if it doesn't use jQuery)
- grunt/gulp plugins (for build related tasks)
- connect/express for node.js libraries (where it makes sense)

## I can't do this!

I know... it's a lot.  But fear not!  I have tips for this too.

### Use a build tool!

They're not evil.  Grunt and Gulp are the current popular options.
You can grab most of this stuff from other projects.

Grunt:

 - official: [Grunt's example][7]
 - complex: [angularSails][6]
 - crazy: [React][5]

Gulp 

 - official: [Gulp's example][8]
 - (couldn't find any other good examples, email me!)

You can also do things like bump your bower/npm version numbers
using simple scripts.

```js
var fs = require('fs');
var package = JSON.parse(fs.readFileSync(__dirname + "/package.json"));
var bower = JSON.parse(fs.readFileSync(__dirname + "/bower.json"));

var parts = package.version.split(".").map(Number);

// change it to parts[1] for a minor version bump, etc.
parts[2] += 1;
var version = parts.join(".");

package.version = version;
bower.version = version;

fs.writeFileSync(__dirname + "/package.json", 
    JSON.stringify(package, null, 4));
fs.writeFileSync(__dirname + "/bower.json", 
    JSON.stringify(bower, null, 4));
```

Bam!  And now we have a checklist for our libraries.

Send me an email at `f.bagnardi@gmail.com` if you think something's
not quite right here, or you have any questions :-)


[1]: https://github.com/umdjs/umd
[2]: https://github.com/umdjs/umd/blob/master/returnExports.js
[3]: https://github.com/hughsk/envify
[4]: https://github.com/mishoo/UglifyJS

[5]: https://github.com/facebook/react/blob/master/Gruntfile.js
[6]: https://github.com/balderdashy/angularSails/blob/master/Gruntfile.js
[7]: http://gruntjs.com/sample-gruntfile

[8]: https://github.com/gulpjs/gulp/blob/master/README.md
