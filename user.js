const express=require('express');
//引入连接池模块
const pool=require('../pool.js')
var router=express.Router();
//注册账号
router.post('/reg',function(req,res){
    var obj=req.body;
    //验证每一项是否为空
    //如果用户名为空
    if(obj.uname===''){
        res.send({code:401,msg:'uname required'})
        //结束函数执行
        return;
    }
    if(obj.upwd===''){
        res.send({code:402,msg:'upwd required'})
        return;
    }
    if(obj.phone===''){
        res.send({code:403,msg:'phone required'})
        return;
    }
    if(obj.email===''){
        res.send({code:404,msg:'email required'})
        return;
    }
    //执行sql语句
    pool.query('insert into xz_user set ?',[obj],function(err,result){
        if(err) throw err;
        // console.log(result);
        if(result.affectedRows>0){
            res.send({
                code:200,msg:'reg sucess'
            })
        }
    })
    //console.log(obj)
    
});
//登录路由
router.post('/login',function(req,res){
    //获取数据
    var obj=req.body;
    console.log(obj);
    //验证数据是否为空
    if(obj.uname===''){
        res.send({
            code:401,msg:'upwd required'
        })
        return;
    }
//执行sql语句查询是否有用户名和密码同事匹配的数据
pool.query('select * from xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],function(err,result){
        if(err) throw err;
        console.log(result);
        //判断登录是否成功过
        if(result.length>0){
            res.send({code:200,msg:'login suc'});
        }else{
            res.send({code:201,msg:'uname or upwd err'});
        };
    })
})
/*
router.get('/detail',function(req,res){
    var obj=req.query;
    if(obj.uid===''){
        res.send({code:401,msg:'uid or upwd err'});
        return;
    };
    pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
        if(err) throw err;
        res.send(result);
    })
})
*/
//修改数据
router.post('/update',function(req,res){
    var obj=req.body;
    var num=400;
    for(var i in obj){
        num+=1
        if(!obj[i]){
            res.send({code:num,msg:i+' required'});
            return;
        }
    }
    var uid=obj.uid;
    delete obj.uid;
    pool.query('update xz_user set ? WHERE uid=?',[obj,uid],function(err,result){
        if(err) throw err;
        console.log(result);
        if(result.affectedRows>0){
            res.send({code:200,msg:'update suc'})
        }else{
            res.send({code:201,msg:'update err'})
        }
    })
})   
//分页查询
router.get('/list',function(req,res){
    var obj=req.query;
    var count=obj.count;
    var pno=obj.pno;
    if(!count){
        count=2;
    };
    if(!pno){
        pno=1;
    };
    count=parseInt(count);
    pno=parseInt(pno);
    var start=(pno-1)*count;
    pool.query('select * from xz_user LIMIT ?,?',[start,count],function(err,result){
        if(err) throw err;
        res.send(result);
    });
});
//删除
 router.get('/delete',function(req,res){
     var obj=req.query;
    console.log(obj)
     if(!obj.uid){
         
         res.send({code:401,msg:'uid required'});
         return;
     }
     pool.query('delete from xz_user WHERE uid=?',[obj.uid],function(err,result){
         if(err) throw err;
         console.log(result);
         if(result.affectedRows>0){
             res.send({code:200,msg:'del suc'})
         }else{
            res.send({code:201,msg:'del err'})
         }
     })
     
 })
module.exports=router;
