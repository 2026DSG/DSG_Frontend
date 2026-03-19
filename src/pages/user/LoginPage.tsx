import styled from "@emotion/styled";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import EyeClose from "../../assets/EyeClose.svg";
import { useState } from "react";
import EyeOpen from "../../assets/EyeOpen.svg";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/login";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const isValid = username.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {
    try {
      await loginUser({ username, password });
      navigate("/admin/teachers");
    } catch (err) {
      console.error(err)
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };
  return (
    <Body>
      <TotalContainer>
        <Header title="Login" showBack />
        <LoginForm>
          <Title>Login</Title>
          <FormBox>
            <InputBox>
              <span>아이디</span>
              <LoginInput
                type="text"
                placeholder="아이디를 입력해주세요"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputBox>
            <InputBox>
              <span>비밀번호</span>

              <PwdContainer>
                <PwdInput
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <EyeButton
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <img src={showPassword ? EyeOpen : EyeClose} alt="" />
                </EyeButton>
              </PwdContainer>
            </InputBox>
          </FormBox>
          <LoginButton disabled={!isValid} onClick={handleLogin}>
            로그인
          </LoginButton>
        </LoginForm>
      </TotalContainer>
      <Footer />
    </Body>
  );
};

const EyeButton = styled.button`
  border: none;
  background: transparent;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
    opacity: 0.6;
  }
`;

// ---------

const Body = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
  zoom: 0.8;
  flex: 1;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: 460px;
  margin-top: 120px;
  gap: 40px;
`;

const Title = styled.span`
  font-size: 36px;
  display: flex;
  align-self: center;
  font-weight: 700;
`;

const FormBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  span {
    font-size: 20px;
  }
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LoginInput = styled.input`
  border-radius: 6px;
  padding: 15px;
  font-size: 20px;
  border: 1px solid #c1c6d1;

  :focus {
    outline: none;
  }
`;

const LoginButton = styled.button`
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 24px;
  background-color: #c1c6d1;
  cursor: not-allowed;

  :not(:disabled) {
    background-color: #444f61;
    cursor: pointer;
  }
`;
const PwdContainer = styled.div`
  border: 1px solid #c1c6d1;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 12px;
`;

const PwdInput = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 20px;
  border: none;

  :focus {
    outline: none;
  }
`;

export default LoginPage;
