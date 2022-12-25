---
layout: post
title: "Web.API 2 centralised model state validation"
date: "2017-08-23"
categories: [.net,asp-net,c#,web-api-2]
---

Model state validation is easy with [DataAnnotations](https://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations(v=vs.110).aspx). However, you will find repeating the next line of code very soon:

> ... if(!ModelState.IsValid) return BadRequest(..); ...

Luckily, there is a pretty simple solution - to use [ActionFilter](https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions-1/controllers-and-routing/understanding-action-filters-cs):

{% gist 2bfc53bdfa22926fb016b63100e38596 %}

All you have to do is to add the ValidateModel attribute to your controller methods that require model state validation.
