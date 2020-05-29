const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars');
const app=express();
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:'3306'
});
sql.query("use nodejs");
app.use('/img', express.static('img'));

// Template engine
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');/*layout principal será o handlebars*/
/*app.use('/css'.express.static('css')); para fazer uma rota para o css*/
/*app.use('/js'.express.static('js'));*/

//Routes and templates
app.get("/",function(req,res){
    /*res.send('Esta é minha página inicial')aqui envia uma msg*/
    /*res.sendFile(__dirname+"/index.html");aqui envia um arquivo*/
    res.render('index');
    /*console.log(req.params.id);*//*se quiser pegar o id*/
});
app.get("/img",function(req,res){
    res.sendFile(__dirname+ '/img');
});
app.get("/javascript",function(req,res){
    res.sendFile(__dirname+ '/js/javascript.js');
});
app.get("/style",function(req,res){
    res.sendFile(__dirname+ '/css/style.css');
});
app.get("/inserir", function(req,res){
    res.render("inserir");
});
app.get("/select/:id?", function(req,res){
    if(!req.params.id){
        sql.query("select * from user", function(err,results,fields){
            res.render('select',{data:results});
        });
    }else{
        sql.query("select * from user where id=? order by id asc", [req.params.id],function(err,results,fields){
            res.render('select',{data:results});
        });
    }
});
app.post("/controllerSelect", urlencodeParser, function(req,res){
    if(!req.params.id){
        sql.query("select * from user", function(err,results,fields){
        });
    }else{
        sql.query("select * from user where id=? order by id asc", [req.params.id],function(err,results,fields){
            res.render('controllerSelect',{data:results});
        });
    }
    /*sql.query("select * from user where id=? order by id asc", [req.params.id], function(err,results,fields){
        res.render("controllerSelect");
    });*/
});
app.get('/deletar/:id', function(req,res){
    sql.query("delete from user where id=?", [req.params.id]);
    res.render('deletar');
});
app.get('/update/:id', function(req,res){
    res.render('update',{id:req.params.id});
});
app.post("/controllerUpdate",urlencodeParser, function(req,res){
    sql.query("update user set name=?, age=? where id=?", [req.body.name, req.body.age, req.body.id])
    res.render('controllerUpdate');
});
app.post("/controllerForm",urlencodeParser, function(req,res){
    sql.query("insert into user values(?,?,?)", [req.body.id, req.body.name, req.body.age])
    res.render('controllerForm', {name:req.body.name});    
});


//Start server
app.listen(3000, function(req,res){
    console.log('Servidor está rodando!')
});