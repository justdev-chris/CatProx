# CatProx

a simple proxy which works well lol

---

# problems/issues

if the domain does "/folder/index.html" it will proxy correctly, if the index.html does "/folder/" or "/folder" it will not proxy it. 
so trying to enter another page in the domain, make sure it does "/folder/index.html" 

---

# deployment
use smth which supports node.js like codesandbox or github codespaces.
1. install dependencies
```
npm install express http-proxy-middleware
```
2. in index.js change the "const CatProxURL" to your target, including "if (req.headers.host === "YourTargetDomain") {"
3.  Run the server
```
node index.js
```
4. server should run on port 3000 so visit it on port 3000

---

# if your using CatProx PHP version
1. use InfinityFree or smth to host the PHP
2. make index.php in the root directory and paste in my php code in it
3. deploy it and visit the website
note: php versions cannot handle websockets or tons of requests lol


# static deployments
static deployments are still being made so give me time to figure out how to make this static
