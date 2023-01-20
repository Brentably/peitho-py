// This script will get a videos list over the past x amount of time based on a hashtag or profile handle
import dotenv from 'dotenv'
import fs from 'fs'
import TikAPI from 'tikapi'
import timestamp from 'time-stamp'
import delay from 'delay'


dotenv.config({path: '.env.local'})
const api = TikAPI(process.env.tik_api_key);

const MIN_ENGAGEMENT_RATE = 0.2


export default async function main(hashtagOrHandle=process.argv[2], cursor=undefined) {
if(!cursor && process.argv[3]) cursor = process.argv[3]
if(!hashtagOrHandle) throw new Error("no hashtag or handle, line 11 in getVideosList.js")


const isHandle = (hashtagOrHandle.charAt(0) == "@")

const dateString = timestamp('YYYY-MM-DD')
const dateAndTimeString = timestamp('YYYY-MM-DD@HH:mm')
// start file


// make file if it doesn't exist
if (!fs.existsSync(`files/data/hashtagsOrHandlesVideos/${dateString}`)) fs.mkdirSync(`files/data/hashtagsOrHandlesVideos/${dateString}`);

const path = `files/data/hashtagsOrHandlesVideos/${dateString}/${hashtagOrHandle}.json`

// start file
fs.writeFileSync(path, JSON.stringify({timeMade: dateAndTimeString, videos: {}}));

// call api, iterate through last videos of 7 days

// If hashtag
if(!isHandle) {
  const hashtag = hashtagOrHandle
  try{
    let response = await api.public.hashtag({
        name: hashtag
    });

    let hashtagId = response.json.challengeInfo.challenge.id;

    response = await api.public.hashtag({
        id: hashtagId,
        cursor
    });

    console.log(response?.json);
    let count = 0
    while(response && count < 100){
        let cursor = response?.json?.cursor;
        console.log("Getting next items ", cursor);

        // fs.writeFileSync('jsontest', JSON.stringify(response?.json))
        const videoList = response.json.itemList
        console.log('iterating through ' + videoList.length + ' items')

        const headers = response.json.$other.videoLinkHeaders
        

        for(let videoItem of videoList) {
          const file = JSON.parse(fs.readFileSync(path).toString())
          
          
          const {id, stats, stickersOnItem, video} = videoItem
          const {downloadAddr} = video
          const stickerText = stickersOnItem
          stats.engagementRate = (stats.diggCount + stats.commentCount + stats.shareCount) / stats.playCount
          // skip over if doesn't meet min engagement rate
          if(stats.engagementRate < MIN_ENGAGEMENT_RATE) continue


          // console.log(stats)
          const subtitleInfos = Boolean(video.subtitleInfos)

          const videoInfo = {
            stats,
            stickerText,
            subtitleInfos,
            downloadAddr
          }

          if(!fs.existsSync('files/downloadedVideos/'+id+'.mp4')) {
          try{
          await response.saveVideo(downloadAddr, 'files/downloadedVideos/'+id+'.mp4',{method: 'GET', headers})
          console.log('downloaded vid '+id)
          } catch (err) {console.error(err)}
          }
          
          // if video meets requirements
          if(file.videos[`${id}`]) {
            console.log('video already exists, skipping over')
            continue
          }

          file.videos[`${id}`] = videoInfo

          fs.writeFileSync(path, JSON.stringify(file))
        }

        await delay(1000) // avoids server errors
        response = await Promise.resolve(
            response?.nextItems()
        );
      count++
    }
  }
  catch(err){
    console.log(err?.statusCode, err?.message, err?.json)
  }	
}

// check if video meets requirements
// 
// save video, as well as append to json doc with video info


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});