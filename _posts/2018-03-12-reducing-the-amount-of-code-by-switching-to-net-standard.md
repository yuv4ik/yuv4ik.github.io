---
layout: post
title: "Reducing the amount of code by switching to .NET Standard"
date: "2018-03-12"
categories: [.net,xamarin-forms]
---

> What can feel better than writing a code? Of course deleting it!

There are many [good technical articles](https://docs.microsoft.com/en-us/dotnet/standard/net-standard) that explain why .NET Standard is great and why should we use it. My goal in this article is to demonstrate some benefits in practice.

If you didn't switch yet from `PCL` and `Shared Projects` to .NET Standard, I would highly recommend to do it. Most of the third party libraries are compatible and the [switch](https://gist.github.com/yuv4ik/063a35fe3986e62d69aee2f0ed0607bf) is usually painless. After switching to .NET Standard you could benefit from reducing the code size and the amount of "hacks". Let's take a look on few practical examples.

## System.IO

Official example of "[Saving and Loading Files](https://developer.xamarin.com/guides/xamarin-forms/application-fundamentals/files/#Loading_and_Saving_Files)" & "[Local Databases](https://developer.xamarin.com/guides/xamarin-forms/application-fundamentals/databases/)" is encouraging to use a platform specific implementations with almost the same code base, which was needed before .NET Standard. However, now it can be simplified. Platform specific implementations can be easily replaced by a single class in your Xamarin.Forms project:
{% highlight csharp %}
public class TextFileService {
  public void SaveText(string fileName, string message) => File.AppendAllText(GetStoragePath(fileName),$"{message}{Environment.NewLine}");
  public string LoadText(string fileName) => File.ReadAllText(GetStoragePath(fileName));
  string GetStoragePath(string fileName) => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), fileName);
}
{% endhighlight %}

## System.Security.Cryptography

In case of user authentication, some backends expect an encrypted password to be sent. Before .NET Standard times `System.Security.Cryptography` was not available in PCLs, so it was needed to find an alternative which usually led us to write an extra code. With .NET Standard it can be easily done with a single class in your Xamarin.Forms project:
{% highlight csharp %}
public class Md5Crypter { 
  public string Hash(string value) {
    var md5 = MD5.Create();
    var raw = Encoding.UTF8.GetBytes(value);
    var hash = md5.ComputeHash(raw);
    return BitConverter.ToString(hash).Replace("-", "");
  }
}
{% endhighlight %}

## System.Console

In PCL we had an on option  of `Debug.WriteLine` but it meant to be used only in debug builds. With .NET Standard we can simply use `Console.WriteLine` to log messages regardless of the build configuration. Therefore there is no need to implement platform specific LoggingService anymore unless you really mean it.

## Conclusion

.NET Standard brings many namespaces that were missing in PCLs back to game. We need to keep in mind that platform implementations can and should be replaced by a single class where possible. There are many more useful namespaces that I didn't get to mention in this article, therefore always check your options and don't follow blindly official and unofficial guides that got outdated.

P.S.: Please leave a comment with a namespace that you really missed in PCLs, I will try to accumulate your feedbacks and update this article accordingly.
