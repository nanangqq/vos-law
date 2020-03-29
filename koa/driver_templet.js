const neo4j = require('neo4j-driver')

const driver = neo4j.driver(
    'bolt://localhost:7687', // host
    neo4j.auth.basic('neo4j', 'password') // user
)

export default driver