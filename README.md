# CyberPanel
A futuristic dashboard and control panel app for my lair. Written in JavaScript with a Node/Express backend and a React frontend. 

My first time using Express to write server-side code, so everything you see here is a learning experience. Since this project is expected to be running constantly I tried to emphasize good security practices as much as possible. A lot of this is kindly enforced by strict browser policies. However, there are many best practices I may not yet be aware of. If you spot any security vulnerabilities, please let me know or open a new issue. Fork at your own risk :P

# What I Learned

Since this project has been a huge learning experience for me, I thought I'd share some of the things I learned below.

## Environment Variables

Since this project uses a number of different API keys, it was necessary for me to handle them carefully. I needed to make sure I wasn't hardcoding any API keys in my code, and I needed to make sure I wasn't pushing any files containing keys to the public repo. My solution for this was to learn about and implement environment variables. This allows me to load the keys out of a file in my local directory at build time and store them in memory, without exposing them to the general public.

## CORS Policies

One issue I encountered was that while my backend was retrieving the information I needed perfectly, it would still result in errored components on the frontend. After checking the logs and reading up on CORS polcies, I learned a couple key points of information:

- CORS policies are a security method to ensure cross-domain resource requests, (i.e. fetch requests) are from trusted sources only
- CORS policies are strict by default, and some browsers enforce cross-origin resource requests and headers even more strictly

To address this, I used the CORS middleware fore express and specified the Access-Control-Allow-Origin policy. 

*Note: For now, my backend allows requests from all URLs, but if I ever want this to be distributable to others I would probably add a script/guide to enable only certain ips or ranges e.g. 192.168.\*.\**


## Custom Headers on API Requests

I hadn't had to use custom headers on fetch requests before, though this is common in 3rd-party API requests involving tokens. I had to learn how HTTP request headers worked and how to modify them. This was a one-line fix for my specific use case, but I got to learn a lot about how clients and servers talk to each other in the process.


# TODO
Check issues for a list of features I plan to implement.


License: GNU GPL v3.0

