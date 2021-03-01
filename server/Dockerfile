FROM rstudio/plumber:v1.0.0

RUN apt-get update && apt-get install -y build-essential libcurl4-gnutls-dev libxml2-dev libssl-dev default-libmysqlclient-dev

RUN R -e "install.packages(c('devtools', 'sqldf', 'config'))"

COPY plumber.R /usr/local/lib/R/site-library

CMD ["usr/local/lib/R/site-library/plumber.R"]
