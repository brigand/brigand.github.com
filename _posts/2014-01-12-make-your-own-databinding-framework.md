---
layout : post
title : Make Your Own Data-binding Framework
---

There are literally dozens of options that are used by many people, each!  Why
the hell would you want to add another to that list?  Well, we'll take it
from an educational angle, and make something we don't really intend to use
on many projects (unless you want to, and then go ahead).

### The basics

To start things off, we need to know what a "data-binding framework" is.

Simply put; it allows you to have data, and to have a DOM based presentation of that data,
and keep them in sync without them worrying too much about the other.

### Plan!

I find the most important step in creating something like this, is to pretend
it's already done, and actually use it.  So in our framework this is how the
code looks:

This is our simple TODO list's HTML.

{% highlight html %}
<h1 data-text="title"></h1>
<input data-value="title" />
<ul data-each="items">
    <li>
        <input data-value="done" type="checkbox" />
        <input data-value="text" type="text" />
    </li>
</ul>

<button data-click="addItem()"></button>
{% endhighlight %}

And the JavaScript for this:

{% highlight js %}
var thing = {
    title: "The title",
    items: [
        {
            done: false,
            text: "Make data-binding framework"
        }
    ],
    addItem = function(){
        thing.items.push({done: false, text: ""});
    }
};

simplebind.bind(thing, document.body);
{% endhighlight %}

One more important part is the data-whatever bindings.  We want
to have an easy way to write the basic ones internally, and allow our
hypothetical users to add their own.

The basic functionality we need is:

 - a callback for changes to the data (from the user's JavaScript)
 - a way to set the data
 - the element the data-whatever attribute is on

I think this is a good way to write these:

{% highlight js %}

simplebind.bindings.value = function(element, set, get){
    element.addEventListener("keypress", function(e){
        var val = get();

        // update the value based on the current type
        if (typeof val === "number") {
            set(Number(element.value));
        }
        else if (typeof val === "boolean") {
            set(Boolean(element.value));
        }
        else {
            set(element.value);
        }
    });

    // this is called when the value is updated in the user's JavaScript
    return function(newValue){
        element.value = String(newValue);
    };
};

{% endhighlight %}

