// scripts/getVideoFromId.js <ID> --> for the video link
// scripts/getVideFromId.js <ID> verbose --> for all the video information


import dotenv from 'dotenv'
import TikAPI from 'tikapi'

dotenv.config({path: '.env.local'})
const api = TikAPI(process.env.tik_api_key);


export default async function main(id=process.argv[2],param=process.argv[3]) {

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

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});