library(devtools)

#install_github("ncats/RaMP-DB", force = TRUE, dependencies=TRUE)

# test sqlite branch
install_github("ncats/RaMP-DB@sqlite", force = TRUE, dependencies=TRUE)

library(RaMP)

