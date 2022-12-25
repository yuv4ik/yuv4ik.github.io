---
layout: post
title: "How to access localhost from Android emulator and iOS simulator?"
date: "2018-03-03"
categories: [android,ios,xamarin-forms]
---

Being lucky to develop a backend and a Xamarin.Forms clients on your own? Sooner or later you will have to debug the API calls and it might become painful. Unless, you will follow the next rules:

1. Configure your API URL to run on 127.0.0.1 instead of a localhost:
    
    > // .NET Core Web.Api example public static IWebHost BuildWebHost(string\[\] args) => WebHost.CreateDefaultBuilder(args) .UseStartup<Startup>() .UseUrls(“http://127.0.0.1:5001“) .Build();
    
2. Configure your Xamarin.Forms API consumer to have a conditional URL base:
    
    > string apiUrl = null; if (Device.RuntimePlatform == Device.Android) apiUrl = “http://10.0.2.2:5001/api“; else if (Device.RuntimePlatform == Device.iOS) apiUrl = “http://localhost:5001/api“; else throw new UnsupportedPlatformException();
    

The problem with Android emulator is that it maps 10.0.2.2 to 127.0.0.1, not to localhost. However, the iOS Simulator uses the host machine network.

That should be it! Happy debugging!
