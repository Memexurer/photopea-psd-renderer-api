import requests
import time 

start = time.time()
xd = requests.post(
    "http://127.0.0.1:3000/render",
    json={
        "template": "template1.psd",
        "input": {"title": "titel", "subtitle": "sub titel"},
    },
)
print(xd.status_code)
open('example.png', 'wb').write(xd.content)
print("took " + str( time.time() - start) + "s")