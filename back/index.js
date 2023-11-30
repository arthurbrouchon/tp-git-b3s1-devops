import nbpremier from './nbpremier.js';
import express from 'express';
import bodyParser from 'body-parser';
import  jwt from 'jsonwebtoken'
import   cors from 'cors';


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

const app=express();
app.use(bodyParser.json())
app.use(cors()); // Enable All CORS Requests
const publicRoutes = ['/','/authent','/nbpremier','/registration']



const authenticateJwt = (req,res,next) =>{


    const token = req.header('Authorization')

    if(!token){
        res.status(401).json({error: "authentification requise"})

    }
    jwt.verify(token,secretKey,(err,decoded)=>{
        if(err){
            res.status(401).json({error: "mauvais jwt"})
        }
        next()
    })
}

let users = [
{
"id": 1,
"pseudo": "SuperFan123",
"password": "password123"
},
{
"id": 2,
"pseudo": "HeroWatcher456",
"password": "password456"
}
];

let critics = [
{
"id": 1,
"title": "The Superhero Returns",
"critic": "Un film incroyable avec des effets spéciaux époustouflants.",
"auteurId": 1,
"date": "2023-11-01T10:00:00Z",
"likes": 2,
"comments": 2
},
{
"id": 2,
"title": "Night Hero: The Darkening",
"critic": "Un scénario un peu faible, mais des performances d'acteur solides.",
"auteurId": 2,
"date": "2023-11-16T15:30:00Z",
"likes": 4,
"comments": 1
}
];
  const secretKey="123"
 app.post('/authent',(req,res)=>{
    const {pseudo, password} = req.body
    let userIndex = users.findIndex((u) => (u.pseudo === pseudo && u.password === password))
    if( userIndex !== -1){
        console.log(jwt)
        const token = jwt.sign({pseudo:pseudo},secretKey,{expiresIn:'12h'})
            return res.json({token})
    }
    
        res.status(401).json({error: "wrong identifiers"})
   
}) 



 app.use((req,res,next)=>{
    if(publicRoutes.includes(req.path)){
        next()
    }else{
        authenticateJwt(req,res,next)
    }
 })

app.get('/nbpremier', nbpremier) 
app.post('/registration',(req,res)=>{
    let pseudo = req.body.pseudo
    const password = req.body.password
    let id = users.length+1
    const randomInt = getRandomInt(100)
    
    pseudo+=String(randomInt)
    let userIndex = users.findIndex((user) => (user.pseudo === pseudo))
    if( userIndex == -1){
        users.push({id:id,pseudo:pseudo,password:password})
        res.json(users)

    }
    res.status(401).json({error: "pseudo already taken"})
})   

app.post('/critics',(req,res)=>{
    const token = req.header('Authorization')
    const { critic, title, } = req.body
    if (critic.split(" ").length<50 || critic.split(" ").length>500){
        res.status(401).json({error: "critic needs to be between 50 and 500 words"})
    }
    let id = critics.length+1
    let date= Date()
    jwt.verify(token,secretKey,(err,decoded)=>{
    const pseudo = decoded.pseudo
    let userIndex = users.findIndex((user) => (user.pseudo === pseudo))
    critics.push({id:id,auteurId:critics[userIndex].id,title:title,critic:critic,date:date,like:0,comments:0})
    res.json(critics)
    })
    

})   

app.get('/critics', (req,res)=>{
    let criticsToShow=[]
    critics.forEach((critic)=>{
        criticsToShow.push({id:critic.id,title:critic.title,critic:critic.critic,auteurId:critic.auteurId})
    })
    res.json(criticsToShow)
})

app.get('/critics/filterByTitle', (req,res)=>{
    let criticsToShow=[]
    const title = req.body.title
    critics.forEach((critic)=>{
        if(critic.title===title){
        criticsToShow.push({id:critic.id,title:critic.title,critic:critic.critic,auteurId:critic.auteurId})}
    res.json(criticsToShow)})
})

app.get('/critics/filterByUser', (req,res)=>{
    let criticsToShow=[]
    const pseudo = req.body.pseudo
    let userIndex = users.findIndex((user) => (user.pseudo === pseudo))
    critics.forEach((critic)=>{
        if(critic.auteurId===users[userIndex].id){
        criticsToShow.push({id:critic.id,title:critic.title,critic:critic.critic,auteurId:critic.auteurId})}
    res.json(criticsToShow)})
})
app.get('/critics/filterById', (req,res)=>{
    const id = req.body.id
    let criticIndex = critics.findIndex((critic) => (critic.id === id))
    if( criticIndex == -1){
        
        res.status(401).json({error: "there are no critics with that id"})

    }
    res.json(critics[criticIndex])
    
})

app.get('/critics', (req,res)=>{
    let criticsToShow=[]
    critics.forEach((critic)=>{
        criticsToShow.push({id:critic.id,title:critic.title,critic:critic.pseudo,auteurId:critic.auteurId,critic:critic.critic})
    })
    res.json(criticsToShow)
})

app.put('/critics', (req,res)=>{
    const {id, critic, title, } = req.body

    
    let criticIndex = critics.findIndex((u) => (u.id === id ))
    if( criticIndex !== -1){
        if (critic.split(" ").length<50 || critic.split(" ").length>500){
            res.status(401).json({error: "critic needs to be between 50 and 500 words"})
        }
        if (((critic.split(" ").length-critics[criticIndex].critic.split(" ").length)/critics[criticIndex].critic.split(" ").length)>0.3){
            res.status(401).json({error: "change between critics needs to be under 30%"})
        }
    critics[criticIndex].critic = critic
    critics[criticIndex].title = title
    res.send(critics[criticIndex])
    }
    res.status(401).json({error: "there are no critics with such id"})
    


})

app.delete('/critics', (req,res)=>{
    const id = req.body.id
    let criticIndex = critics.findIndex((critic => critic.id == id));
    if(criticIndex!==-1){
        let criticDate = critics[criticIndex].date
        let currentDate = Date()
        const differenceInMilliseconds = criticDate - currentDate;
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
        res.json(differenceInDays)
        if((critics[criticIndex].likes<5 || critics[criticIndex].comments<5)&&differenceInDays>1){
    critics.splice(criticIndex,1)
    res.send(critics)}
    res.status(401).json({error: "unable to delete critic with more than 5 comments and likes or younger than 1 day"})

    } 
    
    res.status(401).json({error: "there are no critics with such id"})

})


app.get('/', (req,res)=>{
    res.send('hello world')
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

