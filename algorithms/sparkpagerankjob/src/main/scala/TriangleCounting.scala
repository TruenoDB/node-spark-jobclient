package spark.jobserver

import com.typesafe.config.{Config, ConfigFactory}
import spark.jobserver.{SparkJob, SparkJobInvalid, SparkJobValid, SparkJobValidation}

import scala.util.Try

//spark
import org.apache.spark.{SparkConf, SparkContext}
import com.datastax.spark.connector._

import org.apache.spark.graphx._
import org.apache.spark.graphx.VertexRDD
import org.apache.spark.rdd.RDD


object TriangleCounting extends SparkJob {


  def main(args: Array[String]) {
    val conf = new SparkConf(true)
      .set("spark.cassandra.connection.host", "localhost")
      .setMaster("local[4]")
      .setAppName("ConnectedComponents")

    val sc = new SparkContext(conf)
    val config = ConfigFactory.parseString("")
    val results = runJob(sc, config)
    println("Result is " + results)
  }

  override def validate(sc: SparkContext, config: Config): SparkJobValidation = {
    Try(config.getString("input.string"))
      .map(x => SparkJobValid)
      .getOrElse(SparkJobInvalid("No input.string config param"))
  }

  override def runJob(sc: SparkContext, config: Config): Any = {
    //get table from keyspace and stored as rdd
    val vertexRDD1: RDD[(VertexId, String)] = sc.cassandraTable("scala_api", "vertices2")

    val rowsCassandra: RDD[CassandraRow] = sc.cassandraTable("scala_api", "edges")
      .select("fromvertex", "tovertex")
    val edgesRDD: RDD[Edge[Int]] = rowsCassandra.map(x =>
      Edge(
        x.getLong("fromvertex"),
        x.getLong("tovertex")
      ))

    val vertex_collect = vertexRDD1.collect().take(100)

    val vertexSet = VertexRDD(vertexRDD1)

    // Build the initial Graph
    val graph = Graph(vertexSet, edgesRDD)

    // Find the triangle count for each vertex
    val triCounts = graph.triangleCount().vertices

    triCounts.collect()
  }

}