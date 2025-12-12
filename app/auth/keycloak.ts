import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8081",
    realm: "JuCanEat",
    clientId: "JuCanEat-frontend",
});

export default keycloak;
