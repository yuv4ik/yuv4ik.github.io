---
layout: post
title: "Anatomy of Code snippets in Visual Studio for Mac"
date: "2018-11-28"
categories: [.net,c#,visual-studio-for-mac,xamarin-forms]
---

Code snippet is a shortcut that can be used to generate a code from a specific template. Example of a built-in code snippet:

Type `cw` and double press the `Tab` key will result in `Console.Writeline();`

Thats a pretty simple example, however we pressed only 4 keys instead of 19 (ignoring the autocompletion of IntelliSense). In more advanced cases it might be a code snippet to generate a `BindableProperty` or a simple property in a `ViewModel` that should notify the binding engine about updates. Sounds like we can increase our performance by letting the code snippets generate boring repetitive code for us.

Visual Studio for Mac is shipped with a [default code snippets](https://docs.microsoft.com/en-us/visualstudio/ide/visual-csharp-code-snippets?view=vs-2015) that can be used as a great example. Let's take a look on the `cw` code snippet. First let's open the editor by clicking on `Visual Studio` > `Preferences` > `Text Editor` > `Code Snippets`. Now select the `cw` code snippet under `C#` group:

![](/images/2018-11-28-anatomy-of-code-snippets-in-visual-studio-for-mac/1.png)

#1. `Shortcut` - is the shortcut we have to type in order to generate the code from the template. In this example it is `cw` (Console.WriteLine).<br />
#2. `Group` - there are different available groups including F#, Python and Razor.<br />
#3. `Variables` - on the screenshot `#3` appear twice to demonstrate the definition of the `$SystemConsoleWriteLine$` variable and its properties.<br />
#4. `Default` - stands for the default value of the variable. Please note that in order to avoid confusion we should also provide a namespace.<br />
#5. `Function` - we can apply built-in functions like `GetSimpleTypeName("System#Console.WriteLine")`. It will make sure to remove the namespace before `Console.WriteLine` if `using System` is already in place otherwise it will use the default value (#4). The list of supported functions can be found [here](https://github.com/mono/monodevelop/blob/master/main/src/core/MonoDevelop.Ide/MonoDevelop.Ide.CodeTemplates/ExpansionObject.cs#L268).<br />

The template is just a `XML` file that live in `~/Library/VisualStudio⁩/{version}/Snippets` directory, which means that you can easily import and export code snippets that you create.

Earlier today I created a [GitHub repository](https://github.com/yuv4ik/vsmac_code_snippets) with a couple of handy code snippets for Visual Studio for Mac and especially for Xamarin. You are welcome to check and contribute by sharing your own code snippets!
