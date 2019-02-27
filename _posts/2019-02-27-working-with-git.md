---
layout: post
title:  "Working with git"
date:   2019-02-27 11:35:00 -0500
tags: [git, repo, repository, source, code]
excerpt: "Git is a free and open source version control system that is distributed. Let's dive into the usage and fundamentals needed to get started with versioning your codebase."
categories: git
---

## What is git?
Git is a free and open source version control system that is distributed. Git does not operate under the "centralized" model, rather under a model that distributes source code, so that if there is a failure of the git server, copies still exist, and all is not lost.  There are many articles describing this in much more detail, so we'll focus on the usage of git instead.

## Install git

### Red Hat Based Distributions
{% highlight bash %}
sudo yum install git
{% endhighlight %}

### Newer Versions of Fedora
{% highlight bash %}
sudo dnf install git
{% endhighlight %}

### Debian Based Distributions
{% highlight bash %}
sudo apt-get update
sudo apt-get install git
{% endhighlight %}

## Initialize a Repo
It's important to realize that you don't have to have a remote repo to get started, your repo could exist only on your workstation.

### Create project folder and initialize
{% highlight bash %}
mkdir -p src/new_project
cd !?	#Pro Tip: !? is the last string of the previous command, in this case - src/new_project
git init
{% endhighlight %}

The `git init` command tells git to initialize this directory as a local git repository, adds the configuration files necessary to track and version the code within this directory.

### Add a README
{% highlight bash %}
echo 'Readme contents go here.' > README.md
{% endhighlight %}

### First commit
{% highlight bash %}
git add README.md
git commit -m "First Commit: Adding README file"
{% endhighlight %}

Whenever a file is created or modified, you must add it to be tracked in the current state of change.  Once you've added the file(s) you've created or changed, you will commit the change with the `git commit` command.


## Commits
`git commit` is establishing a point in time for a file (or set of files) that are to be tracked.  You can use these commits to revert back, or reference an older version of your code repository.

## .gitignore
This is a configuration file that git tracks to make sure you don't accidentally track files that shouldn't be tracked.

A couple examples:
- `.swp`
  - These files are swap files for VI, and shouldn't be tracked.  No one is going to want to know that you had a file open in VI when you committed your change and pushed it to a remote.
- `vendor`
  - A common directory found in ruby projects, where rubygems are installed to support servicing your project, whether for local development or production workloads.  These installed gems should not be living in a remote git repository.

## Coming Soon...
- Working with git remotes
- Branching and Forking with git
- Release Branching in git
- Git hooks
- Resolving conflicts in git

## Resources
[git-scm](https://git-scm.com/)

