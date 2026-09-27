import dotenv from 'dotenv'

dotenv.config();

class Config {
    #mongo_uri;
    #server_port;

    constructor() {
        this.#mongo_uri = process.env.MONGO_URI;
        this.#server_port = process.env.SERVER_PORT;
    }

    get MongoURI() {
        return this.#mongo_uri
    }

    get ServerPort() {
        return this.#server_port
    }
}

export const config = new Config();