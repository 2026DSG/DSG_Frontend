import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styled from "@emotion/styled";

const TeacherCreatePage = () => {
  const [name, setName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [position, setPosition] = useState<string>("");

  const isDisabled = !name || !department || !position;
  const navigate = useNavigate();

  return (
    <Body>
      <TotalContainer>
        <Header title="교직원 등록" showBack />
        <TeacherFormContainer>
          <TeacherForm>
            <FormGroup>
              <FormSpan>이름</FormSpan>
              <FormInput
                type="text"
                value={name}
                placeholder="이름을 입력해주세요"
                onChange={(e) => setName(e.target.value)}
              ></FormInput>
            </FormGroup>
            <FormGroup>
              <FormSpan>부서</FormSpan>
              <FormInput
                type="text"
                value={department}
                placeholder="부서를 입력해주세요"
                onChange={(e) => setDepartment(e.target.value)}
              ></FormInput>
            </FormGroup>
            <FormGroup>
              <FormSpan>직위</FormSpan>
              <FormInput
                type="text"
                value={position}
                placeholder="직위를 입력해주세요"
                onChange={(e) => setPosition(e.target.value)}
              ></FormInput>
            </FormGroup>
          </TeacherForm>
          <CreateButton
            onClick={() => navigate("/get/teacher")}
            disabled={isDisabled}
          >
            등록하기
          </CreateButton>
        </TeacherFormContainer>
      </TotalContainer>
      <Footer/>
    </Body>
  );
};

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

const TeacherFormContainer = styled.div`
  margin-top: 125px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 85px;
`;

const TeacherForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FormSpan = styled.span`
  font-size: 20px;
`;

const FormInput = styled.input`
  width: 465px;
  padding: 18px 16px;
  outline: none;
  border: 1px solid #c1c6d1;
  border-radius: 6px;
  font-size: 20px;
`;

const CreateButton = styled.button<{ disabled: boolean }>`
  font-size: 24px;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 188px;
  background-color: ${({ disabled }) => (disabled ? "#c1c6d1" : "#444F61")};
`;

export default TeacherCreatePage;
