---
layout: post
title:  "Testing for Chef Deprecations Using Foodcritic
date:   2019-02-13 16:15:00 -0500
categories: chef testing foodcritic
---

Chef Client is on a monthly release cycle with new releases on the first Wednesday of each month. With new releases, deprecations should be paid attention to so that our cookbooks do not become stale and eventually break.

One way to do this is to use [Foodcritic](http://www.foodcritic.io/), which comes with the [Chef Development Kit](https://downloads.chef.io/chefdk).

## Testing Method
Foodcritic uses tags to determine what it's going to test.  The tag we'll be interested in is `deprecations`.  Let's write a small script to test our cookbooks against deprecations.

- Change to the directory that holds your cookbooks.
- Create a new file called `test-deprecations.sh` and add the following contents to it:


{% highlight bash %}
#!/bin/bash

log_file='deprecations.log'
> $log_file

for cookbook in `ls -d */`; do
  printf "${cookbook}\n=================" | tee -a $log_file
  chef exec foodcritic -t deprecated ${i} | tee -a $log_file
  printf "\n" | tee -a $log_file
done
{% endhighlight %}

This will:
- Itterate over all the directories in the current directory
- Assume they're cookbooks
- Execute the `deprecations` Foodcritic tests
- Print the results to the screen
- Log them to a file for later analysis
