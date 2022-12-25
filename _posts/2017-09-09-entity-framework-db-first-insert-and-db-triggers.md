---
layout: post
title: "Entity Framework DB First and Computed Columns"
date: "2017-09-09"
categories: [.net,c#,entity-framework, sql]
---

Imagine you have a lovely DB first approach in place. There is a table "Fruits" with a column "WikiLink". This column is getting populated on insert, using a trigger on the DB level. Can you spot "the" problem here?

Let's try to understand how EF returns the DB generated entity Id from the DB right after the insert. The code below demonstrates a standard way to insert a new entity with EF:

> var fruit = new Fruit { Family = "Rosaceae", Name = "Apple" }; dbContext.Fruits.Add(fruit); await dbContext.SaveChangesAsync(); // fruit.Id is auto-generated on the DB level and accessible after insert // fruid.WikiLink is null

The Id column marked as identity, therefor it is recognised as a value generated on DB level. If you will use a DB profiler you will actually see:

> \-- T-SQL Pseudocode for -> dbContext.Fruits.Add(fruit); INSERT INTO \[dbo\].\[Fruits\] (Family, Name) VALUES ("Rosaceae", "Apple") SELECT SCOPE\_IDENTITY() as Id;

It is insert and select in one query. Now back to our problem with 'WikiLink'. What we would like to achieve is:

> INSERT INTO \[dbo\].\[Fruits\] (Family, Name) VALUES ("Rosaceae", "Apple") SELECT SCOPE\_IDENTITY() as Id, WikiLink;

When you use a code first approach, you have an option of explicitly marking an entity's property as db generated with an attribute:

> \[DatabaseGenerated(DatabaseGeneratedOption.Computed)\] public string WikiLink { get; set; }

However, with DB first approach you don't have that option, and since there is a trigger behind this column, there is no way for EF to understand that it is generated on the DB level.

Unfortunately, it is not easily solvable with DB first approach. There are a couple of workarounds we could think about:

1. We can try to manipulate "manually" the auto-generated edmx file and set the "WikiLink" to db computed. Which is a bad idea, because this change will get lost with the next model update as it is being regenerated on each change.
2. Another option will be to query the DB right after the insert, to get the full row data:

> var fruit = new Fruit { Family = "Rosaceae", Name = "Apple" }; dbContext.Fruits.Add(fruit); await dbContext.SaveChangesAsync(); await dbContext.Entry(fruit).ReloadAsync() // fruid.WikiLink is not null anymore

The disadvantage is obvious - additional db query:

> \-- T-SQL Pseudocode for -> dbContext.Fruits.Add(fruit); INSERT INTO \[dbo\].\[Fruits\] (Family, Name) VALUES ("Rosaceae", "Apple") SELECT SCOPE\_IDENTITY() as Id;
> 
> \-- T-SQL Pseudocode for -> await dbContext.Entry(fruit).ReloadAsync() SELECT FROM \* \[dbo\].\[Fruits\] WHERE Id = 99;

However, it could be good enough for some projects.

If you can modify the DB scheme, the solution is quite simple - replace the trigger by a computed column:

> \-- T-SQL Pseudocode for alter table \[dbo\].\[Fruits\] add \[WikiLink\] as concat(N'\_ttp://mywiki.net/fruits?id=', Id )

This way you may gain more performance. Since you may have a 'RowVersion' column which will be calculated twice because of the trigger. Not to mention that the DB structure is much more readable, compare to unnecessary trigger.

There might be another workarounds for this issue if you don't have access or you can't modify the DB. I would like to hear about your experience, so please share via comments.
