import express from "express";
import ffmeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

app.post("/process-video", (req, res)=> {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    console.log("inputFilePath:", inputFilePath);
    console.log("outputFilePath:", outputFilePath);

    if (!inputFilePath || !outputFilePath){
        res.status(400).send("Bad Request: Missing file path.");
    }

    ffmeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360")//scales to 360p res
        .on("end", ()=>{
            res.status(200).send("Processing finished successfully!");
        })
        .on("error", (err: any)=> {
        console.log(`An Error Occured: ${err.message}`); 
        res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
    

});

const port = process.env.PORT || 3000; 
//checks if enviroment as default port 
// assigned(when deplyed say on vercel 
// they assign programs a port. if its 
// assigned in env then stick with that, 
// if not just go to 3000. important for 
// once it's deployed but locally irrelvant) 

app.listen(port, ()=> {
    console.log(
    `Video processing service listening at http://localhost:${port}`);
});