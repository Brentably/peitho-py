#!/usr/bin/env python3

import json
import whisper
from typing import Iterator, TextIO
from whisper.utils import write_txt
from dotenv import load_dotenv
import os
# from pprint import pprint
from tikapi import TikAPI, ValidationException, ResponseException
from rich.pretty import pprint
from rich.console import Console
console = Console()
import requests
import ffmpeg

load_dotenv('.env.local')
token = os.environ.get("tik_api_key")
nickSecUid = os.environ.get('NICK_SEC_UID')
api = TikAPI(token)

def p(object):
    pprint(object, max_depth=2, console=console)

def downloadfile(name,url):
    name=name+".mp4"
    r=requests.get(url)
    print("****Connected****")
    f=open(name,'wb')
    print("Donloading.....")
    for chunk in r.iter_content(chunk_size=255): 
        if chunk: # filter out keep-alive new chunks
            f.write(chunk)
            # print(chunk)
    print("Done")
    f.close()

def write_json(new_data, filename='files/nicksVideos.json'):
    with open(filename,'r+') as file:
          # First we load existing data into a dict.
        file_data = json.load(file)
        # Join new_data with file_data inside emp_details
        file_data["videos"].append(new_data)
        # Sets file's current position at offset.
        file.seek(0)
        # convert back to json.
        json.dump(file_data, file, indent = 4)

def transcribeVideoList(itemList):
     for i in range(0, 29):
      item = itemList[i]
      p('NEW ITEM')
      p(item)
      stats = item['stats']
      stats['engagementRate'] = (stats['commentCount'] + stats['shareCount'] + stats['diggCount']) / stats['playCount']
      downloadAddr = item['video']['downloadAddr']
      name = item['video']['id']
      basePath = 'files/'+name
      response.save_video(downloadAddr, basePath+'.mp4')
      (
          ffmpeg
          .input(basePath+'.mp4')
          .output(basePath+'.mp3')
          .run()
      )
      model = whisper.load_model("medium.en")
      result = model.transcribe(basePath+".mp3")
      pprint(result)
      pprint(result["text"])
      video = {
        'id': name,
        'text': result["text"],
        'stats': stats,
      }
      write_json(video)
      # f= open(name+'.txt',"w+")
      # f.write(result['text'])
      # f.close()


      # def write_json(transcript: Iterator[dict], file: TextIO):
      #   for segment in transcript:
      #       print(json.dumps(segment['text']), file=file, flush=True)

      # with open(os.path.join(basePath + ".json"), "w", encoding="utf-8") as txt:
      #             write_json(result["segments"], file=txt)


        


try:

    response = api.public.posts(
        secUid=nickSecUid
    )

    # pprint(response.json())

    
    

    # pprint(response.json())
    





# iteration
    while(response):
        cursor = response.json().get('cursor')
        items = response.json()['itemList']
   
        transcribeVideoList(items)



        print("Getting next items ", cursor)
        response = response.next_items()

except ValidationException as e:
    print(e, e.field)

except ResponseException as e:
    print(e, e.response.status_code)