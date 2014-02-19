TURTED_node
===========

node.js implementation of a universal real time event dispatcher

Basic idea:
-----------

Create an abstraction protocol for handling real time connections to push events from server to client.
Users can log in and join channels so the server can push messages to selected clients (via username or channel)

Heavily inspired by the work of the http://ape-project.org and based on my implementations back in 2011 on this topic
(see http://de.slideshare.net/Xosofox/real-time-event-dispatcher)

Why?
----

Looks like a basic chat application is the first thing everybody implements when playing with nodejs and sock.js, but
I did not really find a library out there taking the load of the dev when you need a little bit more funtionality.

Especially handling channels and providing a clean and operational client interface is the target of this project

[![Build Status](https://travis-ci.org/TURTED/TURTED_node.png?branch=master)](https://travis-ci.org/TURTED/TURTED_node)
