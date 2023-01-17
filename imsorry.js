const videos = require('./files/nicksVideos.json')
const fs = require('fs')



const sortedVideos = videos.videos.sort((a, b) => b.stats.engagementRate - a.stats.engagementRate).map((item, index) => ({...item, index}))


fs.writeFileSync('files/nicksVideosSorted.json', JSON.stringify({videos: sortedVideos}))
console.log(sortedVideos)