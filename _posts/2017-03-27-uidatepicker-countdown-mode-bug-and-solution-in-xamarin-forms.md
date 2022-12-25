---
layout: post
title: "UIDatePicker Countdown mode bug and solution in Xamarin.Forms"
date: "2017-03-27"
categories: [net,c#,ios,xamarin]
---
### Problem
Show hh:mm:ss picker on iOS using Xamarin.Forms.

### Goal
Extend Picker view in order to achieve the next result:

![](/images/2017-03-27-uidatepicker-countdown-mode-bug-and-solution-in-xamarin-forms/1.png)

### Solution
First I tried to keep it simple: to give up on seconds and use UIDatePicker in UIDatePickeCountDownMode. So the end result will look like this:  

![](/images/2017-03-27-uidatepicker-countdown-mode-bug-and-solution-in-xamarin-forms/2.png)

I achieved it by extending the DatePicker and it's DatePickerRenderer and changing the mode as described above. However, I discovered that 'datePickerValueChanged' is being called only on a second iteration with the values. The issue was successfully reproduced in Swift, so it's not a Xamarin bug. The Swift version can be found [here](https://gist.github.com/yuv4ik/14f8ae612020daaa3c4b0d2b3e9f2ba9).

After spending some time understanding the issue described above, I found an example on [StackOverflow](http://stackoverflow.com/questions/35931470/timepicker-with-seconds/35954206#35954206), thanks to Mathieu who shared his solution. His example was based on [XLabs](https://github.com/XLabs/Xamarin-Forms-Labs), so I removed the dependency and shared it with the community.

The code can be found on [GitHub](https://gist.github.com/yuv4ik/c7137c4ea89ededa99dfee51bfb1de4e).