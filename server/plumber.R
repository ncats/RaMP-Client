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
    con <- RaMP::connectToRaMP()

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
    con <- RaMP::connectToRaMP()

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
    con <- RaMP::connectToRaMP()

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

####
#* Return analyte ID types
#* @serializer unboxedJSON
#* @get /api/id-types
function() {
   met <- getPrefixesFromAnalytes("metabolite")
   gene <- getPrefixesFromAnalytes("gene")

    return(rbind(met,gene))
}

#####
#* Return pathways from source database
#* @param identifier
#* @serializer unboxedJSON
#* @get /api/source/pathways
function(identifier) {
    identifiers <- c(identifier)
    #identifiers <- sapply(identifiers, shQuote)
    identifiers <- paste(identifiers, collapse = ",")
    pathways <- getPathwayFromAnalyte(identifiers)
    return(pathways)
}

#* Return analytes from source database
#* @param identifier
#* @param type
#* @param find_synonym:bool
#* @param names_or_ids
#* @serializer unboxedJSON
#* @get /api/source/analytes
function(identifier, type=NULL, find_synonym=FALSE, names_or_ids=NULL) {
    identifiers <- c(identifier)
    identifiers <- sapply(identifiers, shQuote)
    identifiers <- paste(identifiers, collapse = ",")

    con <- RaMP::connectToRaMP()

    name_or_ids_condition <- ""

    if (is.null(names_or_ids)) {
        name_or_ids_condition <- paste0(
            "s.sourceId in (", identifiers, ") ",
            "or s.commonName in (", identifiers, ") "
        )
    } else if (names_or_ids == "ids") {
        name_or_ids_condition <- paste0(
            "s.sourceId in (", identifiers, ") "
        )
    } else {
        name_or_ids_condition <- paste0(
            "s.commonName in (", identifiers, ") "
        )
    }

    synonum_property <- ""
    synonum_join <- ""
    synonum_condition <- ""
    find_synonym <- as.logical(find_synonym)
    if (
        find_synonym == TRUE
        && (is.null(names_or_ids) || names_or_ids == "names")
        ) {
        synonum_property <- ", min(ansyn.Synonym) as synonym "
        synonum_join <- paste0(
            "left join analytesynonym as ",
            "ansyn on s.rampId = ansyn.rampId and ",
            "ansyn.Synonym in (", identifiers, ") ")
        synonum_condition <- paste0(
            "or s.rampId in (",
                "select analytesynonym.rampId ",
                "from analytesynonym ",
                "where analytesynonym.Synonym in (", identifiers, ")",
            ") "
        )
    }

    type_condition <- ""

    if (!is.null(type)) {
        type_condition <- paste0("and s.geneOrCompound = '", type, "' ")
    }

    query <- paste0(
        "select ",
            "s.rampId, ",
            "s.sourceId, ",
            "s.IDtype, ",
            "s.geneOrCompound, ",
            "s.commonName ",
            synonum_property,
        "from source as s ",
        synonum_join,
        "where ",
            name_or_ids_condition,
            synonum_condition,
            type_condition,
        "group by s.sourceId, s.IDtype, s.geneOrCompound"
    )
    analytes <- DBI::dbGetQuery(con, query)
    DBI::dbDisconnect(con)
    return(analytes)
}

#####
#* Return ontologies from list of metabolites
#* @param metabolite
#* @serializer unboxedJSON
#* @get /api/ontologies
function(metabolite="", type="biological") {
    metabolites_ids <- c(metabolite)
    num_submitted_ids <- length(metabolites_ids)
#    metabolites_ids <- sapply(metabolites_ids, shQuote)
    metabolites_ids <- paste(metabolites_ids, collapse = ",")
#print(metabolites_ids)

        if (type == "biological") {
		 ontologies_df <- RaMP::getOntoFromMeta(analytes = metabolites_ids)
	} else { # EM: this is a place holder although we could consider implementing only one type, or subsetting to the 7 different types (e.g. source, subcellular, etc)
		ontologies_df <- NULL
	}

      if(is.null(ontologies_df)) {
        return(
            list(
		temp=metabolites_ids,
                num_submitted_ids = num_submitted_ids,
                numFoundIds = 0,
                data = vector()
            )
        )
      } else {
        return(
            list(
    		temp=metabolites_ids,
                num_submitted_ids = num_submitted_ids,
                numFoundIds = length(unique(ontologies_df$sourceId)),
                data = ontologies_df
            )
        )
    } 
}

#* Return ontologies from list of metabolites
#* @param contains
#* @serializer unboxedJSON
#* @get /api/ontology-summaries
function(contains="") {
    con <- RaMP::connectToRaMP()

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
    ontologies_names <- c(ontology)
    num_submitted_names <- length(ontologies_names)
    ontologies_names <- sapply(ontologies_names, shQuote)
    ontologies_names <- paste(ontologies_names, collapse = ",")

    con <- RaMP::connectToRaMP()

    query <- paste0(
        "select o.commonName ",
        "from ontology as o ",
        "where o.commonName in (", ontologies_names, ") "
    )

    ontologies <- DBI::dbGetQuery(con, query)

    DBI::dbDisconnect(con)

    if (nrow(ontologies) > 0) {

        metabolites_df <- RaMP::getMetaFromOnto(ontology = ontologies)

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
    analytes_df <- tryCatch({
        analytes_df <- RaMP::getAnalyteFromPathway(pathway = pathways)
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
    pathways_df_ids <- tryCatch({
        pathways_df <- RaMP::getPathwayFromAnalyte(analytes = analytes,
            NameOrIds = "ids"
        )
    },
    error = function(cond) {
        return(data.frame(stringsAsFactors = FALSE))
    })
    pathways_df_names <- tryCatch({
        pathways_df <- RaMP::getPathwayFromAnalyte(
            analytes = analytes,
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
    pathways_df <- as.data.frame(req$body)
    fishers_results_df <- RaMP::runCombinedFisherTest(
        pathwaydf = pathways_df
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

    con <- RaMP::connectToRaMP()
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
    analytes_df_ids <- tryCatch({
        analytes_df <- RaMP::rampFastCata(
            analytes = analytes,
            NameOrIds = "ids"
        )
    },
    error = function(cond) {
        return(data.frame(stringsAsFactors = FALSE))
    })
    analytes_df_names <- tryCatch({
        analytes_df <- RaMP::rampFastCata(
            analytes = analytes,
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

#' Return chemical properties of given metabolites
#' @param metabolite
#' @param property
#' @get /api/metabolites/chemical-properties
function(metabolite="", property=NULL) {
    metabolites <- c(metabolite)
    properties <- NULL
    if (!is.null(property)) {
        properties <- c(property)
    }
    chemical_properties_df <- tryCatch({
        analytes_df <- RaMP::getChemicalProperties(
            metabolites,
            propertyList = properties
        )
    },
    error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
    })
    return(chemical_properties_df)
}
