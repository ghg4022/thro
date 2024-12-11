import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [id, setId] = useState("");
  const [login_check, setLogin_check] = useState("");
  const [pw_check, setPw_check] = useState("");
  const [login, setLogin] = useState(false); // 로그인 성공 시 개인정보 보이게 하기 위해 만듦
  const [name, setName] = useState("");
  const [sign_div, setSign_div] = useState(false);
  const [idcheck, setIdcheck] = useState(""); // 아이디 중복체크
  const [signup, setSignup] = useState("");
  const [chat, setchat] = useState("");
  const [user_chat, setUser_chat] = useState([]);
  const [hobby, setHobby] = useState("");
  const [user_hobby, setUser_hobby] = useState([]);

  const [use_user_div, setUse_user_div] = useState(false);
  const [use_user, setUse_user] = useState([]);

  // 회원가입
  const [sign_id, setSign_id] = useState("");

  // 비밀번호 변경
  const [pw, setPw] = useState(""); // 바꾸기 전 원래 비밀번호
  const [pw1, setPw1] = useState("");

  return (
    <div className="App">
      {/* 로그인  */}
      {login 
      ? <></>
      : <div>
          <h3>로그인</h3>
          <div>
            <div>아이디</div>
            <input 
              onChange={(e)=>{setId(e.target.value)}}
              placeholder='아이디'
            />
            <div>비밀번호</div>
            <input 
              onChange={(e)=>{setPw(e.target.value)}}
              placeholder='비밀번호'
              type='password'
            /><br />

            <button onClick={async ()=>{
              // 추가기능 . 빈칸으로 버튼 클릭 시
              if(id.length === 0 || pw.length === 0){
                setLogin_check("아이디나 비밀번호를 입력해주세요.")
                return; // 안하면 404 에러뜸 
              }

              setPw_check(""); // 비밀번호 변경 후 다시 로그인 했을 때 
              const login = await axios.get(`http://localhost:8080/login/${id}/${pw}`)
              if(login.data.ok){
                setLogin_check("로그인에 성공하셨습니다.");
                setLogin(true); // 개인정보
                setName(login.data.user.name); // login.data.name이라고 했을 때 서버측 값이 안가져와졌음
                // setAge(login.data.user.age);   // 서버측 이름이 user.name이라 값이 할당 안됨 
                // console.log(login.data.name)
              }
              else{
                setLogin_check("로그인에 실패하셨습니다.");
              }
            }}>로그인</button>
            <button onClick={()=>{
              setSign_div(!sign_div)
              setSignup("");
              setIdcheck("");
              }}>회원가입</button><br/>
            {login_check}
            {/* 회원간입 */}
            {sign_div &&(
              <div>
                <hr/>
                <h3>회원가입</h3>
                <div>아이디</div>
                <input onChange={(e)=>{setSign_id(e.target.value)}} placeholder='아이디' />
                <button onClick={async ()=>{
                  const idcheck = await axios.get(`http://localhost:8080/idcheck/${sign_id}`);
                  setIdcheck(idcheck.data.ok);
                  if(idcheck.data.ok){
                    setIdcheck("사용 가능");
                  }
                  else{
                    setIdcheck("사용 불가");
                  }
                }}>중복체크</button>
                {idcheck}

                <div>비밀번호</div>
                <input onChange={(e)=>{setPw1(e.target.value)}} placeholder='비밀번호' /><br/>
                <div>이름</div>
                <input onChange={(e)=>{setName(e.target.value)}} placeholder='이름' /><br/>

                <button onClick={async()=>{
                  const send = await axios.get(`http://localhost:8080/signup/${sign_id}/${pw1}/${name}`);
                  if(send.data.ok){
                    setSignup("회원가입 완료");
                    setSign_id("");
                    setPw1("");
                    setName("");
                    setSign_div(false);
                  } else{
                    console.log("실패");
                    setSignup("회원가입 실패");
                  }
                }}>가입하기</button>
              </div>
            )}
            <div>{signup}</div>
            <br/>
        </div>
      </div>
      }
      

      {/* 개인정보 */}
      {login
      ? <div>
          <h3>{name}님, 안녕하세요!</h3>
          <button onClick={async ()=>{
            setLogin(false);
            setLogin_check("");
            setId("");
            setPw("");
            setSign_div(false);
            setSignup("");
            }}>로그아웃</button>

          {/* 가입한 사람 목록 보기 */}
          <button onClick={async()=>{
            setUse_user_div(!use_user_div)
            const user = await axios.get(`http://localhost:8080/user`)
            setUse_user(user.data)
            }}>가입한 사람</button>
          {use_user_div &&(
            <div>
              <hr/><h4>가입한 사람 목록</h4>
              {use_user.map(user =>(
                <div key={user.id}>{user.name}</div>
              ))}
            </div>
          )}
          <hr/>
          <div>
            <input 
              onChange={(e)=>{setchat(e.target.value)}} 
              placeholder='할말을 입력해보세요!' 
            />
            <button onClick={async()=>{
              const hb = await axios.get(`http://localhost:8080/chat/${chat}/${id}`);
              console.log(hb.data.ok);
              if(hb.data.ok){
                setUser_chat(prev => [...prev, { name, chat }]);
              }
              else{
                console.log("실패")
              }
            }}>
              보내기
            </button>
            {user_chat.map((user, index)=>(
              <div key={index}>
                {user.name} : {user.chat}
              </div>
            ))}
          </div>
          
          <hr/>
          <h3>취미 공유하기</h3>
          <div>
            <input 
              onChange={(e)=>{setHobby(e.target.value)}}
              placeholder='취미를 입력해보세요!' />
            <button onClick={async()=>{
              const hb = await axios.get(`http://localhost:8080/hobby/${id}/${hobby}`);
              if(hb.data.ok){
                setUser_hobby(prev => [...prev, { name, hobby }]);
              }
              else{
                console.log("실패");
              }
            }}>공유</button>

            {user_hobby.map((user, index)=>(
              <div key={index}>
                {user.name}님의 취미는 '{user.hobby}'입니다.
              </div>
            ))}

          </div>

        </div>
      : <></>
      }
      
    </div>
  );
}

export default App;
