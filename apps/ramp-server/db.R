
library(RaMP)

# Set up the connection to the mySQL db:
config <- config::get()
host <- config$db_host
dbname <- config$db_dbname
username <- config$db_username
conpass <- config$db_password
port <- config$db_port

#pkg.globals <- setConnectionToRaMP(dbname=dbname,username=username,conpass=conpass,host = host)

# this call is used specifically for connection to MySQL/MariaDB databases.
rampDB <<- RaMP:::.RaMP(driver = RMariaDB::MariaDB(), dbname = dbname,
                    username = username, conpass = conpass,
                    host = host, port = as.integer(port))



