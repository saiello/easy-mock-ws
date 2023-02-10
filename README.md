Simple way to serve static responses

Usage
---

Run easy-mock-ws

```
docker run --init -it -p 3000:3000 -v $PWD/samples/pet-store:/etc/mocks saiello/easy-mock-ws
```

Test with a sample request

```
curl -X POST -v localhost:3000/ws-pets -d@samples/pet-store/request.xml
```

Configuration
---

Folder structure

```
samples/pet-store
├── definitions
│   └── definitions.json
├── request.xml
└── responses
    └── getPetById
        ├── 1
        └── response.xml
```


Definition file

```
{
    "getPetById":{
        "endpoint": "/ws-pets",
        "timeout": 16,
        "namespaces": {
	        "env": "http://www.w3.org/2001/12/soap-envelope",
          "pets": "urn:com:example:petstore"
        },
        "matcher" : [
          {
            "xpath": "/env:Envelope/env:Body/pets:getPetByIdRequest/pets:id/text()"
          }
        ],
        "default" : "default"
    }
}
```



