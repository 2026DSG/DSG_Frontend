'use client';

import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";


// ✅ 백엔드 enum과 정확히 일치
type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";

// 화면에서 보여줄 기본 식사 타입 (중식/석식만)
type BaseMealType = "LUNCH" | "DINNER";

const getDefaultMealType = (): BaseMealType => {
  const now = new Date();
  const totalMinute = now.getHours() * 60 + now.getMinutes();
  if (totalMinute >= 13 * 60 + 30) return "DINNER";
  return "LUNCH";
};


const ApplicationReasonPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dateParam =
    searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const [currentTime, setCurrentTime] = useState<string>('');
  const [mealType, setMealType] = useState<BaseMealType>(
    (searchParams.get("meal") as BaseMealType) ?? getDefaultMealType()
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ reason 선택 시 meal enum 완성해서 전달
  const handleReasonSelect = (isSelf: boolean) => {
    let finalMeal: MealType;

    if (mealType === "LUNCH") {
      finalMeal = isSelf ? "LUNCH_SELF" : "LUNCH";
    } else {
      finalMeal = isSelf ? "DINNER_SELF" : "DINNER";
    }

    navigate(
      `/apply/teacher?meal=${finalMeal}&date=${dateParam}`
    );
  };


  return (
    <Body>
      <TotalContainer>
        <Header title="유형 선택" showBack />

        <ContentWrapper>
          <TopRow>
            <TimeDisplay>{currentTime}</TimeDisplay>

            <MealTypeText>
              {mealType === "LUNCH" ? "중식" : "석식"}
            </MealTypeText>

            <MealToggleGroup>
              {(["LUNCH", "DINNER"] as BaseMealType[]).map((meal) => (
                <MealToggleButton
                  key={meal}
                  active={mealType === meal}
                  onClick={() => setMealType(meal)}
                >
                  {meal === "LUNCH" ? "중식" : "석식"}
                </MealToggleButton>
              ))}
            </MealToggleGroup>
          </TopRow>

          <ButtonContainer>
            <ReasonButton onClick={() => handleReasonSelect(false)}>
              초과근무
            </ReasonButton>

            <ReasonButton onClick={() => handleReasonSelect(true)}>
              개인부담
            </ReasonButton>
          </ButtonContainer>
        </ContentWrapper>
      </TotalContainer>

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