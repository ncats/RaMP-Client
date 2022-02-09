library(plumber)
library(sqldf)
library(config)
library(R.cache)
library(readr)

serializers <- list(
  "json" = serializer_json(),
  "tsv" = serializer_tsv()
)

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

######## USED IN RAMP UI #############
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

###
#* Return analyte source intersects
#* @param analytetype specifies type of analyte intersects to return, 'metabolites' or 'genes'
#* @param query_scope specifies 'global' or 'mapped-to-pathway'
#* @get /api/analyte_intersects
function(analytetype, query_scope) {
  response <- ""
  if(!missing(analytetype)) {
    if(analytetype == 'metabolites') {
      response <- RaMP::getRaMPAnalyteIntersections(analyteType=analytetype, format='json', scope=query_scope)
      function_call <- paste0("RaMP::getRaMPAnalyteIntersections(analyteType='metabolites', format='json', scope='",query_scope,")")
    } else {
      response <- RaMP::getRaMPAnalyteIntersections(analyteType=analytetype, format='json', scope=query_scope)
      function_call <- paste0("RaMP::getRaMPAnalyteIntersections(analyteType='genes', format='json', scope='",query_scope,")")
    }
    # have to convert from JSON to avoid double serializing JSON
    response <- jsonlite::fromJSON(response)
  }
  return(list(
    data = response,
    function_call= function_call
  ))
}

#####
#* Return ontologies from list of metabolites
#* @param metabolite
#* @param format one of "json" or "tsv"
#* @get /api/ontologies-from-metabolites
#* @post /api/ontologies-from-metabolites
function(metabolite="", type="biological", format = "json", res) {
  metabolites_ids <- c(metabolite)
  ontologies_df <- RaMP::getOntoFromMeta(analytes = metabolites_ids)
  metabolites_ids <- paste(metabolites_ids, collapse = ", ")
  res$serializer <- serializers[[format]]
  if(format == "tsv") {
    return(as_attachment(ontologies_df, "getOntoFromMeta.tsv"))
  } else {
  return(
    list(
      data = ontologies_df,
      function_call = paste0("RaMP::getOntoFromMeta(", metabolites_ids ,")"),
      numFoundIds = length(unique(ontologies_df$sourceId))
    )
  )
  }
}

#####***** TODO: THIS DOESN'T RETURN DATA
#* Query: Return ontologies from list of metabolites
#* @param metabolite
#* @serializer unboxedJSON
#* @get /api/ontologies-from-metabolites
function(metabolite="", type="biological") {
  metabolites_ids <- c(metabolite)
  num_submitted_ids <- length(metabolites_ids)
  #metabolites_ids <- sapply(metabolites_ids, shQuote)
  metabolites_ids <- paste(metabolites_ids, collapse = ", ")
  #print(metabolites_ids)

  if (type == "biological") {
    ontologies_df <- RaMP::getOntoFromMeta(analytes = metabolites_ids)
  } else { # EM: this is a place holder although we could consider implementing only one type, or subsetting to the 7 different types (e.g. source, subcellular, etc)
    ontologies_df <- NULL
  }

  # Reformat metabolites_ids for function call output:
  metabolites_ids <- sapply(metabolite, shQuote)
  metabolites_ids <- paste(metabolites_ids, collapse = ", ")

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

#* Return metabolites from ontology
#* @param ontology
#* @param format one of "json" or "tsv"
#* @get /api/metabolites-from-ontologies
#* @post /api/metabolites-from-ontologies
function(ontology="", format = "json", res) {
  ontologies_names <- c(ontology)
  ontologies_names <- paste(ontologies_names, collapse = ", ")

  ontologies <- RaMP::getMetaFromOnto(ontology = ontologies_names)
  if (is.null(nrow(ontologies))) {
    return(
      list(
        data = vector(),
        function_call = paste0("RaMP::getMetaFromOnto(ontology = c(",
                               ontologies_names, "))"),
        numFoundIds = length(unique(ontologies$Ontology))
      )
    )
  }else {
    res$serializer <- serializers[[format]]
    if(format == "tsv") {
      return(as_attachment(ontologies, "getMetaFromOnto.tsv"))
    } else {
      return(
      list(
        data = ontologies,
        function_call = paste0("RaMP::getMetaFromOnto(ontology = c(",
                               ontologies_names, "))"),
        numFoundIds = length(unique(ontologies$Ontology))
      )
    )
  }
  }
  #return(analytes_df)
}

##########
#' Return analytes from given list of pathways as either json or a tsv
#' @param pathway
#' @param analyte_type
#' @param format one of "json" or "tsv"
#' @get /api/analytes-from-pathways
#' @post /api/analytes-from-pathways
function(pathway="", analyte_type="both", format = "json", res) {
  pathway <- c(pathway)
  analyte <- analyte_type
  analytes_df <- tryCatch({
    analytes_df <- RaMP::getAnalyteFromPathway(pathway = pathway, analyte_type=analyte)
  },
    error = function(cond) {
      print(cond)
      return(data.frame(stringsAsFactors = FALSE))
    })
 pathways <- paste(pathway, collapse = ", ")
  res$serializer <- serializers[[format]]
  if(format == "tsv") {
    return(as_attachment(analytes_df, "getAnalyteFromPathway.tsv"))
  } else {
  return(
    list(
      data = analytes_df,
      function_call = paste0("RaMP::getAnalyteFromPathway(\"", pathways ,"\")"),
      numFoundIds = length(unique(analytes_df$pathwayName))
    )
  )
  }
}

#####
#' Return pathways from given list of analytes
#' @param analytes
#' @param format one of "json" or "tsv"
#' @get /api/pathways-from-analytes
#' @post /api/pathways-from-analytes
function(analytes="", format = "json", res) {
  analytes <- c(analytes)
  print(analytes)
  pathways_df <- tryCatch({
    pathways_df <- RaMP::getPathwayFromAnalyte(analytes = analytes)
  },
    error = function(cond) {
      return(data.frame(stringsAsFactors = FALSE))
    })

  analytes <- paste(analytes, collapse = ", ")
  res$serializer <- serializers[[format]]
  print(analytes)
  if(format == "tsv") {
    return(
      as_attachment(unique(pathways_df), "getPathwayFromAnalyte.tsv")
    )
  } else {
  return(
    list(
      data = unique(pathways_df),
      function_call = paste0("RaMP::getPathwayFromAnalyte(\"", analytes ,"\")"),
      numFoundIds = length(unique(pathways_df$commonName))
    )
  )
  }
}

####
# todo numfoundids returns too many
#' Return analytes involved in same reaction as given list of analytes
#' @param analyte
#' @param format one of "json" or "tsv"
#' @get /api/common-reaction-analytes
#' @post /api/common-reaction-analytes
function(analyte="", format = "json", res) {
  analytes <- c(analyte)
  analytes_names <- paste(analytes, collapse = ", ")
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
  res$serializer <- serializers[[format]]
  if(format == "tsv") {
    return(
      as_attachment(unique(analytes_df_ids), "rampFastCata.tsv")
    )
  } else {
  return(
    list(
      data = unique(analytes_df_ids),
      function_call = paste0("RaMP::rampFastCata(", analytes_names ,"))"),
      numFoundIds = length(unique(analytes_df_ids$Input_Analyte))
    )
  )
  }
}

######
#' Return available chemical classes of given metabolites in RaMP-DB
#' @param metabolites
#' @param format one of "json" or "tsv"
#' @get /api/chemical-classes
#' @post /api/chemical-classes
function(metabolites="", format ="json", res) {
  mets <- c(metabolites)
  chemical_class_df <- tryCatch({
    classes_df <- RaMP::chemicalClassSurvey(
      mets
    )
  },
    error = function(cond) {
      print(cond)
      return(data.frame(stringsAsFactors = FALSE))
    })
  mets <- paste(mets, collapse = ", ")
  res$serializer <- serializers[[format]]
  if(format == "tsv") {
    return(
      as_attachment(chemical_class_df$met_classes, "chemicalClassSurvey.tsv")
    )
  } else {
  return(
    list(
      data = chemical_class_df$met_classes,
      function_call = paste0("RaMP::chemicalClassSurvey(", mets ,"))"),
      numFoundIds = length(unique(chemical_class_df$met_classes$sourceId))
    )
  )
  }
}

#####
#' Return chemical properties of given metabolites
#' @param metabolites
#' @param property
#' @param format one of "json" or "tsv"
#' @get /api/chemical-properties
#' @post /api/chemical-properties
function(metabolites="", property="all", format = "json", res) {
  metabolites <- c(metabolites)
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
  mets <- paste(metabolites, collapse = ", ")
  res$serializer <- serializers[[format]]
  if(format == "tsv") {
    return(
      as_attachment(chemical_properties_df$chem_props, "getChemicalProperties.tsv")
    )
  } else {
  return(
    list(
      data = chemical_properties_df$chem_props,
      function_call = paste0("RaMP::getChemicalProperties(", mets ,"))"),
      numFoundIds = length(unique(chemical_properties_df$chem_props$chem_source_id))
    )
  )
  }
}

#####
#' Return combined Fisher's test results
#' from given list of analytes query results
#' @param pathways
#' @post /api/combined-fisher-test
function(pathways) {
  fishers_results_df <- RaMP::runCombinedFisherTest(
    pathways
  )
  pathways <- paste(pathways, collapse = ", ")
  return(list(
    data = fishers_results_df,
    function_call = paste0("RaMP::runCombinedFisherTest(", pathways, "))")
  ))
}

#####
#' Return filtered Fisher's test results
#' from given list of Fisher's test results
#' @param fishers_results
#' @param p_holmadj_cutoff
#' @param p_fdradj_cutoff
#' @post /api/filter-fisher-test-results
function(fishers_results, p_holmadj_cutoff=0.2, p_fdradj_cutoff=0.2) {
  fishers_results$fishresults <- as.data.frame(fishers_results)
  filtered_results <- RaMP::FilterFishersResults(
    fishers_df = fishers_results,
    p_holmadj_cutoff = p_holmadj_cutoff,
    p_fdradj_cutoff = p_fdradj_cutoff
  )
  fishers_results <- paste(fishers_results, collapse = ", ")
  return(list(
    data = filtered_results,
    function_call = paste0("RaMP::FilterFishersResults(", fishers_results, "))")
  ))
}

#####
#' Perform chemical enrichment on given metabolites
#' @param metabolites
#' @param format one of "json" or "tsv"
#' @get /api/chemical-enrichment
#' @post /api/chemical-enrichment
function(metabolites="", format = "json", res) {
  metabolites <- c(metabolites)
  chemical_enrichment_df <- tryCatch({
    enrichment_df <- RaMP::chemicalClassEnrichment(
      mets = metabolites,
    )
  },
    error = function(cond) {
      print(cond)
      return(data.frame(stringsAsFactors = FALSE))
    })
  mets <- paste(metabolites, collapse = ", ")
  res$serializer <- serializers[[format]]
  if(format == "tsv") {
    return(
      as_attachment(chemical_enrichment_df, "chemicalClassEnrichment.tsv")
    )
  } else {
    return(
      list(
        data = chemical_enrichment_df
       # function_call = paste0("RaMP::chemicalClassEnrichment(", mets ,"))"),
        #numFoundIds = length(unique(chemical_enrichment_df$chem_props$chem_source_id))
      )
    )
  }
}

#####
#* Return all types of ontologies present in RaMP-DB
#* @serializer unboxedJSON
#* @get /api/ontology-types
function() {
  ontologies <- RaMP::getOntologies()
  ontologies <- list(
    num_ontology_types = length(unique(ontologies$HMDBOntologyType)),
    uniq_ontology_types = unique(ontologies$HMDBOntologyType),
    data = ontologies,
    function_call = "ontologies <- getOntologies()"
  )
  return(ontologies)
}





#####
#' Return clustered Fisher's test results
#' from given list of Fisher's test results
#' @param fishers_results
#' @param perc_analyte_overlap
#' @param perc_pathway_overlap
#' @param min_pathway_tocluster
#' @post /api/cluster-fisher-test-results
function(
  fishers_results,
  #analyte_source_id,
  perc_analyte_overlap = 0.2,
  perc_pathway_overlap = 0.2,
  min_pathway_tocluster=2
) {
 # analytes <- c(analyte_source_id)
  print('yo')
  if (typeof(min_pathway_tocluster) == "character") {
    min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
  }
  #fishers_results <- as.data.frame(fishers_results)
 # fishers_results <- c(fishers_results)
  clustering_results <- RaMP::findCluster(
    fishers_results,
    perc_analyte_overlap = perc_analyte_overlap,
    min_pathway_tocluster = min_pathway_tocluster,
    perc_pathway_overlap = perc_pathway_overlap
  )
  return(
    list(
      data = clustering_results
      # function_call = paste0("RaMP::chemicalClassEnrichment(", mets ,"))"),
      #numFoundIds = length(unique(chemical_enrichment_df$chem_props$chem_source_id))
    )
  )
}

#####
#' Return clustered Fisher's test results
#' from given list of Fisher's test results
#' @param fishers_results
#' @param perc_analyte_overlap
#' @param perc_pathway_overlap
#' @param min_pathway_tocluster
#' @post /api/cluster-plot
function(
  fishers_results,
  perc_analyte_overlap = 0.2,
  perc_pathway_overlap = 0.2,
  min_pathway_tocluster=2
) {
  if (typeof(min_pathway_tocluster) == "character") {
    min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
  }
  clustered_plot <- RaMP::pathwayResultsPlot(
    fishers_results,
    perc_analyte_overlap = perc_analyte_overlap,
    min_pathway_tocluster = min_pathway_tocluster,
    perc_pathway_overlap = perc_pathway_overlap
  )
  return(clustered_plot)
}




########## NOT USED ########

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


#####
#' Return available high level chemical class types (from ClassyFire)
#' @param classtype
#' @get /api/chemical-class-type
function() {
  classtypes <- tryCatch({
    getMetabClassTypes()
  },
    error = function(cond) {
      return(data.frame(stringsAsFactors = FALSE))
    })
  return(classtypes)
}









