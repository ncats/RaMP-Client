library(plumber)
library(sqldf)
library(config)
library(R.cache)
library(readr)
library(ggplot2)

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
#' Return available high level chemical class types (from ClassyFire)
#' @param classtype
#' @get /api/chemical-class-type
function() {
  ##todo show these in chemical classes page
  classtypes <- tryCatch({
    getMetabClassTypes()
  },
    error = function(cond) {
      return(data.frame(stringsAsFactors = FALSE))
    })
  return(classtypes)
}

#####
#' Return pathways from given list of analytes
#' @param analytes
#' @post /api/pathways-from-analytes
function(analytes, res) {
  analytes <- c(analytes)
  pathways_df <- tryCatch({
    pathways_df <- RaMP::getPathwayFromAnalyte(analytes = analytes)
  },
    error = function(cond) {
      return(data.frame(stringsAsFactors = FALSE))
    })

  analytes <- paste(analytes, collapse = ", ")
    return(
      list(
        data = unique(pathways_df),
        function_call = paste0("RaMP::getPathwayFromAnalyte(\"", analytes ,"\")"),
        numFoundIds = length(unique(pathways_df$commonName))
      )
    )
}

##########
#' Return analytes from given list of pathways as either json or a tsv
#' @param pathway
#' @param analyte_type
#' @post /api/analytes-from-pathways
function(pathway, analyte_type="both") {
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
    return(
      list(
        data = analytes_df,
        function_call = paste0("RaMP::getAnalyteFromPathway(\"", pathways ,"\")"),
        numFoundIds = length(unique(analytes_df$pathwayName))
      )
    )
}

#####
#* Return ontologies from list of metabolites
#* @param metabolite
#* @param NameOrIds one of “name” or “ids”, default “ids"
#* @post /api/ontologies-from-metabolites
function(metabolite, NameOrIds= "ids") {
  metabolites_ids <- c(metabolite)
  ontologies_df <- RaMP::getOntoFromMeta(analytes = metabolites_ids, NameOrIds = NameOrIds)
  metabolites_ids <- paste(metabolites_ids, collapse = ", ")
    return(
      list(
        data = ontologies_df,
        function_call = paste0("RaMP::getOntoFromMeta(", metabolites_ids ,")"),
        numFoundIds = length(unique(ontologies_df$sourceId))
      )
    )
  }

#* Return metabolites from ontology
#* @param ontology
#* @param format one of "json" or "tsv"
#* @post /api/metabolites-from-ontologies
function(ontology, format = "json", res) {
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
}

######
#' Return available chemical classes of given metabolites in RaMP-DB
#' @param metabolites
#' @param file: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/chemical-classes
function(metabolites="", file = '', pop = 'database') {
  pop <- gsub("\r\n", ",", file)
  if(length(pop) > length(metabolites)) {
    chemical_class_df <- tryCatch({
    classes_df <- RaMP::chemicalClassSurvey(
      metabolites,
      pop
    )
  },
    error = function(cond) {
      print(cond)
      return(data.frame(stringsAsFactors = FALSE))
    })
  } else {
    chemical_class_df <- tryCatch({
      classes_df <- RaMP::chemicalClassSurvey(
        metabolites,
        pop = "database"
      )
    },
      error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      })
  }
  mets <- paste(metabolites, collapse = ", ")
    return(
      list(
        data = chemical_class_df$met_classes,
        function_call = paste0("RaMP::chemicalClassSurvey(", mets ,"))"),
        numFoundIds = length(unique(chemical_class_df$met_classes$sourceId))
      )
    )
}

#####
#' Return chemical properties of given metabolites
#' @param metabolites
#' @param property
#' @post /api/chemical-properties
function(metabolites="", property="all") {
  metabolites <- c(metabolites)
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
    return(
      list(
        data = chemical_properties_df$chem_props,
        function_call = paste0("RaMP::getChemicalProperties(", mets ,"))"),
        numFoundIds = length(unique(chemical_properties_df$chem_props$chem_source_id))
      )
    )
}

####
#' Return analytes involved in same reaction as given list of analytes
#' @param analyte
#' @post /api/common-reaction-analytes
function(analyte) {
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
    return(
      list(
        data = unique(analytes_df_ids),
        function_call = paste0("RaMP::rampFastCata(", analytes_names ,"))"),
        numFoundIds = length(unique(analytes_df_ids$Input_Analyte))
      )
    )
}

#####
#' Return combined Fisher's test results
#' from given list of analytes query results
#' @param analytes
#' @param file: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/combined-fisher-test
#' @serializer json list(digits = 6)
function(analytes = '', file = '', background_type= "database") {
  if(file == "") {
    fishers_results_df <- RaMP::runCombinedFisherTest(
      analytes,
      background = NULL,
      background_type= "database"
    )
  } else {
    background <- gsub("\r\n", ",", file)
    if(length(background) > length(analytes)) {
      fishers_results_df <- RaMP::runCombinedFisherTest(
        analytes,
        background,
        background_type= "list"
      )
    } else {
      error <- function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      }
  }
  }
  analytes <- paste(analytes, collapse = ", ")
  return(list(
    data = fishers_results_df,
    function_call = paste0("RaMP::runCombinedFisherTest(", analytes, "))")
  ))
}

#####
#' Return filtered Fisher's test results
#' from given list of Fisher's test results
#' @param fishers_results
#' @param pval_type one of "fdr" or "holm" or "pval"
#' @param pval_cutoff
#' @post /api/filter-fisher-test-results
#' @serializer json list(digits = 6)
function(fishers_results,  pval_type = 'fdr', pval_cutoff = 0.1) {
  filtered_results <- RaMP::FilterFishersResults(
    fishers_df = fishers_results,
    pval_type = pval_type,
    pval_cutoff = pval_cutoff
  )
  fishers_results <- paste(fishers_results, collapse = ", ")
  return(list(
    data = filtered_results,
    function_call = paste0("RaMP::FilterFishersResults(", fishers_results, ")")
  ))
}

#####
#' Return clustered Fisher's test results
#' from given list of Fisher's test results
#' @param fishers_results
#' @param perc_analyte_overlap
#' @param perc_pathway_overlap
#' @param min_pathway_tocluster
#' @post /api/cluster-fisher-test-results
#' @serializer json list(digits = 6)
function(
  fishers_results,
  #analyte_source_id,
  perc_analyte_overlap = 0.2,
  perc_pathway_overlap = 0.2,
  min_pathway_tocluster=2
) {
  if (typeof(min_pathway_tocluster) == "character") {
    min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
  }
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
#' @param filename
#' @post /api/cluster-plot
#' @serializer contentType list(type='image/svg')
#'
function(
  fishers_results,
  perc_analyte_overlap = 0.2,
  perc_pathway_overlap = 0.2,
  min_pathway_tocluster=2,
  filename
) {
  if (typeof(min_pathway_tocluster) == "character") {
    min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
  }

  clustered_plot <- RaMP::pathwayResultsPlot(
    fishers_results,
    text_size = 8,
    perc_analyte_overlap = perc_analyte_overlap,
    min_pathway_tocluster = min_pathway_tocluster,
    perc_pathway_overlap = perc_pathway_overlap
  )
  file <- ggsave(filename,clustered_plot, width = 10, height = 10)
  r <- readBin(file,'raw',n = file.info(file)$size)
  unlink(filename)
  return(r)
}

#####
#' Perform chemical enrichment on given metabolites
#' @param metabolites
#' @param file: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/chemical-enrichment
function(metabolites, file = '', pop = "database") {
  pop <- gsub("\r\n", ",", file)
  if(length(pop) > length(metabolites)) {
    chemical_enrichment_df <- tryCatch({
      classes_df <- RaMP::chemicalClassEnrichment(
        metabolites,
        pop
      )
    },
      error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      })
  } else {
    chemical_enrichment_df <- tryCatch({
      classes_df <- RaMP::chemicalClassEnrichment(
        metabolites,
        pop = "database"
      )
    },
      error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      })
  }
    return(
      list(
        data = chemical_enrichment_df
      )
    )
  }











