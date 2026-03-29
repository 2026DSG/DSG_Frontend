import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import ArrowLeft from "../../assets/arrowLeft.svg";
import ArrowRight from "../../assets/arrowRight.svg";
import user from "../../assets/user.svg";

import { getMealList, deleteMealById } from "../../services/mealService";
import type { MealType, MealItem } from "../../services/mealService";

type BaseMealType = "LUNCH" | "DINNER";

type ToastType = "success" | "error";
interface Toast {
  text: string;
  type: ToastType;
}

const formatDate = (date: Date): string => {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day   = String(date.getDate()).padStart(2, "0");
  return `${year} / ${month} / ${day}`;
};

const toDateParam = (date: Date): string => {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day   = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 현재 시각 기준 기본 식사 타입 (신청하기 버튼 클릭 시 사용)
const getDefaultMealType = (): BaseMealType => {
  const now         = new Date();
  const totalMinute = now.getHours() * 60 + now.getMinutes();
  if (totalMinute >= 13 * 60 + 30) return "DINNER";
  return "LUNCH";
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const dateQuery = searchParams.get("date");
  const mealQuery = searchParams.get("meal") as BaseMealType | null;

  const currentDate = dateQuery ? new Date(dateQuery) : new Date();
  // 표 조회를 위한 mealType (토글 버튼에 의해 변경됨)
  const mealType = mealQuery || getDefaultMealType();
  const currentDateString = toDateParam(currentDate);

  const [mealList, setMealList] = useState<MealItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const typesToFetch: MealType[] =
          mealType === "LUNCH" ? ["LUNCH", "LUNCH_SELF"] : ["DINNER", "DINNER_SELF"];

        const [normalData, selfData] = await Promise.all([
          getMealList(currentDateString, typesToFetch[0]),
          getMealList(currentDateString, typesToFetch[1]),
        ]);

        const combined = [...normalData, ...selfData].sort((a, b) => a.id - b.id);
        setMealList(combined);
      } catch {
        showToast("데이터를 불러오지 못했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentDateString, mealType]);

  const showToast = (text: string, type: ToastType): void => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDateChange = (step: number): void => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + step);
    setSearchParams({ date: toDateParam(newDate), meal: mealType });
  };

  const handleMealTypeChange = (newMeal: BaseMealType): void => {
    setSearchParams({ date: currentDateString, meal: newMeal });
  };

  const handleDeleteClick = (id: number): void => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (deletingId === null) return;
    try {
      await deleteMealById(deletingId);
      setMealList((prev) => prev.filter((item) => item.id !== deletingId));
      showToast("삭제되었습니다.", "success");
    } catch {
      showToast("삭제에 실패했습니다.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleApplyClick = (): void => {
    // 신청하기 버튼 클릭 시, 조회 중인 mealType이 아닌 '현재 시간 기준' 기본값으로 고정하여 넘깁니다.
    const defaultApplyMeal = getDefaultMealType();
    navigate(`/apply/reason?meal=${defaultApplyMeal}&date=${currentDateString}`);
  };

  return (
    <Body>
      {toast !== null && (
        <ToastMessage type={toast.type}>{toast.text}</ToastMessage>
      )}

      {deletingId !== null && (
        <ModalOverlay>
          <ModalBox>
            <ModalMessage>정말 삭제하시겠습니까?</ModalMessage>
            <ModalButtons>
              <CancelButton onClick={() => setDeletingId(null)}>취소</CancelButton>
              <ConfirmDeleteButton onClick={handleDeleteConfirm}>삭제</ConfirmDeleteButton>
            </ModalButtons>
          </ModalBox>
        </ModalOverlay>
      )}

      <TotalContainer>
        <Header title="메인페이지" />

        <ControlRow>
          <YearNavigator>
            <img src={ArrowLeft as string} alt="이전 날짜" onClick={() => handleDateChange(-1)} />
            <Years>{formatDate(currentDate)}</Years>
            <img src={ArrowRight as string} alt="이후 날짜" onClick={() => handleDateChange(1)} />
          </YearNavigator>

          <MealToggleGroup>
            <MealToggleButton
              active={mealType === "LUNCH"}
              onClick={() => handleMealTypeChange("LUNCH")}
            >
              중식
            </MealToggleButton>
            <MealToggleButton
              active={mealType === "DINNER"}
              onClick={() => handleMealTypeChange("DINNER")}
            >
              석식
            </MealToggleButton>
          </MealToggleGroup>

          <LoginButton onClick={() => navigate("/login")}>
            <img src={user as string} alt="유저 아이콘" />
            Login
          </LoginButton>
        </ControlRow>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>사유</Th>
                <Th>부서</Th>
                <Th>직위</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <Tbody>
              {!isLoading && mealList.length === 0 && (
                <Tr><EmptyTd colSpan={5}>신청 내역이 없습니다.</EmptyTd></Tr>
              )}

              {!isLoading && mealList.map((item: MealItem) => (
                <Tr key={item.id}>
                  <Td>{item.teacherName}</Td>
                  <Td>{item.reason}</Td>
                  <Td>{item.department}</Td>
                  <Td>{item.position}</Td>
                  <Td>
                    <DeleteButton onClick={() => handleDeleteClick(item.id)}>삭제</DeleteButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>

        <ButtonBox>
          <ApplyButton onClick={handleApplyClick}>신청하기</ApplyButton>
        </ButtonBox>
      </TotalContainer>
      <Footer />
    </Body>
  );
};

interface MealToggleButtonProps {
  active: boolean;
}
interface ToastMessageProps {
  type: ToastType;
}

const Body = styled.div`
  width: 100vw;
  height: 100vh;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 34px;
`;

const YearNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;

  img {
    width: 8px;
    cursor: pointer;
  }
`;

const Years = styled.span`
  font-size: 20px;
  padding-bottom: 6px;
`;

const MealToggleGroup = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
`;

const MealToggleButton = styled.button<MealToggleButtonProps>`
  padding: 8px 16px;
  font-size: 20px;
  border: none;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#444f61" : "white")};
  color: ${({ active }) => (active ? "white" : "#444f61")};
`;

const LoginButton = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  margin-top: 21px;
  max-height: 370px;
  height: 370px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Thead = styled.thead`
  background-color: #444f61;
  color: white;
`;

const Tbody = styled.tbody`
  tr:nth-of-type(odd) {
    background-color: white;
  }
  tr:nth-of-type(even) {
    background-color: #eef0f4;
  }
`;

const Tr = styled.tr``;

const Th = styled.th`
  background-color: #444f61;
  border-bottom: 2px solid #ccc;
  padding: 12px;
  font-size: 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Td = styled.td`
  border-right: 1px solid #e0e0e0;
  padding: 12px;
  font-size: 24px;
  text-align: center;
`;

const EmptyTd = styled.td`
  padding: 40px;
  font-size: 18px;
  text-align: center;
  color: #888;
`;

const DeleteButton = styled.button`
  font-size: 20px;
  padding: 5px 29px;
  border: none;
  border-radius: 6px;
  color: white;
  background-color: #444f61;
  cursor: pointer;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const ApplyButton = styled.button`
  padding: 20px 120px;
  font-size: 32px;
  color: white;
  border: none;
  border-radius: 12px;
  background-color: #444f61;
  cursor: pointer;
`;

const ToastMessage = styled.div<ToastMessageProps>`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 16px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: ${({ type }) => (type === "success" ? "#27ae60" : "#e74c3c")};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 36px 48px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ModalMessage = styled.p`
  font-size: 22px;
  color: #222;
  margin: 0 0 28px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const CancelButton = styled.button`
  padding: 12px 36px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  color: #444;
  cursor: pointer;
`;

const ConfirmDeleteButton = styled.button`
  padding: 12px 36px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  background: #444f61;
  color: white;
  cursor: pointer;
`;

export default HomePage;