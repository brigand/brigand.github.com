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

{% highlight html %}
<h1 data-text="title"></h1>
<input data-value="title" />
<ul data-each="items">
    <li data-text="this"></li>
</ul>
{% endhighlight %}
