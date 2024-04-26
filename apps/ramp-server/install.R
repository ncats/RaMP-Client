library(devtools)

# install dependency BiocManager
if (!require("BiocManager", quietly = TRUE))
  install.packages("BiocManager")
BiocManager::install("BiocFileCache", ask=FALSE)

# test sqlite branch
install_github("ncats/RaMP-DB", force = TRUE, dependencies=TRUE)

library(RaMP)

