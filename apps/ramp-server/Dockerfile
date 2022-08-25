FROM rstudio/plumber:v1.0.0

RUN apt-get update && apt-get install -y build-essential libcurl4-gnutls-dev libxml2-dev libssl-dev default-libmysqlclient-dev net-tools libglpk-dev

RUN R -e "install.packages(c('devtools', 'sqldf', 'config', 'R.cache', 'readr', 'svglite'))"

COPY plumber.R /usr/local/lib/R/site-library

COPY runRamp.R /usr/local/lib/R/site-library

COPY db.R /usr/local/lib/R/site-library

COPY install.R install.R

RUN Rscript install.R

CMD ["/usr/local/lib/R/site-library/runRamp.R"]
