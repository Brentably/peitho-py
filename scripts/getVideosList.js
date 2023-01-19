// This script will get a videos list over the past x amount of time based on a hashtag or profile handle

require('dotenv').config({path: '.env.local'})
const TikAPI = require('tikapi')
const api = TikAPI(process.env.tik_api_key);

const profileOrHandle = process.argv[2]



