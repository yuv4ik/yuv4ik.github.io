---
layout: post
title: "JSON.net snake case notation naming strategy"
date: "2017-03-14"
categories: [net,c#,json-net,xamarin]
---

Communicating with backend in JSON can be challenging.  
In case of C# model which by convention should be in CamelCase notation and backend which is using snake\_notation we can easily solve the problem with [Json.NET](http://www.newtonsoft.com/json).  
  
For example, we have the next model:  
  
{% highlight csharp %}
public class Model  
{  
  public string FooBar { get; set; }  
}
{% endhighlight %}
  
and we want it to be serialised to: { "foo\_bar": "" }  
We could use an attribute:  
  
{% highlight csharp %}
\[JsonProperty(PropertyName = "foo\_bar")\]  
public string FooBar { get; set; }
{% endhighlight %}

That will work, however, if we want to generalise this strategy we should create a [JsonSerializerSettings](http://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonSerializerSettings.htm) with [DefaultContactResolver](http://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Serialization_DefaultContractResolver.htm) which is using [SnakeCaseNamingStrategy](http://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Serialization_SnakeCaseNamingStrategy.htm) and to use it while serialisation/deserialization:  
  
{% highlight csharp %}
public class JsonCoverter : IJsonConverter
{  
 private static JsonSerializerSettings defaultJsonSerializerSettings = 

new JsonSerializerSettings
 {  
  ContractResolver = new DefaultContractResolver  
  {  
   NamingStrategy = new SnakeCaseNamingStrategy()  
  }  
 };  
      
 public T Deserialize(string json) =>  
  JsonConvert.DeserializeObject(json, defaultJsonSerializerSettings);  
        
 public string Serialize(object obj) =>  
  JsonConvert.SerializeObject(obj, defaultJsonSerializerSettings);  
     
}
{% endhighlight %}

Using the JsonConverter globally will solve the different notation problem.
