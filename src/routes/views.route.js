import {Router} from "express"
import ProductManager from "../managers/ProductManagerFile.js"

const viewRouter = Router();
const path = "products.json";
const productManager = new ProductManager(path);

viewRouter.get("/",async(req,res)=>{
    const allProducts = await productManager.getProducts(); 
    res.render("home",{products: allProducts})
})

export default viewRouter