---
layout: post
title: "Converting JSON file to a SQLite database"
date: "2018-02-21"
categories: [json-net,sqlite]
---

When it comes to a data storage for your application, there are multiple options. Depends on your needs you may choose a JSON file or a proper SQLite database. Some times you may need to convert a JSON to SQLite DB and that is the topic of the current post.

First idea that you may get is to solve the problem in code. Well, we are developers and we are best in it after all. However, [SQLite CLI](https://sqlite.org/cli.html) is powerful enough to solve our issue or at least to solve it partly. SQLite CLI supports multiple data sources but not JSON. We will have to convert JSON to CSV and depending on the data structure it could be complex or an easy task to do. Here you could write some code or use an existing solutions (google it) in order to make the conversion happen.

The interesting part is the data import itself and it's pitfalls. I had to replace a ',' separator by "\|" since the SQLite CLI ignored my quoted nested commas. Another thing to keep in mind that leading and trailing spaces are not ignored and they are a part of the value. You can define the table scheme before the import or alter it after the import, depends on your needs. For doing it before you just have to create a table manually, otherwise you will have to use the SQLite CLI or a SQLite browser to alter an auto-generated table.

Let's take a look on a simple case where we will import a CSV file with a custom separator without defining the table scheme before the import. CSV contents:

> A|B|C
> 
> 1|2|3
> 
> 4|5|6

SQLite CLI:

> sqlite3 dummy.db
> 
> SQLite version 3.19.3 2017-06-27 16:48:08
> 
> Enter ".help" for usage hints.
> 
> sqlite> .mode csv
> 
> sqlite> .separator |
> 
> sqlite> .import dummy.csv ABC
> 
> sqlite> select \* from ABC;
> 
> 1|2|3
> 
> 4|5|6
> 
> sqlite>

As you see it is quite simple. The first argument is the output file, in our case it is a "dummy.db". The rest are basically dot-commands that define the input mode "csv", the separator "\|", the data source "dummy.csv" and the table name to import the data  to "ABC".

It is very easy and intuitive to use. I would recommend to get familiar with the SQLite CLI just to know what it is capable of in order to save your time and nerves.
