'use client';

import styled from "@emotion/styled";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ApplicationReasonPage = () => {
  return (
    <Body>
      <TotalContainer>
        <Header title="유형 선택" showBack />

        <ContentWrapper>
          <TopRow>
            <TimeDisplay>18:34</TimeDisplay>
            <MealTypeText>석식</MealTypeText>
            <MealSelect defaultValue="석식">
              <option value="석식">석식</option>
              <option value="중식">중식</option>
              <option value="조식">조식</option>
            </MealSelect>
          </TopRow>

          <ButtonContainer>
            <ReasonButton>초과근무</ReasonButton>
            <ReasonButton>개인부담</ReasonButton>
          </ButtonContainer>
        </ContentWrapper>
      </TotalContainer>

      {/* 푸터 추가 */}
      <Footer />
    </Body>
  );
};

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 80px;
`;

const TimeDisplay = styled.div`
  font-size: 24px;
  color: #333;
`;

const MealTypeText = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;


const MealSelect = styled.select`
  padding: 8px 16px;
  padding-right: 50px; /* 화살표가 들어갈 공간 확보 */
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  
  background-position: calc(100% - 16px) center; 
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 100px;
  margin-bottom: 100px;
`;

const ReasonButton = styled.button`
  width: 400px;
  height: 270px;
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  background-color: #444f61;
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;

export default ApplicationReasonPage;