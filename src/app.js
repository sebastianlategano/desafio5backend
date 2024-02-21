import express from "express"
import{engine} from "express-handlebars"
import viewRouter from "./routes/views.route.js"
import __dirname from "./utils.js"
import {Server} from "socket.io"

const PORT = 8080;

const app = express();

const httpServer = app.listen(PORT, ()=>console.log(`Servidor funcionando en el puerto: ${PORT}`))
const socketServer = new Server(httpServer);

app.engine("handlebars",engine());
app.set("view engine","handlebars");
app.set("views",__dirname+"/views");

app.use(express.static(__dirname + "/public"))

//Rutas
app.use("/",viewRouter)

app.get("/realtimeproducts",(req,res)=>{

    res.render("realTimeProductos",{})
})

//Websocket
import ProductManager from "./managers/ProductManagerFile.js"

const path = "products.json";
const productManager = new ProductManager(path);

let allProducts = await productManager.getProducts();

socketServer.on("connection",socket=>{
    console.log("Nuevo cliente conectado")

    socketServer.emit("listarProductos",allProducts);
    
    socket.on("message",data=>{
        productManager.addProduct(data);
        allProducts.push(data);
        socketServer.emit("listarProductos",allProducts);
    })  
})

