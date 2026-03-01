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
            <MealToggleGroup>
            <MealToggleButton active={true}>중식</MealToggleButton>
            <MealToggleButton active={false}>석식</MealToggleButton>
          </MealToggleGroup>
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

const MealToggleGroup = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
`;

const MealToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  font-size: 20px;
  border: none;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#444f61" : "white")};
  color: ${({ active }) => (active ? "white" : "#444f61")};
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