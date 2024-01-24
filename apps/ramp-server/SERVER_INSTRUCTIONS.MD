# RaMP DB API

To run the API locally, please follow these steps:

1. Open a command line application that can run R commands run the following:
   1. `devtools::install_github("ncats/RAMP-DB", force = TRUE, dependencies = TRUE)`
   2. `install.packages(c('devtools', 'sqldf', 'config', 'R.cache'))`
2. Source the file `runRamp.R`

To build the application and run it in a container, just build and run the dockerfile in the server directory.
