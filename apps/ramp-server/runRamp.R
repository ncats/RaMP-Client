
ramp_api <- plumber::plumb("plumber.R")

# sets up mysql connection
source("db.R")

# starts api
ramp_api$run(host = "127.0.0.1", port = 5762)
