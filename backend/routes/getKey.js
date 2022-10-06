//get weather info

require('dotenv').config();


function getKey(){
    let apiKey = APIKeys.env.API_KEY;
    return "DUMMY KEY";
}
//send weather to express


module.exports={getKey};