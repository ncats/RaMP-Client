
library(RaMP)

# Set up the connection to the mySQL db:
config <- config::get()
host <- config$db_host
dbname <- config$db_dbname
username <- config$db_username
conpass <- config$db_password
pkg.globals <- setConnectionToRaMP(dbname=dbname,username=username,conpass=conpass,host = host)
