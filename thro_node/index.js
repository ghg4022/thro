const express = require('express');
const cors = require('cors');
const app = express();

let userdata = [
    { id: 'test', pw: '1234', name: 'test', chat: '', hobby: '' },
];

app.use(express.json())
app.use(cors());
app.listen(8080,function(){
    console.log("listening on 8080")
});

// 아이디 체크
app.get('/idcheck/:id', function(req, res) {
    const id = req.params.id;   
    const idcheck = userdata.some(user => user.id === id);
    res.send({ "ok": !idcheck });
});

// 회원가입
app.get('/signup/:id/:pw/:name/', function(req, res) {
    const id = req.params.id;
    const pw = req.params.pw;
    const name = req.params.name;
    // const age = req.params.age;
    const idcheck = userdata.some(user => user.id === id);
    if(idcheck){
        res.send({ "ok": false});
    }
    else if (id && pw && name) {
        userdata.push({ id, pw, name });

        console.log("회원가입 완료 : ", userdata);
        res.send({ "ok": true });
    } 
    else {
        res.send({ "ok": false});
    }
});

// 로그인
app.get('/login/:id/:pw', function(req, res) {
    const id = req.params.id;
    const pw = req.params.pw;
    if (id && pw) {
        const user = userdata.find(user => user.id === id && user.pw === pw);

        if (user) {
            res.send({ 
                "ok": true,
                user : {id: user.id, name : user.name, pw : user.pw, age : user.age}
            });
        } else {
            res.send({ "ok": false});
        }
    } else {
        res.send({ "ok": false});
    }
});

// 가입한 사람 보기
app.get('/user', function(req, res){
    res.send(userdata);
})

// 채팅
app.get('/chat/:chat/:id', function(req, res){
    const id = req.params.id;
    const chat = req.params.chat;

    const user = userdata.find(user => user.id === id);
    if(user){
        user.chat = chat;
        res.send({"ok": true});
    }
    else{
        res.send({"ok": false});
    }
})

// 취미
app.get('/hobby/:id/:hobby', function(req, res){
    const id = req.params.id;
    const hobby = req.params.hobby;

    const user = userdata.find(user => user.id === id);
    if(user){
        user.hobby = hobby;
        res.send({"ok": true});
    }
    else{
        res.send({"ok": false});
    }
})