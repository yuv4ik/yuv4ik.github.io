---
layout: post
title: "Though about optimisation of work with XAML in Xamarin.Forms"
date: "2017-04-02"
categories: [visual-studio-for-mac,xamarin,xaml]
---
What is great about Xamarin.Forms? XAML of course! Especially if you are familiar with it from WPF / Silverlight times. However, the experience with XAML in Xamarin.Forms is totally different. Unfortunately, you will not have such a great intellisense, by default you will have to discover typos in XAML at runtime, no visual editor (yet) and without preview. I have been using VS 2017 on Windows and VS For Mac on macOS, in both cases problems listed above exists.

There are a lot of threads on stackoverflow about these problems and I am repeating myself, again and again, so I decided to write a post about it. I don't have a magic solution, just a few tricks and a though.

If you are already familiar with XAML and Xamarin.Forms and you don't care that much about intellisence you can turn on XAML compilation to catch the typos at compile time.  
You can enable it at the assembly level, by adding the next line of code to your AssemblyInfo.cs:

```
[assembly: XamlCompilation(XamlCompilationOptions.Compile);
```

Or turn XAML compilation at the class level, just the next line above class declaration:  

```
[XamlCompilation (XamlCompilationOptions.Compile)];
```

More detailed information can be found [here](https://developer.xamarin.com/guides/xamarin-forms/xaml/xamlc/).  
  
FYI: If you set the BindingContext inside XAML you may meet this [bug](http://stackoverflow.com/questions/42771108/xamarin-forms-viewmodellocator-get-called-twice).  
  
Remember that all you do in XAML is compiled to code in the end. That means that if the IDE is not working that great with XAML for Xamarin.Forms at this time, you can write everything in plain C#!  
Sounds weird, however, all the problems listed above will be solved - except preview. But I find it attractive enough to try. Defining your UI layout in code behind will not violate any of MVVM principles as far as it's not going to include any business logic.  
  
If you know any other tricks please share.  
Have a nice week.
