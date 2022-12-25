---
layout: post
title: "Xamarin Forms SQLite-net PCL nuget package failing to install"
date: "2017-03-15"
categories: [nuget,xamarin]
---

Following [Local Databases Xamarin guide](https://developer.xamarin.com/guides/xamarin-forms/application-fundamentals/databases/) in order to add SQLite database to a Xamarin Forms project I spent quite some time on adding the "SQLite.Net PCL" nuget package. It failed with the next message:

_Could not install package 'System.Runtime.InteropServices.RuntimeInformation 4.0.0'. You are trying to install this package into a project that targets '.NETPortable,Version=v4.5,Profile=Profile111',
but the package does not contain any assembly references or content files that are compatible with that framework. For more information, contact the package author._  

The solution is pretty easy, you just have to install "System.Runtime.InteropServices.RuntimeInformation" before installing "SQLite.Net PCL" nuget package.  
  
More details can be found [here](https://github.com/dotnet/corefx/issues/10445#issuecomment-264929319).
