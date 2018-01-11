var express = require("express"),
    expressSanitizer = require("express-sanitizer"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");
    
//App Config.
//mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb://mitaksh:tekblog@ds251277.mlab.com:51277/tekblog");
// mongodb://mitaksh:tekblog@ds251277.mlab.com:51277/tekblog
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //This express-sanitizer can always use after bodyparser only
app.use(methodOverride("_method"));

//Schema-Mongoose/Model Config.
var blogSchema = new mongoose.Schema({
    title: String,
    image: String, //{type: String, default: "placeholderimage.jpg"}
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//title
//image
//body
//created

//Restful Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs: blogs});
        }
    }); 
});

//New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
})

//Create Route
app.post("/blogs", function(req, res){
    
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            //redirect to the Index
            res.redirect("/blogs");
        }
    });
});

//SHOW Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog: foundBlog})
        }
    });
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else{
             res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE Route
app.put("/blogs/:id", function(req, res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id );
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //Delete/destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Restful Blog App is Running now...!!");
});