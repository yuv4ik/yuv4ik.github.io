---
layout: post
title: "JSON.net Mastering enums"
date: "2017-03-21"
categories: [net,c#,json-net,xamarin]
---
### Problem
Legacy backend API endpoint returns JSON with units in an uncommon manner.  
Instead of returning the measurement system "imperial" or "metric" it returns "kgs" or "lbs".  

### Goal
Using JSON.net deserialize & serialize "kgs" to "metric" and "lbs" to "imperial" in our front-end app.  

### Solution
The solution is pretty simple. We have to define an enum, with "EnumMember" attributes on each element and use "StringEnumConverter" as preferred JsonConvertor. Here is the full and working example:  

{% highlight csharp %}
using System;  
using System.Runtime.Serialization;  
using Newtonsoft.Json;  
using Newtonsoft.Json.Converters;  
  
namespace JSONnetEnums  
{  
    class Program  
    {  
        static void Main(string\[\] args)  
        {  
            var deserializedObj =   
                JsonConvert.DeserializeObject<Foo\>("{\\"Unit\\":\\"kgs\\"}");  
            Console.WriteLine(deserializedObj.Unit);  
            // Output: Metric  
  
            var serializedObj =   
                JsonConvert.SerializeObject(new Foo { Unit = Unit.Imperial });  
            Console.WriteLine(serializedObj);  
            // Output: {"Unit":"lbs"}  
        }  
    }  
  
    class Foo  
    {  
        public Unit Unit { get; set; }  
    }  
  
    \[JsonConverter(typeof(StringEnumConverter))\]  
    enum Unit  
    {  
        \[EnumMember(Value = "kgs")\]  
        Metric,  
        \[EnumMember(Value = "lbs")\]  
        Imperial  
    }  
}
{% endhighlight %}