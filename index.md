---
layout: default
---

# Posts
{% for post in site.posts %}
---
### [{{ post.title }}]({{ post.url | prepend: site.baseurl }})
  {{ post.date | date: "%b %-d, %Y" }}

  {{ post.excerpt }} _[...continue reading]({{ post.url | prepend: site.baseurl }})_
{% endfor %}
