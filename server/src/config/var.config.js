import dotenv from 'dotenv'

dotenv.config();

class Config {
    #mongo_uri;
    #server_port;
    #jwt_secret;

    constructor() {
        this.#mongo_uri = process.env.MONGO_URI;
        this.#server_port = process.env.SERVER_PORT;
        this.#jwt_secret = process.env.JWT_SECRET;
    }

    get MongoURI() {
        return this.#mongo_uri
    }

    get ServerPort() {
        return this.#server_port
    }

    get JwtSecret() {
        return this.#jwt_secret
    }
}

export const config = new Config();