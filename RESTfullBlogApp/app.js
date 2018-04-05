var express     = require("express"),
    app         = express(),
    bodyParser   = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override");

//app config    
mongoose.connect("mongodb://localhost/restfull_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//mongoose/model config
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);


//RESTfull routes

app.get("/",function(req,res){
    res.redirect("/blogs");
});
//INDEX route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err)
        }else{
             res.render("index",{blogs:blogs});
        }
    })
});

//NEW route
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE route
app.post("/blogs",function(req, res){
    //create blog
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
           res.render("new") 
        }else{
    //redirect
            res.redirect("/blogs")
        }
    })
})

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            //render show template
            res.render("show",{blog:foundBlog});
        }
    });
});

//EDITE route
app.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            //render show template
            res.render("edit",{blog:foundBlog});
        }
    });
});

//UPDATE route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id)
        }
    });
});

//DESTROY route
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("the server has started");
});