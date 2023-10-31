library(devtools)

# test sqlite branch
##install_github("ncats/RaMP-DB@sqlite", force = TRUE, dependencies=TRUE)

install_github("ncats/RaMP-DB", ref="sqlite", force = TRUE, dependencies=TRUE)

library(RaMP)

