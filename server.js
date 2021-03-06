// import your node modules
const express = require("express");
const db = require("./data/db.js");
const server = express();
const cors = require('cors')
 

server.use(express.json());

server.use(cors()); 

server.get("/api", (req, res) => {
  res.send("Hello FSW12 Express Node.js backend");
});

server.get("/api/posts", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log.error("error", error);

      res.status(500).json({ message: "Error getting the data" });
    });
});

server.get("/api/posts/:id", (req,res) => {
  const {id} = req.params
  db.findById(id)
    .then(post => {
      if(post){
        res.status(200).json(post)
      } else {
        res.status(404).json({message: `The post with specified id ${id} does not exist`})
      }
    })
    .catch(error => {
      res.status(500).json({error: "The post information could not be retrieved"})
    })
})

server.post("/api/posts", async (req, res) => {
  const post = req.body;
  if (post.title && post.contents) {
    try {
      const response = await db.insert(post);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({
        message: "There was an error while saving the post to the database",
        description: "The post was not created",
        recoveryInstructions: "Check that you are using the correct end point also make sure your properties included are  title    and   contents  ."
      });
    }
  } else {
    res
      .status(422)
      .json({
        errorMessage: "Please provide title and contents for the posts."
      });
  }
});

server.delete("/api/posts/:id", (req,res) => {
  const {id} = req.params;
  let deleting = {}; 
  db.findById(id)
    .then(post => {
      db.remove(id)
        .then(count => {
          if (count){
            res.status(200).json(post[0])
        } else {
            res.status(404).json({message: `The post with the specified ID does not exist. ${id} not found.`})
          }
        })
          .catch(error => res.status(500).json(error));
          })
    .catch(error => {
      res.status(500).json({message: `Error getting the post with id: ${id} error = ${error}`})
    })
  
})

server.put("/api/posts/:id", (req,res)=>{
  const {id} = req.params;
  const body = req.body;
  db.update(id, body)
    .then(posts => {
      if(posts){
        res.status(200).json(body)
      } else {
        res.status(404).json({errorMessage: `The post with the specified ID does not exits. Check ID: ${id}`})
      }
    })
    .catch(error => res.status(500).json({error: `The post information could not be modified for ${id}`}))
})

server.listen(9000, () => console.log("\n==API on port 9000 ==\n"));
