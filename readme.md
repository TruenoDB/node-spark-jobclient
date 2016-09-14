#Node Spark Job Client



###References:

* [01] https://spark.apache.org/docs/1.1.0/programming-guide.html#transformations
* [02] https://spark.apache.org/docs/1.1.0/api/scala/index.html#org.apache.spark.graphx.lib.ConnectedComponents$
* [03] https://spark.apache.org/docs/latest/monitoring.html
* [04] https://databricks.com/blog/2015/04/14/running-spark-graphx-algorithms-on-library-of-congress-subject-heading-skos.html
* [05] [REST] http://arturmkrtchyan.com/apache-spark-hidden-rest-api
* [06] [REST] https://github.com/spark-jobserver/spark-jobserver
* [07] https://jaceklaskowski.gitbooks.io/mastering-apache-spark/content/spark-rdd.html
* [08] [Bootstrap] https://getbootstrap.com/components/
* [09] [Bootstrap] https://github.com/twbs/bootstrap
* [10] [Bootstrap] http://www.bootply.com/65566
* https://stackoverflow.com/questions/27171702/error-in-scala-compiler-java-lang-assertionerror-assertion-failed-even-when-p
* http://note.yuhc.me/2015/03/graphx-triangle-count-label-propagation/
* http://apache-spark-user-list.1001560.n3.nabble.com/GraphX-AssertionError-td13941.html
* https://mail-archives.apache.org/mod_mbox/spark-user/201409.mbox/%3CCAOxQ-1nCATKsbFxVXJw_5Qy4gpfMDrqO_wtZOLnZdRNV2wOnAA@mail.gmail.com%3E
* 

###Spark Job Client

####Initiating Job Server
```
cd ~/spark-jobserver/

sbt
job-server/reStart
```

####Generating jars
```
cd /home/maverick/Desktop/repos/spark-jobserver/
sbt package
```

###Before uploading job
```
cd /home/maverick/Desktop/repos/spark-jobserver/job-server-tests/target/scala-2.10


curl --data-binary @job-server-tests_2.10-0.7.0-SNAPSHOT.jar localhost:8090/jars/algorithms
curl --data-binary @job-server-tests_2.10-0.7.0-SNAPSHOT.jar localhost:8090/jars/pagerank
curl --data-binary @job-server-tests_2.10-0.7.0-SNAPSHOT.jar localhost:8090/jars/pr

```

####Testing pagerank
```
curl -d "input.string = a b c a b see dimelo" 'localhost:8090/jobs?appName=pagerank&classPath=spark.jobserver.PageRank'
{
  "status": "STARTED",
  "result": {
    "jobId": "b1697a2e-189d-4735-9642-83262958f122",
    "context": "56501fa1-spark.jobserver.PageRank"
  }
}
```

####Classes
```
cd /home/maverick/Desktop/repos/spark-jobserver/job-server-tests/target/scala-2.10/classes
```

####Result
```
curl localhost:8090/jobs/5453779a-f004-45fc-a11d-a39dae0f9bf4

```

[Working temporarily in https://github.com/maverick-zhn/node-spark-jobclient]
