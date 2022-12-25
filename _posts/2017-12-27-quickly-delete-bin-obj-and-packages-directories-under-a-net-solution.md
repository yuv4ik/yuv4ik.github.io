---
layout: post
title: "Quickly delete \"bin\", \"obj\" and \"packages\" directories under a .NET solution"
date: "2017-12-27"
categories: [.net,visual-studio-for-mac,xamarin-forms]
---

Recently had to update some old Xamarin.Forms project to the latest and greatest XF and very quickly I realised that it is not going to be an easy task, since I had to manually manipulate the csproj files to remove the old nuget dependencies. I found myself going thru multiple projects multiple times in order to delete the "bin", "obj" & "packages" directories to fix the miscellaneous build errors and I came up with a very simple script to recursively delete delete the "bin", "obj" & "packages" directories:

{% gist aedfefca352db3f149fbcb81762db847 %}

**Backup your code before using this script, I am not responsible for any data loss. Please use it wisely.**

To use this script: open a terminal in your solution's root directory and copy paste the script above. Keep in mind that "bin" & "obj" directories will be regenerated after the next build, however "packages" directory will appear again only after restoring nuget packages for the solution.
