---
layout: post
title: "The ultimate guide to Emojis &#129337;&#8205;&#9794;&#65039;"
date: "2018-04-07"
categories: [android,c#,ios,xamarin-forms,xaml]
---
iOS | Android
![](/images/2018-04-07-the-ultimate-guide-to-emojis/1.png) | ![](/images/2018-04-07-the-ultimate-guide-to-emojis/2.png)

It is very common nowadays to express ourselves by using emojis. Instead of typing few words, we prefer to send one emoji that will express our feelings and emotions. Not sure that the other side will always get what we mean by sending a 🧞 , but that is another story.

In this article we will learn:

1.  How to use emojis in static content like Labels and Buttons
2.  How to define and use emoji in XAML only
3.  How to define and use emoji using C#

### Emoji?

Emoji is represented by a single unicode character or a specific sequence of unicode characters.

Example: 🤔 is represented by `U+1F914`.

In case you wonder about the format the [Unicode Preface](http://www.unicode.org/emoji/charts/full-emoji-list.html) briefly explains it:

> ..an individual Unicode value is expressed as U+nnnn, where nnnn is a four-digit number in hexadecimal notation..

In case of sequence, concat all the unicode characters without spaces. Some emojis use [U+200D ZERO WIDTH JOINER](https://en.wikipedia.org/wiki/Zero-width_joiner) between emoji to make them behave like a single, unique emoji character.

Example: 👨‍⚕️ is represented by `U+1F468​ U+200D U+2695 U+FE0F`

`U+1F468` - man👨 <br />
`U+200D` - ZWJ <br />
`U+2695` - medical symbol ⚕  <br />
`U+FE0F` - [variation selector](https://www.unicode.org/charts/PDF/UFE00.pdf)

The full list of emojis can be found [here](http://www.unicode.org/emoji/charts/full-emoji-list.html).

### Emoji in XAML

Since XAML  is an XML-based markup language, we have to use XML escape character `&#;` and we have to replace `U+` prefix by `x` for each part of our emoji :
{% highlight xml %}
<!-- 🤹‍♂️ -->
<x:String x:Key="emojiManJuggling">&#x1F939;&#x200D;&#x2642;&#xFE0F;</x:String>
{% endhighlight %}

Example:
{% highlight xml %}
<Label Text="{StaticResource emojiManJuggling}" />

<!-- Alternative, without resources -->
<Label Text="&#x1F939;&#x200D;&#x2642;&#xFE0F;" />
{% endhighlight %}

If you need just a couple of emojis you may want to simply define all of them in XAML without involving any C# code at all.

### Emoji in C#

Let's define a class that will represent emoji:
{% highlight csharp %}
public class Emoji {
  readonly int[] codes;

  public Emoji(int[] codes) {
    this.codes = codes;
  }
  
  public Emoji(int code) {
    codes = new int[] { code };
  }
  
  public override string ToString() {
    if (codes == null)
      return string.Empty;

    var sb = new StringBuilder(codes.Length);
    foreach (var code in codes)
      sb.Append(Char.ConvertFromUtf32(code));

    return sb.ToString();
  }
}
{% endhighlight %}
It requires a single unicode character or sequence of characters as an input and simply overrides the `ToString` . Please note that `U+` prefix should be replaced with `0x` to specify hexadecimal notation.

Example of usage:
{% highlight csharp %}
// person biking => http://www.unicode.org/emoji/charts/full-emoji-list.html#1f6b4
Emoji bikingEmoji = new Emoji(0x1F6B4); // 🚴

// man technologist => http://www.unicode.org/emoji/charts/full-emoji-list.html#1f468_200d_1f4bb
Emoji manTechnologiest = new Emoji(new int[] { 0x1F468, 0x200D, 0x1F4BB }); // 👨‍💻
{% endhighlight %}
Example:
```
$"I am going to {bikingEmoji}!"
```
### Conclusion

There are 2789 emojis available at the moment and this number is still in growth. Using emojis we can add more colours and a personal touch to our applications. So why not to use them 🤓?

The source code is available on [github](https://github.com/yuv4ik/XFEmojiExample).

**P.S.:** **Please keep in mind that Apple may reject applications using emojis as part of UI, more information can be found [here](https://9to5mac.com/2018/02/02/apple-rejecting-apps-with-emoji/) and [here](https://blog.emojipedia.org/apples-emoji-crackdown/)**.
