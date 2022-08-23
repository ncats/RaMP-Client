
library(RaMP)

# Set up the connection to the mySQL db:
config <- config::get()
host <- config$db_host_vprod
dbname <- config$db_dbname_vprod
username <- config$db_username_vprod
conpass <- config$db_password_vprod
pkg.globals <- setConnectionToRaMP(dbname=dbname,username=username,conpass=conpass,host = host)
