import express from 'express';
import bodyParser from 'body-parser';
import { readFileSync } from 'fs'; 
import puppeteer from 'puppeteer';

const app = express()
const port = 3000

const jobs = {}
const browser = await puppeteer.launch();

function createJob(id, settings) {
    return new Promise((resolve, _) => {
        jobs[id] = {
            "id": id,
            ...settings,
            "resolve": resolve
        }
    });;
}

app.use(bodyParser.raw({
    type: 'application/octet-stream',
}));
app.use(express.json());

app.get('/job/:job', function(req,res) {
    var job = jobs[req.params.job]

    res.type("html")
    res.send(
        readFileSync('photopea_index.html', {encoding: 'utf-8'})
        .replace("SCRIPT", JSON.stringify(
            readFileSync('photopea_script.js', {encoding: 'utf-8'})
            .replace("INPUT", JSON.stringify(job["input"]))
        )).replace("CONFIG", JSON.stringify({
            "job": job["id"]
        }))
    )
});
app.get("/job/:job/template.psd", (req, res) => {
    var job = jobs[req.params.job]
    res.sendFile(job["template"], { root: 'templates' });
})
app.post("/job/:job/result", (req, res) => {
    var job = jobs[req.params.job]
    job["resolve"](req.body)
    res.send("siema")

    delete jobs[req.params.job]
})
app.post("/render", async (req, res) => {
    var id = (Math.random() + 1).toString(36).substring(2);
    var jobResp = createJob(id, req.body)

    const page = await browser.newPage();
    page.goto(`${req.protocol}://${req.get('host')}/job/${id}`)

    res.type("png")
    res.send(await jobResp)

    await page.close()
})
app.listen(port, () => {
  console.log(`Photopee app listening on port ${port}`)
})
