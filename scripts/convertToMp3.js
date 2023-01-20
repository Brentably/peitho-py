import fs from 'fs'
import Ffmpeg from 'fluent-ffmpeg'
import delay from 'delay'

async function main() {
  const allFiles = fs.readdirSync('files/downloadedVideos')

  for(let fileString of allFiles) {
    // skip if mp3
    if(fileString.endsWith('mp3')) continue
    // if mp4, check for mp3. skip if it exists.
    const id = fileString.slice(0, fileString.length-4)
    if(fs.existsSync('files/downloadedVideos/'+id+'.mp3')) continue
    // convert to mp3
    console.log('converting '+ fileString)
    Ffmpeg('files/downloadedVideos/'+id+'.mp4')
      .output('files/downloadedVideos/'+id+'.mp3')
      .run()
    delay(1000)
  }


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});