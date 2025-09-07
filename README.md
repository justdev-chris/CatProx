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

# static deployments
static deployments are still being made so give me time to figure out how to make this static
