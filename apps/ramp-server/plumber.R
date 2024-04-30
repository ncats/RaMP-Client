library(plumber)
library(sqldf)
library(config)
library(R.cache)
library(readr)
library(ggplot2)

#* @apiTitle RaMP_API
#* @apiDescription REST API for the Relational Database of Metabolomics Pathways (RaMP) Application
#* @apiVersion 1.0.1

serializers <- list(
  "json" = serializer_json(),
  "tsv" = serializer_tsv()
)

makeFunctionCall<-function(input, functionName){
    input <- paste(input, collapse = '", "')
    input <- paste0('c("',input,'")')
    string <- paste0("RaMP::",functionName,"(",input,")")
    string <- gsub('(.{1,130})(\\s|$)', '\\1\n', string)
    return(string)
}

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
#* @get /api/source-versions
function() {
  version_info <- RaMP::getCurrentRaMPSourceDBVersions(db = rampDB)

  return(list(
    data = version_info,
    function_call="RaMP::getCurrentRaMPSourceDBVersions()"
  ))
}

######
#* Return database version id
#* @serializer unboxedJSON
#* @get /api/ramp-db-version
function() {
  version <- RaMP::getCurrentRaMPVersion(db = rampDB)

  return(list(
    data = version,
    function_call="RaMP::getCurrentRaMPVersion()"
  ))
}

######
#* Return current database file url
#* @serializer unboxedJSON
#* @get /api/current-db-file-url
function() {
  versionInfo <- RaMP::getCurrentRaMPVersion(db = rampDB, justVersion = FALSE)
  dbURL <- unlist(versionInfo$db_sql_url)
  return(list(
    data = dbURL,
    function_call="RaMP::getCurrentRaMPVersion(justVersion = FALSE)"
  ))
}



####
#* Return analyte ID types
#* @serializer unboxedJSON
#* @get /api/id-types
function() {
  met <- RaMP::getPrefixesFromAnalytes(db = rampDB, "metabolite")
  gene <- RaMP::getPrefixesFromAnalytes(db = rampDB, "gene")

  return(list(
    data = rbind(met,gene),
    function_call='RaMP::getPrefixesFromAnalytes("metabolite"); RaMP::getPrefixesFromAnalytes("gene")'
  ))
}

####
#* Return counts on entities and their associations
#* @serializer unboxedJSON
#* @get /api/entity-counts
function() {
  entity_counts <- RaMP::getEntityCountsFromSourceDBs(db = rampDB)

  return(list(
    data = entity_counts,
    function_call="RaMP::getEntityCountsFromSourceDBs()"
  ))
}

###
#* Return analyte source intersects
#* @param analytetype specifies type of analyte intersects to return, 'metabolites' or 'genes'
#* @param query_scope specifies 'global' or 'mapped-to-pathway'
#* @get /api/analyte-intersects
function(analytetype, query_scope = 'global') {
  response <- ""
  if(!missing(analytetype)) {
    if(analytetype == 'metabolites') {
      response <- RaMP::getRaMPAnalyteIntersections(db = rampDB, analyteType=analytetype, format='json', scope=query_scope)
      function_call <- paste0("RaMP::getRaMPAnalyteIntersections(analyteType='metabolites', format='json', scope='",query_scope,")")
    } else {
      response <- RaMP::getRaMPAnalyteIntersections(db = rampDB, analyteType=analytetype, format='json', scope=query_scope)
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
  ontologies <- RaMP::getOntologies(db = rampDB)
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
    getMetabClassTypes(db = rampDB)
  },
    error = function(cond) {
      return(data.frame(stringsAsFactors = FALSE))
    })
  return(classtypes)
}

#####
#' Return pathways from given list of analytes
#' @post /api/pathways-from-analytes
#' @param analytes:[string]
function(analytes) {
    pathways_df <- tryCatch({
        pathways_df <- RaMP::getPathwayFromAnalyte(db = rampDB, analytes = analytes)
    },
    error = function(cond) {
        return(data.frame(stringsAsFactors = FALSE))
    })
    return(
        list(
            data = unique(pathways_df),
            function_call = makeFunctionCall(analytes,"getPathwayFromAnalyte"),
            numFoundIds = length(unique(pathways_df$commonName))
        )
    )
}

##########
#' Return analytes from given list of pathways as either json or a tsv
#' @param pathway
#' @param analyte_type
#' @param names_or_ids
#' @param match
#' @param max_pathway_size
#' @post /api/analytes-from-pathways
function(pathway, analyte_type="both", names_or_ids="names", match="fuzzy", max_pathway_size=1000) {
  analyte <- analyte_type
  analytes_df <- tryCatch({
    RaMP::getAnalyteFromPathway(db = rampDB, pathway = pathway, analyte_type=analyte, match=match, names_or_ids=names_or_ids, max_pathway_size=max_pathway_size)
  },
    error = function(cond) {
      print(cond)
      return(data.frame())
    })
  analytes_df[is.na(analytes_df)] <- ""
  return(
      list(
          data = analytes_df,
          function_call = makeFunctionCall(pathway,"getAnalyteFromPathway"),
          numFoundIds = length(unique(analytes_df$pathwayName))
      )
  )
}

#####
#* Return ontologies from list of metabolites
#* @param metabolite
#* @param namesOrIds one of “name” or “ids”, default “ids"
#* @post /api/ontologies-from-metabolites
function(metabolite, namesOrIds= "ids") {
    ontologies_df <-
        RaMP::getOntoFromMeta(db = rampDB, analytes = metabolite, NameOrIds = namesOrIds)
    if(is.null(ontologies_df)){
        ontologies_df<-data.frame()
    }
    return(
        list(
            data = ontologies_df,
            function_call = makeFunctionCall(metabolite, "getOntoFromMeta"),
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
 # ontologies_names <- paste(ontologies_names, collapse = ", ")
  ontologies <- RaMP::getMetaFromOnto(db = rampDB, ontology = ontologies_names)
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
          function_call = makeFunctionCall(ontology,"getMetaFromOnto"),
          numFoundIds = length(unique(ontologies$Ontology))
        )
      )
    }
  }
}

######
#' Return available chemical classes of given metabolites in RaMP-DB
#' @param metabolites
#' @param biospecimen
#' @param file: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/chemical-classes
function(metabolites="") {
    ## 4/25 - add a trycatch here
    chemical_class_df <- tryCatch({RaMP::chemicalClassSurvey(
                                             db = rampDB,
                                             metabolites,
                                             background = NULL,
                                             background_type= "database"
                                         )},
                                  error = function(cond){
                                      print(cond)
                                      return(data.frame())
                                  })
    return(
        list(
            data = chemical_class_df$met_classes,
            function_call = makeFunctionCall(metabolites,"chemicalClassSurvey"),
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
    properties <- property
    if (!is.null(property)) {
        properties <- c(property)
    }
    chemical_properties_df <- tryCatch({
        analytes_df <- RaMP::getChemicalProperties(
                                 db = rampDB,
                                 metabolites,
                                 propertyList = properties
                             )$chem_props
    },
    error = function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
    })
    return(
        list(
            data = chemical_properties_df,
            function_call = makeFunctionCall(metabolites,"getChemicalProperties"),
            numFoundIds = length(unique(chemical_properties_df$chem_source_id))
        )
    )
}

####
#' Return analytes involved in same reaction as given list of analytes
#' @param analyte
#' @post /api/common-reaction-analytes
function(analyte) {
  analytes_df_ids <- tryCatch({
    analytes_df <- RaMP::rampFastCata(
      db = rampDB,
      analytes = analyte,
      NameOrIds = "ids"
    )

    hmdbMatches <- unlist(unique(analytes_df[[1]]$input_analyte))
    rheaMatches <- unlist(unique(analytes_df[[2]]$input_analyte))
    idMatches = length(union(hmdbMatches, rheaMatches))

    # this is the return object from the try/catch
    # with ramp v3.0, the result is a dataframe of HMDB results and a second dataframe of Rhea results
    list(data=analytes_df, idMatchCount=idMatches)
  },
    error = function(cond) {
      idMatches = 0
      return(data.frame(stringsAsFactors = FALSE))
    })

  # Removing Capacity to search by name for now - EM 12/13/2021
  #    analytes_df_names <- tryCatch({
  #        analytes_df <- RaMP::rampFastCata(
  #            analytes = analytes,
  #            namesOrIds = "names"
  #        )
  #    },
  #        error = function(cond) {
  #            return(data.frame(stringsAsFactors = FALSE))
  #        }
  #    )
  #    analytes_df <- rbind(analytes_df_ids, analytes_df_names)

  return(
    # note... currently we're just returning the HMDB results.
    # RaMP v3 also has Rhea results that can be displayed
    # It would be referenced like this in this method:  analytes_df_ids$data$Rhea_Analyte_Associations
    # note below we only reference the HMDB result until the UI can process both dataframes.
    list(
      data = unique(analytes_df_ids$data$HMDB_Analyte_Associations),
      function_call = makeFunctionCall(analyte,"rampFastCata"),
      numFoundIds = analytes_df_ids$idMatchCount
    )
  )
}
#####
#' Return combined Fisher's test results
#' from given list of analytes query results
#' @param analytes
#' @param biospecimen
#' @param file: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/combined-fisher-test
#' @serializer json list(digits = 6)
function(analytes = '', biospecimen = '', file = '', background_type= "database") {
  fishers_results_df <- ''
  if(file == "") {
    if(biospecimen == "") {
      print("run with database background")
      fishers_results_df <- RaMP::runCombinedFisherTest(
        db = rampDB,
        analytes,
        background = NULL,
        background_type= "database"
      )
    } else {
      print("run with biospecimen")
      fishers_results_df <- RaMP::runCombinedFisherTest(
        db = rampDB,
        analytes = analytes,
        background = biospecimen,
        background_type= "biospecimen"
      )
    }
  }
   else {
    print("run with background file")
    bg <- gsub("\r\n", ",", file)
       background <- unlist(strsplit(bg, ','))
       if(length(background) > length(analytes)) {
      fishers_results_df <- RaMP::runCombinedFisherTest(
        db = rampDB,
        analytes = analytes,
        background = background,
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
  perc_analyte_overlap = 0.5,
  perc_pathway_overlap = 0.5,
  min_pathway_tocluster=2
) {
  if (typeof(min_pathway_tocluster) == "character") {
    min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
  }
  clustering_results <- RaMP::findCluster(
    db = rampDB,
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
  perc_analyte_overlap = 0.5,
  perc_pathway_overlap = 0.5,
  min_pathway_tocluster=2,
  filename
) {
  if (typeof(min_pathway_tocluster) == "character") {
    min_pathway_tocluster <- strtoi(min_pathway_tocluster, base = 0L)
  }

  clustered_plot <- RaMP::pathwayResultsPlot(
    db = rampDB,
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
#' @param biospecimen
#' @param file: File
#' @parser multi
#' @parser text
#' @parser json
#' @post /api/chemical-enrichment
function(metabolites = '', file = '', biospecimen = '', background = "database") {
  chemical_enrichment_df <- ''
  if(file == "") {
    if(biospecimen == "") {
      print("run with database background")
      chemical_enrichment_df <- RaMP::chemicalClassEnrichment(
        db = rampDB,
        metabolites,
        background = NULL,
        background_type= "database"
      )
    } else {
      print("run with biospecimen")
      chemical_enrichment_df <- RaMP::chemicalClassEnrichment(
        db = rampDB,
        metabolites,
        background = biospecimen,
        background_type= "biospecimen"
      )
    }
  }
  else {
    print("run with background file")
    bg <- gsub("\r\n", ",", file)
    background <- unlist(strsplit(bg, ','))
    if(length(background) > length(metabolites)) {
      chemical_enrichment_df <- RaMP::chemicalClassEnrichment(
        db = rampDB,
        metabolites,
        background = background,
        background_type= "list"
      )
    } else {
      error <- function(cond) {
        print(cond)
        return(data.frame(stringsAsFactors = FALSE))
      }
    }
  }
    return(
      list(
        data = chemical_enrichment_df
      )
    )
  }


###########
########### Reaction endpoints
###########



#' Returns reactions associated with input analytes, metabolites and/or genes/proteins.
#' @param analytes
#' @param namesOrIds
#' @param onlyHumanMets
#' @param humanProtein
#' @param includeTransportRxns
#' @param rxnDirs
#' @post /api/reactions-from-analytes
#' @serializer json list(digits = 6)
function(
    analytes,
    namesOrIds,
    onlyHumanMets = false,
    humanProtein = true,
    includeTransportRxns = true,
    rxnDirs = 'UN'
) {

  result = getReactionsForAnalytes(
    db=rampDB,
    analytes=analytes,
    namesOrIds = 'ids',
    onlyHumanMets = onlyHumanMets,
    humanProtein = humanProtein,
    includeTransportRxns,
    rxnDirs = rxnDirs
  )

  analyteStr = RaMP:::listToQueryString(analytes)
  rxnDirs = RaMP:::listToQueryString(rxnDirs)

  return(
    list(
      data = result,
      function_call = paste0("RaMP::getReactionsForAnalytes(db=RaMPDB, analytes=c(",analyteStr,"), namesOrIds='ids', onlyHumanMets=",onlyHumanMets,", humanProtein=",humanProtein,", includeTransportRxns=",includeTransportRxns,", rxnDirs=c(",rxnDirs,")")
    )
  )
}


#' getReactionClassesForAnalytes returns reactions class and EC numbers for a collection of input compound ids
#'
#' @param analytes
#' @param multiRxnParticipantCount
#' @param humanProtein
#' @param concatResults
#' @post /api/reaction-classes-from-analytes
#' @serializer json list(digits = 6)
function(
    analytes,
    multiRxnParticipantCount = 1,
    humanProtein,
    concatResults = true
) {
  result = getReactionClassesForAnalytes(db=rampDB, analytes=analytes, multiRxnParticipantCount = multiRxnParticipantCount, humanProtein=humanProtein, concatResults=concatResults)

  analyteStr = RaMP:::listToQueryString(analytes)

  return(
    list(
      data = result,
      function_call = paste0("RaMP::getReactionClassesForAnalytes(db=RaMPDB, analytes=c(",analyteStr,"), multiRxnParticipantCount=",multiRxnParticipantCount,", humanProtein=",humanProtein,", concatResults=",concatResults,")")
    )
  )
}


#' getReactionParticipants returns protein information for a list of reaction ids.
#' This utility method can help extend information from previous queries.
#' For instance, if a user queries for reactions related to a list of metabolites,
#' this method can be used to return proteins on some subset of reaction ids to find related proteins.
#'
#' @param reactionList Rhea reactions ids, such as rhea:38747
#' @post /api/get-reaction-participants
#' @serializer json list(digits = 6)
function(
  reactionList
) {
  result = getReactionParticipants(db=rampDB, reactionList=reactionList)

  rxnStr = RaMP:::listToQueryString(reactionList)

  return(
    list(
      data = result,
      function_call = paste0("RaMP::getReactionParticipants(db=RaMPDB, reactionList=c(",rxnStr,"))")
    )
  )
}


#' getReactionDetails returns general reaction information for a list of reaction ids.
#' This utility methed can help extend information from previous queries.
#' For instance, if a user queries for reactions related to a list of analytes, or filtered on reactions,
#' this method can be used to return general reaction info on some subset of reaction ids of interest.
#'
#' @param reactionList list of reaction ids
#' @post /api/get-reaction-details
#' @serializer json list(digits = 6)
function(
    reactionList
) {
  result = getReactionDetails(db=rampDB, reactionList=reactionList)

  rxnStr = RaMP:::listToQueryString(reactionList)

  return(
    list(
      data = result,
      function_call = paste0("RaMP::getReactionDetails(db=RaMPDB, reactionList=c(",rxnStr,"))")
    )
  )
}



