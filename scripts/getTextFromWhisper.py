import os

from datetime import datetime
from rich.pretty import pprint
from rich.console import Console
import whisper
import json
console = Console()

def p(object):
    pprint(object, max_depth=2, console=console)

current_date = str(datetime.now().date())
basepath = 'files/data/hashtagsOrHandlesVideos/'+current_date
files = os.listdir(basepath)
# for file in files:
#   console.log(file)
file = files[1]
fullpath = basepath+'/'+file
model = whisper.load_model("small.en")
with open(fullpath,'r+') as fileOpen:
  p(fullpath)
  p(fileOpen)
  fileData = json.load(fileOpen)
  for id in fileData['videos']:
    if fileData['videos'][id].get('transcribe') is not None: continue
    if fileData['videos'][id].get('transcribe') is None: p(id)
    result = model.transcribe("files/downloadedVideos/"+id+".mp3", fp16=False)
    # pprint(result)
    pprint(id)
    pprint(result["text"])
    fileData['videos'][id].update({'transcribe': result['text']})
    fileOpen.seek(0) # set at offset
    json.dump(fileData, fileOpen, indent = 4)

      


# f=open('files/data/hashtagsOrHandlesVideos')