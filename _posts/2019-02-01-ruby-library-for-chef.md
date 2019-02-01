---
layout: post
title:  "Ruby Library for Chef"
date:   2019-02-01 16:30:00 -0500
categories: chef libraries ruby
---

One of the things that we can do to eliminate waste in code is to use libraries or functions so that we are not writing the same code over and over.  This practice has many benefits, including:
1. Less typing
2. Consistency
3. Smaller file sizes
4. And more...

## Exploring the cookbook
First, let's create a new cookbook.
{% highlight bash %}
$ chef generate cookbook test
{% endhighlight %}

Change to the directory inside your new cookbook, and list the files

{% highlight bash %}
$ ls
> Berksfile  CHANGELOG.md  chefignore  LICENSE  metadata.rb  README.md  recipes  spec  test
{% endhighlight %}

The folder we need doesn't exist yet, so let's create it:

{% highlight bash %}
$ mkdir libraries
{% endhighlight %}

## Create a Library
For this post, we'll create a very simple library that will check the mtime (last time the file was modified, or `touched`)

Create a new file called `mtime.rb` in the `libraries` directory and add this to it:

{% highlight ruby %}
def file_age(name)
  (Time.now - File.mtime(name))/(24*3600)
end
{% endhighlight %}

This code simply accepts a file name, then calculates it's age in days.

## Use Your Library
Let's say we want Pulp to sync a repo every seven days...
Create an attribute for the cadance by putting the following into `attributes/default.rb`

{% highlight ruby %}
default['pulp-mirror']['sync']['cadence']       = 7       #In Days
{% endhighlight %}

Then put in your recipe the following line attached to a code block:

{% highlight ruby %}
  action :sync if file_age("#{Chef::Config['file_cache_path']}/#{bag['id']}.sync") > node['pulp-mirror']['sync']['cadence']
{% endhighlight %}

Like this:

{% highlight ruby %}
pulp_rpm_repo bag['id'] do
  display_name bag['display_name']
  description bag['description']
  feed bag['feed']
  http bag['serve_http']
  https bag['serve_https']
  pulp_cert_verify false
  relative_url bag['relative_url']
  action :sync if file_age("#{Chef::Config['file_cache_path']}/#{bag['id']}.sync") > node['pulp-mirror']['sync']['cadence']
end
{% endhighlight %}


