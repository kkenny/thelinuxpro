---
layout: page
title: About
permalink: /about/
---

{% highlight bash %}
$ whoami
> Kameron Kenny
{% endhighlight %}

I am a proven asset with the ability to think outside the box, stay ahead of the cuve, and lead teams that will improve business process and functionality. I am very passionate for having high impact on more than people's career, but their lives as a whole.  I deep dive into problems and challenge people and teams to use innovative thinking that not only solves the problem, but prevents future recursion. As a person with years of experience contributing to technical solutions and leading teams, my knowledge is in depth and covers a wide array of topics.

My current focus is leading a large distributed team on a journey into Infrastructure as Code.  I can't wait to see the growth of those around me as we embark on this journey together.

### Favorite Books
{% for book in site.favorite_books %}
---
[{{ book.name }}]({{ book.url }}) <br />
_[{{ book.subtitle }}]({{ book.url }})_ <br />
By: {{ book.author }}
{% endfor %}

### Currently Reading
---
{% for book in site.currently_reading %}
[{{ book.name }}]({{ book.url }}) <br />
_[{{ book.subtitle }}]({{ book.url }})_ <br />
By: {{ book.author }}
{% endfor %}


