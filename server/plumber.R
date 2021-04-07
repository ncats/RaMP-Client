library(plumber)
library(sqldf)
library(config)

host <- "***REMOVED***"
dbname <- "ramp"
username <- "***REMOVED***"
conpass <- "***REMOVED***"

#* @filter cors
cors <- function(req, res) {
    res$setHeader("Access-Control-Allow-Origin", "*")
    if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","*")
    res$setHeader("Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS)
    res$status <- 200
    return(list())
  } else {
    plumber::forward()
  }
}

#* Return analyte source intersects
#* @serializer unboxedJSON
#* @get /api/analyte_intersects
function() {
    intersects <- list(
        compounds=list(
            list(
                sets=list("KEGG"),
                size=0
            ),
            list(
                sets=list("REACTOME"),
                size=246
            ),
            list(
                sets=list("WP"),
                size=814
            ),
            list(
                sets=list("HMDB"),
                size=110847
            ),
            list(
                sets=list("KEGG", "REACTOME"),
                size=0
            ),
            list(
                sets=list("KEGG", "WP"),
                size=0
            ),
            list(
                sets=list("KEGG", "HMDB"),
                size=163
            ),
            list(
                sets=list("REACTOME", "WP"),
                size=811
            ),
            list(
                sets=list("REACTOME", "HMDB"),
                size=76
            ),
            list(
                sets=list("WP", "HMDB"),
                size=417
            ),
            list(
                sets=list("KEGG", "REACTOME", "WP"),
                size=0
            ),
            list(
                sets=list("REACTOME", "WP", "HMDB"),
                size=422
            ),
            list(
                sets=list("KEGG", "REACTOME", "HMDB"),
                size=2
            ),
            list(
                sets=list("KEGG", "WP", "HMDB"),
                size=169
            ),
            list(
                sets=list("KEGG", "REACTOME", "WP", "HMDB"),
                size=551
            )
        ),
        genes=list(
            list(
                sets=list("KEGG"),
                size=0
            ),
            list(
                sets=list("REACTOME"),
                size=1030
            ),
            list(
                sets=list("WP"),
                size=1288
            ),
            list(
                sets=list("HMDB"),
                size=892
            ),
            list(
                sets=list("KEGG", "REACTOME"),
                size=0
            ),
            list(
                sets=list("KEGG", "WP"),
                size=0
            ),
            list(
                sets=list("KEGG", "HMDB"),
                size=68
            ),
            list(
                sets=list("REACTOME", "WP"),
                size=6113
            ),
            list(
                sets=list("REACTOME", "HMDB"),
                size=48
            ),
            list(
                sets=list("WP", "HMDB"),
                size=278
            ),
            list(
                sets=list("KEGG", "REACTOME", "WP"),
                size=0
            ),
            list(
                sets=list("REACTOME", "WP", "HMDB"),
                size=2598
            ),
            list(
                sets=list("KEGG", "REACTOME", "HMDB"),
                size=15
            ),
            list(
                sets=list("KEGG", "WP", "HMDB"),
                size=48
            ),
            list(
                sets=list("KEGG", "REACTOME", "WP", "HMDB"),
                size=1549
            )
        )
    )
}

#* Return analytes from source database
#* @param identifier
#* @serializer unboxedJSON
#* @get /api/source/analytes
function(identifier) {
    identifiers <- c(identifier)
    identifiers <- sapply(identifiers,shQuote)
    identifiers <- paste(identifiers, collapse=",")
    config <- config::get()
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password
    con <- DBI::dbConnect(RMariaDB::MariaDB(),
                          user = username,
                          dbname = dbname,
                          password = conpass,
                          host = host)
    query <- paste0(
        "select s.rampId, s.sourceId, s.IDtype, s.geneOrCompound, s.commonName, min(ansyn.Synonym) as synonym ",
        "from source as s ",
        "left join analytesynonym as ansyn on s.rampId = ansyn.rampId and ansyn.Synonym in (", identifiers, ") ",
        "where s.sourceId in (", identifiers, ") ",
        "or s.commonName in (", identifiers, ") ",
        "or s.rampId in (",
            "select analytesynonym.rampId ",
            "from analytesynonym ",
            "where analytesynonym.Synonym in (", identifiers, ")",
        ") ",
        "group by s.sourceId, s.IDtype, s.geneOrCompound, s.commonName"
    )
    analytes <- DBI::dbGetQuery(con,query)
    DBI::dbDisconnect(con)
    return(analytes)
}

#* Return analytes from pathway
#* @param analyte
#* @serializer unboxedJSON
#* @get /api/ontologies
function(metabolite="") {
    config <- config::get()
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password

    metabolites_ids <- c(metabolite)
    numSubmittedIds <- length(metabolites_ids)
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

    metabolites <- DBI::dbGetQuery(con,query)

    DBI::dbDisconnect(con)

    if (nrow(metabolites) > 0) {

        ontologies_df <- RaMP::getOntoFromMeta(
            analytes = metabolites,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username
        )

        return(list(numSubmittedIds=numSubmittedIds, numFoundIds=nrow(metabolites), data=ontologies_df))
    } else {
        return(list(numSubmittedIds=numSubmittedIds, numFoundIds=0, data=vector()))
    }
}

#* Return metabolites from ontology
#* @param analyte
#* @serializer unboxedJSON
#* @get /api/metabolites
function(ontology="") {
    config <- config::get()
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password

    ontologies_names <- c(ontology)
    numSubmittedNames <- length(ontologies_names)
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

    ontologies <- DBI::dbGetQuery(con,query)

    DBI::dbDisconnect(con)

    if (nrow(ontologies) > 0) {

        metabolites_df <- RaMP::getMetaFromOnto(
            ontology = ontologies,
            conpass = conpass,
            host = host,
            dbname = dbname,
            username = username
        )

        return(list(numSubmittedIds=numSubmittedNames, numFoundIds=nrow(ontologies), data=metabolites_df))
    } else {
        return(list(numSubmittedIds=numSubmittedNames, numFoundIds=0, data=vector()))
    }

    return(analytes_df)
}

#' Return pathways from given list of analytes
#' @param analyte
#' @get /api/pathways
function(analyte="") {
    analytes <- c(analyte)
    config <- config::get()
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password
    pathways_df_ids <- tryCatch(
        {
            pathways_df <- RaMP::getPathwayFromAnalyte(
                analytes = analytes,
                conpass=conpass,
                host=host,
                dbname=dbname,
                username=username,
                NameOrIds = 'ids'
            )
        },
        error=function(cond) {
            return(data.frame(stringsAsFactors=FALSE))
        }
    )
    pathways_df_names <- tryCatch(
        {
            pathways_df <- RaMP::getPathwayFromAnalyte(
                analytes = analytes,
                conpass=conpass,
                host=host,
                dbname=dbname,
                username=username,
                NameOrIds = 'names'
            )
        },
        error=function(cond) {
            return(data.frame(stringsAsFactors=FALSE))
        }
    )
    pathways_df <- rbind(pathways_df_ids, pathways_df_names)
    return(unique(pathways_df))
}

#' Return combined Fisher's test results from given list of analytes query results
#' @parser json
#' @post /api/combined-fisher-test
function(req) {
    config <- config::get()
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password
    print(req)
    pathways_df <- as.data.frame(req$body)
    print(pathways_df)
    fishers_results_df <- RaMP::runCombinedFisherTest(
        pathwaydf = pathways_df,
        conpass=conpass,
        host=host,
        dbname=dbname,
        username=username
    )
    return(fishers_results_df)
}

#' Return filtered Fisher's test results from given list of Fisher's test results
#' @param p_holmadj_cutoff
#' @param p_fdradj_cutoff
#' @parser json
#' @post /api/filter-fisher-test-results
function(req, p_holmadj_cutoff=0.05, p_fdradj_cutoff=NULL) {
    config <- config::get()
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password
    fishers_results <- req$body
    fishers_results$fishresults <- as.data.frame(fishers_results$fishresults)
    filtered_results <- RaMP::FilterFishersResults(
        fishers_df=fishers_results,
        p_holmadj_cutoff = p_holmadj_cutoff,
        p_fdradj_cutoff = p_fdradj_cutoff
    )
    return(filtered_results)
}

#' Return filtered Fisher's test results from given list of Fisher's test results
#' @param perc_analyte_overlap
#' @param perc_pathway_overlap
#' @param min_pathway_tocluster
#' @parser json
#' @post /api/cluster-fisher-test-results
function(req, analyte_source_id, perc_analyte_overlap=0.2, perc_pathway_overlap=0.2, min_pathway_tocluster=2) {
    analytes <- c(analyte_source_id)
    if (typeof(min_pathway_tocluster) == "character") {
        min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
    }
    config <- config::get()
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password
    fishers_results <- req$body
    fishers_results$fishresults <- as.data.frame(fishers_results$fishresults)
    clustering_results <- RaMP::findCluster(
        fishers_results,
        perc_analyte_overlap=perc_analyte_overlap,
        min_pathway_tocluster=min_pathway_tocluster,
        perc_pathway_overlap=perc_pathway_overlap
    )

    return(clustering_results)
}

#' Return filtered Fisher's test results from given list of Fisher's test results
#' @param analyte_source_id
#' @param perc_analyte_overlap
#' @param perc_pathway_overlap
#' @param min_pathway_tocluster
#' @parser json
#' @post /api/cluster-fisher-test-results-extended
function(req, analyte_source_id, perc_analyte_overlap=0.2, perc_pathway_overlap=0.2, min_pathway_tocluster=2) {
    analytes <- c(analyte_source_id)
    if (typeof(min_pathway_tocluster) == "character") {
        min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
    }
    config <- config::get()
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password
    fishers_results <- req$body
    fishers_results$fishresults <- as.data.frame(fishers_results$fishresults)
    clustering_results <- RaMP::findCluster(
        fishers_results,
        perc_analyte_overlap=perc_analyte_overlap,
        min_pathway_tocluster=min_pathway_tocluster,
        perc_pathway_overlap=perc_pathway_overlap
    )

    fishresults <- clustering_results$fishresults

    ids_no_cluster <- fishresults[
        fishresults$cluster_assignment != 'Did not cluster', 'pathwayRampId'
    ]
    pathway_matrix <- clustering_results$pathway_matrix[ids_no_cluster,ids_no_cluster]

    cluster_coordinates <- c()

    if (!is.null(pathway_matrix)) {
        distance_matrix <- dist(1 - pathway_matrix)

        fit <- cmdscale(distance_matrix, eig=TRUE, k=2)

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

    analyte_ids <- sapply(analytes,shQuote)
    analyte_ids <- paste(analyte_ids,collapse = ",")

    query <- paste0(
        "select s.sourceId, commonName, GROUP_CONCAT(p.sourceId) as pathways ",
        "from source as s ",
        "left join analyte as a on s.rampId = a.rampId ",
        "left join analytehaspathway as ap on a.rampId = ap.rampId ",
        "left join pathway as p on ap.pathwayRampId = p.pathwayRampId ",
        "where s.sourceId in (", analyte_ids, ") ",
        "group by s.sourceId, s.commonName"
    )

    con <- RaMP::connectToRaMP(dbname=dbname,username=username,conpass=conpass,host = host)
    cids <- DBI::dbGetQuery(con,query)
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
    host <- config$db_host
    dbname <- config$db_dbname
    username <- config$db_username
    conpass <- config$db_password
    analytes_df_ids <- tryCatch(
        {
            analytes_df <- RaMP::rampFastCata(
                analytes = analytes,
                conpass=conpass,
                host=host,
                dbname=dbname,
                username=username,
                NameOrIds = 'ids'
            )
        },
        error=function(cond) {
            return(data.frame(stringsAsFactors=FALSE))
        }
    )
    analytes_df_names <- tryCatch(
        {
            analytes_df <- RaMP::rampFastCata(
                analytes = analytes,
                conpass=conpass,
                host=host,
                dbname=dbname,
                username=username,
                NameOrIds = 'names'
            )
        },
        error=function(cond) {
            return(data.frame(stringsAsFactors=FALSE))
        }
    )
    analytes_df <- rbind(analytes_df_ids, analytes_df_names)
    return(unique(analytes_df))
}