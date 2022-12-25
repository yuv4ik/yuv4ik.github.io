---
layout: post
title: "How to debug an iOS app build in Xamarin on a real device for free?"
date: "2017-03-05"
categories: [net,apple,ios,visual-studio-for-mac,xamarin]
---

"With Apple's release of Xcode 7 came an important change for all iOS and Mac developers–free provisioning."  
  
So all you need is an apple id and to configure your IDE.  
There are a lot of guides available out there, so this post is not going to be another one:  
\- [Xamarin Developer Guide](https://developer.xamarin.com/guides/ios/getting_started/installation/device_provisioning/free-provisioning/)  
\- [http://stackoverflow.com/a/32249026/1970317](http://stackoverflow.com/a/32249026/1970317)  
  
One thing that can be confusing is that first, you need to create a Xcode project with the same "Bundle Identifier" and then download the free provisioning profile. Just pay attention to the uniqueness of your bundle identifier otherwise, it won't work.
