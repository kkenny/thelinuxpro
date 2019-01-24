---
layout: post
title:  "RPM Package Management Using Pulp"
date:   2019-01-21 11:30:00 -0500
categories: yum rpm packages pulp centos linux
---

##Build a Server
For this post, I'm using a fresh install of CentOS 7 provisioned locally using Vagrant.

To do this, you need to have Vagrant installed and a provider, such as VirtualBox.

Here is a sample Vagrantfile you can use:
{% highlight ruby %}
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"

  config.vm.provision "shell", inline: <<-SHELL
    yum install -y net-tools lsof wget
  SHELL

  config.vm.provider :virtualbox do |vb|
    vb.gui = false
    vb.memory = "512"
    vb.cpus = "1"
  end

  config.vm.define "pulp-master-01" do |pm1|
    pm1.vm.network "private_network", ip: "10.0.0.2", netmask: "255.255.255.0"
    pm1.vm.hostname = "pulp-master-01"
    pm1.vm.box = "centos/7"
  end
end
{% endhighlight %}

###Provision

{% highlight bash %}
$ vagrant up
{% endhighlight %}

### Login
{% highlight bash %}
$ vagrant ssh pulp-master-01
{% endhighlight %}

### Housekeeping
First, let's update our server...
{% highlight bash %}
$ sudo bash -c "yum update -y && reboot"
{% endhighlight %}

### Log back in
{% highlight bash %}
$ vagrant ssh pulp-master-01
{% endhighlight %}

### Install and Configure Pulp
From here, I'll assume you've sudo'd to root.

#### Install Packages
{% highlight bash %}
$ yum install epel-release
$ cd /etc/yum.repos.d/
$ wget https://repos.fedorapeople.org/repos/pulp/pulp/rhel-pulp.repo
$ yum install -y mongodb-server \
qpid-cpp-server qpid-cpp-server-linearstore \
pulp-server python-gofer-qpid python2-qpid qpid-tools \
pulp-rpm-plugins pulp-puppet-plugins pulp-docker-plugins \
pulp-admin-client pulp-rpm-admin-extensions pulp-puppet-admin-extensions pulp-docker-admin-extensions
{% endhighlight %}

#### Generate keys/certs
{% highlight bash %}
$ pulp-gen-key-pair
$ pulp-gen-ca-certificate
{% endhighlight %}

#### Configure DB
{% highlight bash %}
$ sudo -u apache pulp-manage-db
{% endhighlight %}

#### Start Services
{% highlight bash %}
for service in mongod qpidd httpd pulp_workers pulp_celerybeat pulp_resource_manager; do
  systemctl start $service
  systemctl enable $service
done
{% endhighlight %}

### Admin Client
#### Configure Pulp Admin Client
Make the `[server]` section look more like this:
{% highlight %}
[server]
host: pulp-master-01
port: 443
api_prefix: /pulp/api
verify_ssl: False
{% endhighlight %}

#### Auth the Admin Client
Note: The default password is admin, you should change this!

{% highlight bash %}
$ pulp-admin login -u admin
{% endhighlight %}

### Repos
#### Create rpm repos
{% highlight bash %}
$ pulp-admin rpm repo create --repo-id centos-7-base-os --display-name "CentOS 7 Base OS" --description "Packages for CentOS Base OS" --feed http://mirror.centos.org/centos/7/os/x86_64 --serve-http true --serve-https true
$ pulp-admin rpm repo create --repo-id centos-7-base-updates --display-name "CentOS 7 Base Updates" --description "Updated Packages for CentOS Base OS" --feed http://mirror.centos.org/centos/7/updates/x86_64 --serve-http true --serve-https true
{% endhighlight %}

#### Sync rpm repos
{% highlight bash %}
$ pulp-admin rpm repo sync run --repo-id centos-7-base-os
$ pulp-admin rpm repo sync run --repo-id centos-7-base-updates
{% endhighlight %}

#### Publish
{% highlight bash %}
$ pulp-admin rpm repo publish run --repo-id centos-7-base-os
$ pulp-admin rpm repo publish run --repo-id centos-7-base-updates
{% endhighlight %}

### Validate
Time to validate your work.

{% highlight bash %}
$ curl http://localhost/pulp/repos
{% endhighlight %}




