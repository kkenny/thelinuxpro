---
layout: post
title:  "Building Simple RPM Packages"
date:   2019-09-23 15:00:00 -0400
tags: [linux, rpm, packaging, rpmbuild]
excerpt: "A very simple exercise to build a basic RPM package"
categories: linux rpm packaging
---

A very simple exercise to build a basic RPM package.  We're not going to dive into package signing, or some of the lower level topics of packaging RPM's - rather, our objective for now is to simply generate a file and drop it on the filesystem.

In this case, we don't care about the platform, the OS release, or the architecture.

## Install dependencies

{% highlight bash %}
$ yum install gcc rpm-build \
  rpm-devel rpmlint make python \
  bash coreutils diffutils patch \
  rpmdevtools
{% endhighlight %}

## Sample Spec File

{% highlight bash %}
Name:           local-release
Version:        2019.09
Release:        8
Summary:        local patching cycle release
License:        GPL
URL:            https://example.com
BuildArch:      noarch

%description
Local release: 2019.09.2

%build
cat > local_release <<EOF
2019.09.8
EOF

%install
install -m 0775 -d $RPM_BUILD_ROOT/etc
install -m 0644 local_release $RPM_BUILD_ROOT/etc/local_release

%clean
rm -rf $RPM_BUILD_ROOT

%files
/etc/local_release

%doc
%changelog
* Mon Sep 23 2019 Linux Team <linux-team@example.com>
- Release cycle 2019.09
{% endhighlight %}

Save this file as `local-release.spec`

## Setup build tree
{% highlight bash %}
$ rpmdev-setuptree
{% endhighlight %}

This will result in a structure like this:
{% highlight bash %}
$ tree rpmbuild/

rpmbuild/
├── BUILD
├── BUILDROOT
├── RPMS
├── SOURCES
├── SPECS
└── SRPMS

{% endhighlight %}

## Build the RPM
{% highlight bash %}
$ rpmbuild -ba local-release.spec
{% endhighlight %}

This will result in:
{% highlight bash %}
rpmbuild/RPMS/noarch/local-release-2019.09-8.noarch.rpm
{% endhighlight %}

## Install & Validate
{% highlight bash %}
$ yum localinstall rpmbuild/RPMS/noarch/local-release-2019.09-8.noarch.rpm
$ cat /etc/local_release
{% endhighlight %}
