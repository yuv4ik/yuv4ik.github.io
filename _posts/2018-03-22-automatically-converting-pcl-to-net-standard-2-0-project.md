---
layout: post
title: "Automatically converting PCL to .NET Standard 2.0 project"
date: "2018-03-22"
categories: [.net,visual-studio-for-mac,xamarin-forms]
---

![](/images/2018-03-22-automatically-converting-pcl-to-net-standard-2-0-project/1.gif)

Every time you create a new Xamarin.Forms project  in Visual Studio for Mac you have to manually convert it to .NET Standard. The conversion is very straightforward and can be done with just a few steps:

{% gist 063a35fe3986e62d69aee2f0ed0607bf %}

Hopefully one day VS team will take care of it, till then, I decided to automate this process and created an add-in/extension for VS for Mac - [Mutatio](https://github.com/yuv4ik/Mutatio).

> **_Mutatio_** - in Latin means change, transformation or exchange.

`Mutatio` can convert newly created or existing projects. Please keep in mind that there might be `NuGet` packages that does not support .NET Standard 2.0, in this case you may see related exceptions.

In case you change your mind and you want to rollback, `Mutatio` is making a backup of all the files it modifying and deleting under the project's root directory within `mutatio_backup` folder. So all you have to do is to copy the files back to your project and reload the solution.

One of the biggest challenges I met while development was related to reloading the project after conversion. Within VS for Mac after manually modifying the `*.csproj` under the right click menu of the project there will appear a `Reload` option, however I didn't find a way to call this method programatically. Currently, the whole solution will be reloaded as a workaround. If you know how to solve the problem programatically I would really appreciate if you will share your knowledge by contributing or leaving a comment.

More details can be found on [GitHub](https://github.com/yuv4ik/Mutatio).
