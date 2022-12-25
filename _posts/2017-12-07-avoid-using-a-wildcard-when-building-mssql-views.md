---
layout: post
title: "Avoid using a wildcard (*) when building mssql views"
date: "2017-12-07"
categories: [sql]
---

Using a wildcard while building a View can be very convenient if you have to return all the columns from a table:

> CREATE VIEW View\_Fruit AS SELECT f.\* FROM \[dbo\].\[MyFruitsDb\].\[Fruit\] as f WHERE DeletedAt IS NULL

Seems legit and easy, however there is one thing to keep in mind, just because you are using a wildcard does not mean that your View will be automatically updated when your table schema is changed. In other words, if you will add one additional column on \[dbo\].\[Fruit\] table, you will have to regenerate the view, by simple replacing CREATE by ALTER in the T-SQL script demonstrated above in order to include this new column in the view.

Depends on your development cycle, you may prefer replacing the wildcard by a list of the columns you want to return. This way when you will compare your development DB to staging or production DB schemas you will see that you forgot to add a new column, otherwise schema comparison will results a 0 changes. Tricky.

As a rule of thumb I would avoid using wildcards, as life shows it may take time to discover that a wildcard is used in a View and that it has to be regenerated in order to solve an unexpected bug.
