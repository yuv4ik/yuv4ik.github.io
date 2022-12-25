---
layout: post
title: "Android emulators stopped working on macOS 10.13 (High Sierra)"
date: "2017-12-12"
categories: [.net.android,xamarin,xamarin-forms]
---

Recently I updated my macOS to High Sierra however this broke my android emulators. Non of them started and logs showed something like:

> Failed to open vm 3 Failed to create HAX VM No accelerator found. failed to initialize HAX: Invalid argument

As the logs states there is a problem with HAXM, and to be more specific a time for update has come. To solve the issue simply download the latest and greatest version of [HAXM](https://software.intel.com/en-us/android/articles/intel-hardware-accelerated-execution-manager-end-user-license-agreement-macosx) and restart your mac.
