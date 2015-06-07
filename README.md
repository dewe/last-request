# last-request
A minimalist express middleware logging requests in memory. Useful for inspecting the 
last incoming request, when running express as a fake server.

```javascript
// Setup test server
var lastrequest = require('last-request'),
    recorder = lastrequest(),
    app = express();

app.use(recorder);
app.use(function (req, res) {
    res.status(200).send({hello: 'there'})
});

...

// Make asserts during test
request.get('http://my-out-of-process-server:4711', function (err, res) {
    // Verify call has happened end-to-end as expected.
    assert(res.statusCode === 200);
    assert(recorder.lastRequest().method == 'GET');
    done();
});
```