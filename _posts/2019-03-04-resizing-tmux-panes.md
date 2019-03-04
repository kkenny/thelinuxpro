---
layout: post
title:  "Resizing tmux panes"
date:   2019-03-04 10:30:00 -0500
tags: [linux, tmux, terminal, resize]
excerpt: "By default, when you split the current pane, it will always split into two panes of equal size.  Sometimes it could be desired to have one pane larger than"
categories: tmux
---

By default, when you split the current pane, it will always split into two panes of equal size.  Sometimes it could be desired to have one pane larger than the other, so let's dive into resizing the panes.

Start by hitting your prifix (mine is `Ctrl + b`) followed by a `:` to enter command mode.  You'll notice the prompt at the bottom of your terminal window.

Follow the resource below to resize your pane left, right, up, or down, and by more than one cell at a time if you wish.

{% highlight bash %}
:resize-pane -D (Resizes the current pane down)
:resize-pane -U (Resizes the current pane upward)
:resize-pane -L (Resizes the current pane left)
:resize-pane -R (Resizes the current pane right)
:resize-pane -D 10 (Resizes the current pane down by 10 cells)
:resize-pane -U 10 (Resizes the current pane upward by 10 cells)
:resize-pane -L 10 (Resizes the current pane left by 10 cells)
:resize-pane -R 10 (Resizes the current pane right by 10 cells)
{% endhighlight %}

