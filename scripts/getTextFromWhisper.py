# goes into /files/data/hashtagsorhandlesvideos/<today'sdate> and adds whisper text to all of the json files

import os
import time
from datetime import datetime
from rich.pretty import pprint
from rich.console import Console
import whisper
import json
console = Console()


def getIds(filePath):
    ids = []
    f=json.load(open(filePath, 'r'))
    for id in f['videos']:
       ids.append(id)
    return ids

def p(object):
    pprint(object, max_depth=2, console=console)

current_date = str(datetime.now().date())
basepath = 'files/data/hashtagsOrHandlesVideos/'+current_date
files = os.listdir(basepath)
for file in files:
    p(file)
    fileName = file
    fullpath = basepath+'/'+fileName

    model = whisper.load_model("medium.en")

    ids = getIds(fullpath)

    for index, id in enumerate(ids):
        with open(fullpath, 'r+') as file:
            file_data=json.load(file)
            if file_data['videos'][id].get('transcribe') is not None: continue
            startTime = time.time()
            result = model.transcribe("files/downloadedVideos/"+id+".mp3", fp16=False)
            endTime = time.time()
            p('-------------------------------------------------------')
            p(id + ' in ' + fileName)
            p(str(index) + " out of " + str(len(ids) - 1))
            p(str(endTime - startTime) + " seconds")
            p(result['text'])
            file_data['videos'][id].update({'transcribe': result['text']})
            file.seek(0) #set at offet
            json.dump(file_data, file, indent=4)
            file.close()
