PROJECT_ROOT = "../.."
PROD_VITE_ENV_PATH = f"{PROJECT_ROOT}/.mock.env.production"
PROD_FRONTEND_ENVVAR = "VITE_FRONTEND_URL"

def get_frontend_url():
    with open(PROD_VITE_ENV_PATH) as f:
        lines = f.readlines()
        envvars = {var: val for var, val in
                   [line.rstrip().split("=") for line in lines]}

    return envvars["VITE_FRONTEND_URL"]