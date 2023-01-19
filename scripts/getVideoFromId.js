// scripts/getVideoFromId.js <ID> --> for the video link
// scripts/getVideFromId.js <ID> verbose --> for all the video information


require('dotenv').config({path: '.env.local'})
const TikAPI = require('tikapi')

const tik_api_key = process.env.tik_api_key
const api = TikAPI(tik_api_key);


const id = process.argv[2]

const param = process.argv[3]


if (!id) {
  console.log('Id is not present.');
}


console.log('BRRR... getting info');

(async function(){
  try {
      let response = await api.public.video({
          id
      });
      console.log(response.json.itemInfo.itemStruct.video.playAddr);
      if(param == 'verbose') console.log(response.json)
  }
  catch(err){
      console.log(err?.statusCode, err?.message, err?.json)
  }	
})();
