//import { useState } from "react";
import Header from "../../components/Header";
import styled from "@emotion/styled";

const TeacherCreatePage = () => {

  return (
    <Body>
      <TotalContainer>
        <Header />
        <TeacherFormContainer>
          <TeacherForm>
            <FormGroup>
              <FormSpan>이름</FormSpan>
              <FormInput
                type="text"
                placeholder="이름을 입력해주세요"
              ></FormInput>
            </FormGroup>
            <FormGroup>
              <FormSpan>부서</FormSpan>
              <FormInput
                type="text"
                placeholder="부서를 입력해주세요"
              ></FormInput>
            </FormGroup>
            <FormGroup>
              <FormSpan>직위</FormSpan>
              <FormInput
                type="text"
                placeholder="직위를 입력해주세요"
              ></FormInput>
            </FormGroup>
          </TeacherForm>
          <CreateButton >등록하기</CreateButton>
        </TeacherFormContainer>
      </TotalContainer>
    </Body>
  );
};

const Body = styled.div`
  width: 100vw;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
  zoom: 0.8;
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
  padding: 18px 200px 18px 16px;
  outline: none;
  border: 1px solid #c1c6d1;
  border-radius: 6px;
  font-size: 20px;
`;

const CreateButton = styled.button`
  font-size: 24px;
  color: white;
  background-color: #C1C6D1;
  border: none;
  border-radius: 10px;
  padding: 15px 188px;
`;

export default TeacherCreatePage;
