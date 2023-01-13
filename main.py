#!/usr/bin/env python3

from dotenv import load_dotenv
import os
# from pprint import pprint
from tikapi import TikAPI, ValidationException, ResponseException
from rich.pretty import pprint
from rich.console import Console
console = Console()


load_dotenv('.env.local')
token = os.environ.get("tik_api_key")
api = TikAPI(token)

def p(object):
    pprint(object, max_depth=2, console=console)

try:
    response = api.public.hashtag(
        name="gym"
    )

    hashtagId = response.json()['challengeInfo']['challenge']['id']

    response = api.public.hashtag(
        id=hashtagId
    )


    # pprint(response.json())
    items = response.json()['itemList']
    for item in items:
        p('NEW ITEM')
        p(item)




# iteration
    # while(response):
    #     cursor = response.json().get('cursor')
    #     print("Getting next items ", cursor)
    #     response = response.next_items()

except ValidationException as e:
    print(e, e.field)

except ResponseException as e:
    print(e, e.response.status_code)