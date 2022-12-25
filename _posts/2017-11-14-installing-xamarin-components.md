---
layout: post
title: "Installing Xamarin components"
date: "2017-11-14"
categories: [net,visual-studio,visual-studio-for-mac,xamarin,xamarin-forms]
---

Xamarin components are easy to install, all you have to do is to download a zip, extract the content and to reference the dlls in your project. This would work if you download the component manually from components gallery. Same thing can be done using Visual Studio in a more robust way via 'Components' under the targeting platform projects. Either way, the component will be downloaded and installed only for a specific project.

Sometimes it might be useful to keep the component in cache, so it will be available globally. This is where the XAM file extension comes into play. Generally speaking, it is just an archive, you can change the file extension to zip and use it in a regular way, or vice versa change zip to xam.

Regardless of your OS you have to download [xamarin-component.exe](https://components.xamarin.com/submit/xpkg). On Windows execute the next command:

> xamain.component.exe install <component.xam>

On MacOS execute the next command with the same executable:

> mono xamain.component.exe install <component.xam>

If the command executed successfully, you should see the installed component:

![](/images/2017-11-14-installing-xamarin-components/1.png)

Please note the "Included in this project" and "Installed on this machine". Components under the second section will be always there unless you will clean the cache. On MacOS the components will be installed under '~/Library/Caches/Xamarin'. Please let me know where the cached components are stored on Windows.
