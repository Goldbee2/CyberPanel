# CyberPanel
A futuristic dashboard and control panel app for my lair. Written in JavaScript with a Node/Express backend and a React frontend. 

My first time using Express to write server-side code, so everything you see here is a learning experience and may not be representative of my best work. Fork at your own risk :P

# What I Learned

Since this project has been a huge learning experience for me, I thought I'd share some of the things I learned here.

## CORS Policies

One issue I encountered was that while my backend was retrieving the information I needed perfectly, it would still result in errored components on the frontend. After checking the logs and reading up on CORS polcies, I learned a couple key points of information:
- CORS policies are a security method to ensure cross-domain resource requests, (i.e. fetch requests) are from trusted sources only
- CORS policies are strict by default, and some browsers enforce cross-origin resource requests and headers even more strictly
To address this, I used the CORS middleware fore express and specified the Access-Control-Allow-Origin policy. 
*Note: For now, my backend allows requests from all URLs, but if I ever want this to be distributable to others I would probably add a script/guide to enable only certain ips or ranges e.g. 192.168.\*.\**



# TODO
Check issues for a list of features I plan to implement


License: GNU GPL v3.0

