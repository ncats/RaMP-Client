library(plumber)
library(sqldf)
library(config)
library(R.cache)

#* @filter cors
cors <- function(req, res) {
    res$setHeader("Access-Control-Allow-Origin", "*")
    if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods", "*")
    res$setHeader(
        "Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS
    )
    res$status <- 200
    return(list())
  } else {
    plumber::forward()
  }
}


#* Return source version information
#* @serializer unboxedJSON
#* @get /api/source_versions
function() {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                        user = username,
                        dbname = dbname,
                        password = conpass,
                        host = host)

    query <- paste0(
        "select ",
            "ramp_db_version as rampDbVersion, ",
            "db_mod_date as dbModDate, ",
            "status, ",
            "data_source_id as dataSourceId, ",
            "data_source_name as dataSourceName, ",
            "data_source_url as dataSourceUrl, ",
            "data_source_version as dataSourceVersion ",
        "from version_info where status = 'current'"
    )

    version_info <- DBI::dbGetQuery(con, query)
    DBI::dbDisconnect(con)
    return(version_info)
}

#* Return counts on entities and their associations
#* @serializer unboxedJSON
#* @get /api/entity_counts
function() {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                        user = username,
                        dbname = dbname,
                        password = conpass,
                        host = host)

    query <- paste0(
        "select ",
            "status_category as entity, ",
            "entity_source_id as entitySourceId, ",
            "entity_source_name as entitySourceName, ",
            "entity_count as entityCount ",
        "from entity_status_info"
    )

    entity_counts <- DBI::dbGetQuery(con, query)
    DBI::dbDisconnect(con)
    return(entity_counts)
}

get_count_query <- function(
  data_source,
  analyte_type
) {
    data_source_string <- sapply(data_source, shQuote)
    data_source_string <- paste(data_source_string, collapse = ",")

    conditions <- ""

    for (d_source in data_source) {
        base_condition <- paste0(
            "and EXISTS (",
            "select s.rampId ",
            "from source as s ",
            "where a.rampId = s.rampId ",
            "and s.dataSource like '%", d_source, "') "
        )

        conditions <- paste0(conditions, base_condition)
    }
    query <- paste0(
        "select ",
        data_source_string, " as sources, ",
        "count(a.rampId) as count ",
        "from analyte as a ",
        "where a.type = '", analyte_type, "' ",
        "and ", length(data_source), " = (",
            "select count(distinct dataSource) ",
            "from (",
                "select ",
                    "s.rampId, ",
                    "case when s.dataSource like '%kegg' then 'kegg' ",
                    "else s.dataSource ",
                    "end as dataSource ",
                "from source as s ",
            ") dsc ",
            "where a.rampId = dsc.rampId ",
        ") ",
        conditions
    )
    return(query)
}

get_data_source_intercepts <- function() {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                        user = username,
                        dbname = dbname,
                        password = conpass,
                        host = host)

  tryCatch({
    analyte_types <- c("compound", "gene")
    data_sources <- c("reactome", "hmdb", "wiki", "kegg")


    response <- list()

    for (analyte_type in analyte_types) {

      intersects <- list()

      data_sources_range <- 1:length(data_sources)

      index <- 1
      for (range_item in data_sources_range) {
        combination <- combn(data_sources, range_item)
        for (i in 1:ncol(combination)) {
          data_source <- combination[, i]
          query <- get_count_query(data_source, analyte_type)
          query_result <- DBI::dbGetQuery(con, query)
          count <- 0
          if (nrow(query_result) > 0) {
              count <- query_result$count
          }
          intersects[[index]] <- list(
              sets = c(toupper(data_source)), size = count
            )
          index <- index + 1
        }
      }
      key <- paste0(analyte_type, "s")
      response[key] <- list(intersects)
    }
    return(response)
  },
  error = function(error) {
    print("error")
    print(error)
    return("")
  },
  finally = {
    DBI::dbDisconnect(con)
  })
}

#* Return analyte source intersects
#* @serializer unboxedJSON
#* @get /api/analyte_intersects
function() {
    key <- list(2.0, 3.0)
    cached_intercepts <- loadCache(key)

    if (is.null(cached_intercepts)) {
        response <- get_data_source_intercepts()
        saveCache(response, key = key)
    } else (
        response <- cached_intercepts
    )

    return(response)
}


#* Return analyte ID types
#* @serializer unboxedJSON
#* @get /api/id-types
function() {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                          user = username,
                          dbname = dbname,
                          password = conpass,
                          host = host)

    query <- paste0(
        "select ",
            "CASE ",
                "when geneOrCompound = 'compound' then 'Metabolites' ",
                "else 'Genes/Proteins' ",
            "END as analyteType, ",
            "GROUP_CONCAT(DISTINCT IDtype SEPARATOR ', ') as idTypes ",
        "from source ",
        "where geneOrCompound = 'compound' or geneOrCompound = 'gene' ",
        "GROUP BY AnalyteType "
    )
    idtypes <- DBI::dbGetQuery(con, query)
    DBI::dbDisconnect(con)
    return(idtypes)
}

#* Return pathways from source database
#* @param identifier
#* @serializer unboxedJSON
#* @get /api/source/pathways
function(identifier) {
    identifiers <- c(identifier)
    identifiers <- sapply(identifiers, shQuote)
    identifiers <- paste(identifiers, collapse = ",")
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                          user = username,
                          dbname = dbname,
                          password = conpass,
                          host = host)
    query <- paste0(
        "select ",
            "p.pathwayRampId, ",
            "p.sourceId as pathwaysourceId, ",
            "p.type as pathwaysource, ",
            "p.pathwayCategory, ",
            "p.pathwayName ",
        "from pathway as p ",
        "where p.sourceId in (", identifiers, ") ",
        "or p.pathwayName in (", identifiers, ") "
    )
    pathways <- DBI::dbGetQuery(con, query)
    DBI::dbDisconnect(con)
    return(pathways)
}

#* Return analytes from source database
#* @param identifier
#* @serializer unboxedJSON
#* @get /api/source/analytes
function(identifier) {
    identifiers <- c(identifier)
    identifiers <- sapply(identifiers, shQuote)
    identifiers <- paste(identifiers, collapse = ",")
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                          user = username,
                          dbname = dbname,
                          password = conpass,
                          host = host)
    query <- paste0(
        "select ",
            "s.rampId, ",
            "s.sourceId, ",
            "s.IDtype, ",
            "s.geneOrCompound, ",
            "s.commonName, ",
            "min(ansyn.Synonym) as synonym ",
        "from source as s ",
        "left join analytesynonym as ",
            "ansyn on s.rampId = ansyn.rampId and ",
            "ansyn.Synonym in (", identifiers, ") ",
        "where s.sourceId in (", identifiers, ") ",
        "or s.commonName in (", identifiers, ") ",
        "or s.rampId in (",
            "select analytesynonym.rampId ",
            "from analytesynonym ",
            "where analytesynonym.Synonym in (", identifiers, ")",
        ") ",
        "group by s.sourceId, s.IDtype, s.geneOrCompound, s.commonName"
    )
    analytes <- DBI::dbGetQuery(con, query)
    DBI::dbDisconnect(con)
    return(analytes)
}

#* Return ontologies from list of metabolites
#* @param metabolite
#* @serializer unboxedJSON
#* @get /api/ontologies
function(metabolite="", type="biological") {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2

    metabolites_ids <- c(metabolite)
    num_submitted_ids <- length(metabolites_ids)
    metabolites_ids <- sapply(metabolites_ids, shQuote)
    metabolites_ids <- paste(metabolites_ids, collapse = ",")

    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                          user = username,
                          dbname = dbname,
                          password = conpass,
                          host = host)
    query <- paste0(
        "select s.sourceId ",
        "from source as s ",
        "inner join analyte as a on s.rampId = a.rampId ",
        "where s.sourceId in (", metabolites_ids, ") "
    )

    metabolites <- DBI::dbGetQuery(con, query)

    DBI::dbDisconnect(con)

    if (nrow(metabolites) > 0) {

        ontologies_df <- RaMP::getOntoFromMeta(
            analytes = metabolites,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username
        )

        if (type == "biological") {
            ontologies_df <- ontologies_df[
                ontologies_df$biofluidORcellular %in% c(
                    "biofluid",
                    "tissue location",
                    "cellular location"
                ),
            ]
        } else {
            ontologies_df <- ontologies_df[
                ontologies_df$biofluidORcellular %in% c("origins"),
            ]
        }

        return(
            list(
                num_submitted_ids = num_submitted_ids,
                numFoundIds = nrow(metabolites),
                data = ontologies_df
            )
        )
    } else {
        return(
            list(
                num_submitted_ids = num_submitted_ids,
                numFoundIds = 0,
                data = vector()
            )
        )
    }
}

#* Return ontologies from list of metabolites
#* @param contains
#* @serializer unboxedJSON
#* @get /api/ontology-summaries
function(contains="") {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2

    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                          user = username,
                          dbname = dbname,
                          password = conpass,
                          host = host)

    query <- paste0(
        "select commonName as Ontology, biofluidORcellular ",
        "from ontology ",
        "where commonName LIKE '%", contains, "%' ",
        "order by commonName ASC"
    )

    ontologies <- DBI::dbGetQuery(con, query)

    DBI::dbDisconnect(con)

    return(ontologies)
}


#* Return metabolites from ontology
#* @param analyte
#* @serializer unboxedJSON
#* @get /api/metabolites
function(ontology="") {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2

    ontologies_names <- c(ontology)
    num_submitted_names <- length(ontologies_names)
    ontologies_names <- sapply(ontologies_names, shQuote)
    ontologies_names <- paste(ontologies_names, collapse = ",")

    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                          user = username,
                          dbname = dbname,
                          password = conpass,
                          host = host)

    query <- paste0(
        "select o.commonName ",
        "from ontology as o ",
        "where o.commonName in (", ontologies_names, ") "
    )

    ontologies <- DBI::dbGetQuery(con, query)

    DBI::dbDisconnect(con)

    if (nrow(ontologies) > 0) {

        metabolites_df <- RaMP::getMetaFromOnto(
            ontology = ontologies,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username
        )

        return(
            list(
                num_submitted_ids = num_submitted_names,
                numFoundIds = nrow(ontologies),
                data = metabolites_df
            )
        )
    } else {
        return(
            list(
                num_submitted_ids = num_submitted_names,
                numFoundIds = 0,
                data = vector()
            )
        )
    }

    return(analytes_df)
}

#' Return analytes from given list of pathways
#' @param analyte
#' @get /api/analytes
function(pathway="") {
    pathways <- c(pathway)
    print(pathways)
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    analytes_df <- tryCatch({
        analytes_df <- RaMP::getAnalyteFromPathway(
            pathway = pathways,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username
        )
    },
    error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
    })
    return(analytes_df)
}

#' Return pathways from given list of analytes
#' @param analyte
#' @get /api/pathways
function(analyte="") {
    analytes <- c(analyte)
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    pathways_df_ids <- tryCatch({
        pathways_df <- RaMP::getPathwayFromAnalyte(
            analytes = analytes,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username,
            NameOrIds = "ids"
        )
    },
    error = function(cond) {
        return(data.frame(stringsAsFactors = FALSE))
    })
    pathways_df_names <- tryCatch({
        pathways_df <- RaMP::getPathwayFromAnalyte(
            analytes = analytes,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username,
            NameOrIds = "names"
        )
    },
    error = function(cond) {
        return(data.frame(stringsAsFactors = FALSE))
    })
    pathways_df <- rbind(pathways_df_ids, pathways_df_names)
    return(unique(pathways_df))
}

#' Return combined Fisher's test results
#' from given list of analytes query results
#' @parser json
#' @post /api/combined-fisher-test
function(req) {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    print(req)
    pathways_df <- as.data.frame(req$body)
    print(pathways_df)
    fishers_results_df <- RaMP::runCombinedFisherTest(
        pathwaydf = pathways_df,
        conpass = conpass,
        host = host,
        dbname = dbname,
        username = username
    )
    return(fishers_results_df)
}

#' Return filtered Fisher's test results
#' from given list of Fisher's test results
#' @param p_holmadj_cutoff
#' @param p_fdradj_cutoff
#' @parser json
#' @post /api/filter-fisher-test-results
function(req, p_holmadj_cutoff=0.05, p_fdradj_cutoff=NULL) {
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    fishers_results <- req$body
    fishers_results$fishresults <- as.data.frame(fishers_results$fishresults)
    filtered_results <- RaMP::FilterFishersResults(
        fishers_df = fishers_results,
        p_holmadj_cutoff = p_holmadj_cutoff,
        p_fdradj_cutoff = p_fdradj_cutoff
    )
    return(filtered_results)
}

#' Return filtered Fisher's test results
#' from given list of Fisher's test results
#' @param perc_analyte_overlap
#' @param perc_pathway_overlap
#' @param min_pathway_tocluster
#' @parser json
#' @post /api/cluster-fisher-test-results
function(
    req,
    analyte_source_id,
    perc_analyte_overlap = 0.2,
    perc_pathway_overlap = 0.2,
    min_pathway_tocluster=2
) {
    analytes <- c(analyte_source_id)
    if (typeof(min_pathway_tocluster) == "character") {
        min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
    }
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    fishers_results <- req$body
    fishers_results$fishresults <- as.data.frame(fishers_results$fishresults)
    clustering_results <- RaMP::findCluster(
        fishers_results,
        perc_analyte_overlap = perc_analyte_overlap,
        min_pathway_tocluster = min_pathway_tocluster,
        perc_pathway_overlap = perc_pathway_overlap
    )

    return(clustering_results)
}

#' Return filtered Fisher's test results
#' from given list of Fisher's test results
#' @param analyte_source_id
#' @param perc_analyte_overlap
#' @param perc_pathway_overlap
#' @param min_pathway_tocluster
#' @parser json
#' @post /api/cluster-fisher-test-results-extended
function(
    req,
    analyte_source_id,
    perc_analyte_overlap = 0.2,
    perc_pathway_overlap = 0.2,
    min_pathway_tocluster = 2
) {
    analytes <- c(analyte_source_id)
    if (typeof(min_pathway_tocluster) == "character") {
        min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
    }
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    fishers_results <- req$body
    fishers_results$fishresults <- as.data.frame(fishers_results$fishresults)
    clustering_results <- RaMP::findCluster(
        fishers_results,
        perc_analyte_overlap = perc_analyte_overlap,
        min_pathway_tocluster = min_pathway_tocluster,
        perc_pathway_overlap = perc_pathway_overlap
    )

    fishresults <- clustering_results$fishresults

    ids_no_cluster <- fishresults[
        fishresults$cluster_assignment != "Did not cluster", "pathwayRampId"
    ]
    pathway_matrix <- clustering_results$pathway_matrix[
        ids_no_cluster, ids_no_cluster
    ]

    cluster_coordinates <- c()

    if (!is.null(pathway_matrix)) {
        distance_matrix <- dist(1 - pathway_matrix)

        fit <- cmdscale(distance_matrix, eig = TRUE, k = 2)

        cluster_coordinates <- data.frame(fit$points)
        cluster_coordinates <- cbind(
            pathwayRampId = rownames(cluster_coordinates),
            cluster_coordinates
        )
        rownames(cluster_coordinates) <- NULL

        names(cluster_coordinates)[2] <- "x"
        names(cluster_coordinates)[3] <- "y"

        options(sqldf.driver = "SQLite")
        cluster_coordinates <- sqldf(
            "select
                cluster_coordinates.pathwayRampId,
                cluster_coordinates.x,
                cluster_coordinates.y,
                fishresults.cluster_assignment,
                fishresults.pathwayName
            from cluster_coordinates
            left join fishresults on
                cluster_coordinates.pathwayRampId = fishresults.pathwayRampId"
        )
    }

    analyte_ids <- sapply(analytes, shQuote)
    analyte_ids <- paste(analyte_ids, collapse = ",")

    query <- paste0(
        "select s.sourceId, commonName, GROUP_CONCAT(p.sourceId) as pathways ",
        "from source as s ",
        "left join analyte as a on s.rampId = a.rampId ",
        "left join analytehaspathway as ap on a.rampId = ap.rampId ",
        "left join pathway as p on ap.pathwayRampId = p.pathwayRampId ",
        "where s.sourceId in (", analyte_ids, ") ",
        "group by s.sourceId, s.commonName"
    )

    con <- RaMP::connectToRaMP(
        dbname = dbname,
        username = username,
        conpass = conpass,
        host = host
    )
    cids <- DBI::dbGetQuery(con, query)
    DBI::dbDisconnect(con)

    response <- list(
        fishresults = clustering_results$fishresults,
        clusterCoordinates = cluster_coordinates,
        analytes = cids
    )

    return(response)
}

#' Return analytes involved in same reaction as given list of analytes
#' @param analyte
#' @get /api/common-reaction-analytes
function(analyte="") {
    analytes <- c(analyte)
    config <- config::get()
    host <- config$db_host_v2
    dbname <- config$db_dbname_v2
    username <- config$db_username_v2
    conpass <- config$db_password_v2
    analytes_df_ids <- tryCatch({
        analytes_df <- RaMP::rampFastCata(
            analytes = analytes,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username,
            NameOrIds = "ids"
        )
    },
    error = function(cond) {
        return(data.frame(stringsAsFactors = FALSE))
    })
    analytes_df_names <- tryCatch({
        analytes_df <- RaMP::rampFastCata(
            analytes = analytes,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username,
            NameOrIds = "names"
        )
    },
        error = function(cond) {
            return(data.frame(stringsAsFactors = FALSE))
        }
    )
    analytes_df <- rbind(analytes_df_ids, analytes_df_names)
    return(unique(analytes_df))
}
