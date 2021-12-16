library(plumber)
library(sqldf)
library(config)
library(R.cache)

# Set up the connection to the mySQL db:
#config <- config::get()
#host <- config$db_host_v2
#dbname <- config$db_dbname_v2
#username <- config$db_username_v2
#conpass <- config$db_password_v2
#pkg.globals <- RaMP::setConnectionToRaMP(dbname=dbname,username=username,conpass=conpass,host = host)



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

######
#* Return source version information
#* @serializer unboxedJSON
#* @get /api/source_versions
function() {
    version_info <- RaMP::getCurrentRaMPSourceDBVersions()

    return(list(
	data = version_info,
	function_call="RaMP::getCurrentRaMPSourceDBVersions()"
    ))
}

####
#* Return counts on entities and their associations
#* @serializer unboxedJSON
#* @get /api/entity_counts
function() {
    entity_counts <- RaMP::getEntityCountsFromSourceDBs()

    return(list(
        data = entity_counts,
        function_call="RaMP::getEntityCountsFromSourceDBs()"
    ))
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
#* @get /api/analyte_intersects_cache
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

#* Return analyte source intersects
#* @param analytetype specifies type of analyte intersects to return, 'met' or 'gene'
#* @serializer unboxedJSON
#* @get /api/analyte_intersects
function(analytetype) {
  response = ""
  if(!missing(analytetype)) {
    if(analytetype == 'mets') {
      response = RaMP::getRaMPAnalyteIntersections(analyteType='metabolites', format='json')
    } else {
      response = RaMP::getRaMPAnalyteIntersections(analyteType='genes', format='json')
    }
    # have to convert from JSON to avoid double serializing JSON
    response = jsonlite::fromJSON(response)
  }
  return(response)
}

####
#* Return analyte ID types
#* @serializer unboxedJSON
#* @get /api/id-types
function() {
   met <- RaMP::getPrefixesFromAnalytes("metabolite")
   gene <- RaMP::getPrefixesFromAnalytes("gene")

    return(list(
        data = rbind(met,gene),
        function_call='RaMP::getPrefixesFromAnalytes("metabolite"); RaMP::getPrefixesFromAnalytes("gene")'
	))
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
    pathways <- RaMP::getPathwayFromAnalyte(identifiers)

    # Need to reformat for output function_call:
    identifiers <- sapply(identifier, shQuote)
    identifiers <- paste(identifiers, collapse = ",")

    return(list(
	data = pathways,
	function_call = paste0("RaMP::getPathwayFromAnalyte(", identifiers, "))")
    ))
}

#* Return pathways from source database
#* @param identifier
#* @post /api/pathways
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

#####TIM POST
#* Return ontologies from list of metabolites
#* @param metabolite
#* @post /api/ontologies
function(metabolite="", type="biological") {
    metabolites_ids <- c(metabolite)
    ontologies_df <- RaMP::getOntoFromMeta(analytes = metabolites_ids)
    return(
      list(
        data = ontologies_df
      )
    )
}


#####
#* Query: Return ontologies from list of metabolites
#* @param metabolite
#* @serializer unboxedJSON
#* @get /api/ontologies
function(metabolite="", type="biological") {
    metabolites_ids <- c(metabolite)
    num_submitted_ids <- length(metabolites_ids)
    #metabolites_ids <- sapply(metabolites_ids, shQuote)
    metabolites_ids <- paste(metabolites_ids, collapse = ",")
#print(metabolites_ids)

        if (type == "biological") {
		 ontologies_df <- RaMP::getOntoFromMeta(analytes = metabolites_ids)
	} else { # EM: this is a place holder although we could consider implementing only one type, or subsetting to the 7 different types (e.g. source, subcellular, etc)
		ontologies_df <- NULL
	}

      # Reformat metabolites_ids for function call output:
	metabolites_ids <- sapply(metabolite, shQuote)
        metabolites_ids <- paste(metabolites_ids, collapse = ",")

      if(is.null(ontologies_df)) {
        return(
            list(
		temp=metabolites_ids,
                num_submitted_ids = num_submitted_ids,
                numFoundIds = 0,
                data = vector(),
		function_call = paste0("RaMP::getOntoFromMeta(analytes = ",metabolites_ids,")")
            )
        )
      } else {
        return(
            list(
    		temp=metabolites_ids,
                num_submitted_ids = num_submitted_ids,
                numFoundIds = length(unique(ontologies_df$sourceId)),
                data = ontologies_df,
		function_call = paste0("RaMP::getOntoFromMeta(analytes = ",metabolites_ids,")")
            )
        )
    }
}

#####
#* Return all types of ontologies present in RaMP-DB
#* @serializer unboxedJSON
#* @get /api/ontology-types
function(contains="") {
    ontologies <- getOntologies()
    ontologies <- list(
	num_ontology_types = length(unique(ontologies$HMDBOntologyType)),
	uniq_ontology_types = unique(ontologies$HMDBOntologyType),
	data = ontologies,
	function_call = "ontologies <- getOntologies()"
    )
    return(ontologies)
}


#* Return metabolites from ontology
#* @param ontology
#* @serializer unboxedJSON
#* @get /api/get-metabolites-from-ontologies
function(ontology="") {
    ontologies_names <- c(ontology)
    num_submitted_names <- length(ontologies_names)
#    ontologies_names <- sapply(ontologies_names, shQuote)
    ontologies_names <- paste(ontologies_names, collapse = ",")

    ontologies <- RaMP::getMetaFromOnto(ontology = ontologies_names)

    if (is.null(nrow(ontologies))) {
        return(
            list(
                num_submitted_ids = num_submitted_names,
                numFoundIds = 0,
                data = vector(),
                function_call = paste0("RaMP::getMetaFromOnto(ontology = c(",
                        ontologies_names, "))")
            )
        )
    }else {
        return(
            list(
                num_submitted_ids = num_submitted_names,
                numFoundIds = nrow(ontologies),
                data = ontologies,
		function_call = paste0("RaMP::getMetaFromOnto(ontology = c(",
			ontologies_names, "))")
            )
        )
    }
    #return(analytes_df)
}

##########
#' Return analytes from given list of pathways
#' @param pathway
#' @param analyte_type
#' @get /api/analytes
function(pathway="", analyte_type="both") {
    pathway <- c(pathway)
    analyte <- analyte_type
    print(pathway)
    analytes_df <- tryCatch({
        analytes_df <- RaMP::getAnalyteFromPathway(pathway = pathway, analyte_type=analyte)
    },
    error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
    })
    return(analytes_df)
}

##########TIM POST
#' Return analytes from given list of pathways
#' @param pathway
#' @param analyte_type
#' @post /api/analytes-from-pathways
function(pathway="", analyte_type="both") {
    print(pathway)
    pathway <- c(pathway)
    analyte <- analyte_type
    print(pathway)
    analytes_df <- tryCatch({
        analytes_df <- RaMP::getAnalyteFromPathway(pathway = pathway, analyte_type=analyte)
    },
    error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
    })
    return(
      list(
      data = analytes_df
    )
      )
}

#####
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

##### TIM POST
#' Return pathways from given list of analytes
#' @param analyte
#' @post /api/pathways-from-analytes
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
    return(
      list(
        data = unique(pathways_df)
      )
    )
}

#####
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

#####
#' Return filtered Fisher's test results
#' from given list of Fisher's test results
#' @param p_holmadj_cutoff
#' @param p_fdradj_cutoff
#' @parser json
#' @post /api/filter-fisher-test-results
function(req, p_holmadj_cutoff=0.2, p_fdradj_cutoff=0.2) {
    fishers_results <- req$body
    fishers_results$fishresults <- as.data.frame(fishers_results$fishresults)
    filtered_results <- RaMP::FilterFishersResults(
        fishers_df = fishers_results,
        p_holmadj_cutoff = p_holmadj_cutoff,
        p_fdradj_cutoff = p_fdradj_cutoff
    )
    return(filtered_results)
}

#####
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

#####
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

    response <- list(
        fishresults = clustering_results$fishresults
    )

    return(response)
}

####
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

# Removing Capacity to search by name for now - EM 12/13/2021
#    analytes_df_names <- tryCatch({
#        analytes_df <- RaMP::rampFastCata(
#            analytes = analytes,
#            NameOrIds = "names"
#        )
#    },
#        error = function(cond) {
#            return(data.frame(stringsAsFactors = FALSE))
#        }
#    )
#    analytes_df <- rbind(analytes_df_ids, analytes_df_names)
    return(unique(analytes_df_ids))
}

#####
#' Return chemical properties of given metabolites
#' @param metabolite
#' @param property
#' @get /api/metabolites/chemical-properties
function(metabolite="", property="all") {
    metabolites <- c(metabolite)
    #properties <- NULL
    properties <- property
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



######
#' Return available chemical properties in RaMP-DB




#####
#' Return available high level chemical class types (from ClassyFire)
#' @param classtype
#' get /api/metabolites/chemical-class-type
function() {
	classtypes <- tryCatch({
		getMetabClassTypes()
	},
	error = function(cond) {
		return(data.frame(stringsAsFactors = FALSE))
	})
	return(classtypes)
}









