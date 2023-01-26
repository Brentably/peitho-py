This project has some scripts for working with the TikApi: https://tikapi.io/
Which is a TikTok api.

Downloading / scraping videos

Converting them to MP3 with FFMpeg

and

Transcribing them using OpenAI's whisper model.

To get started, run `npm install`, `pip install whisper`
and add your tik api key a .env.local file as 

tik_api_key=XXXXXXXXXX

Then run 

`node run scripts/getVideosList.js <Insert hashtag here>`

This will scrape the TikApi for Videos from that hashtag, and download them if they're above 0.2 engagement rate, as well as adding data about them in the files directory

Then run `node run scripts/convertToMp3.js` which will convert all the videos to mp3 files to be transcribed

Then run `python3 scripts/getTextFromWhisper.py` which will start the process of transcribing all the whisper videos. 
