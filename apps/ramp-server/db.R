
library(RaMP)

# Set up the connection to the mySQL db:
config <- config::get()
host <- config$db_host_v2
dbname <- config$db_dbname_v2
username <- config$db_username_v2
conpass <- config$db_password_v2
pkg.globals <- setConnectionToRaMP(dbname=dbname,username=username,conpass=conpass,host = host)
