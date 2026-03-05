"use client";

import styled from "@emotion/styled";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchIcon from "../../assets/Search.svg";



interface Teacher {
  id: number;
  name: string;
  department: string;
  position: string;
  number: number;
  createdAt: string;
}

// ✅ 백엔드 enum과 정확히 일치
type MealType = "LUNCH" | "LUNCH_SELF" | "DINNER" | "DINNER_SELF";


const CHOSUNG_LIST = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

const getChosung = (char: string): string => {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return char;
  return CHOSUNG_LIST[Math.floor(code / (21 * 28))];
};

const matchesChosung = (name: string, query: string): boolean => {
  if (!query) return true;
  for (let i = 0; i < query.length; i++) {
    if (i >= name.length) return false;
    if (getChosung(name[i]) !== query[i]) return false;
  }
  return true;
};



/**교직원 전체 목록 조회 */
const fetchTeachers = async (): Promise<Teacher[]> => {
  const response = await fetch("/teacher");
  if (!response.ok) throw new Error("교직원 목록 조회 실패");
  return response.json() as Promise<Teacher[]>;
};


/** POST /meals - 급식 신청 생성 */
const postMealApplication = async (body: {
  teacherId: number;
  meal: MealType;
  date: string;
}): Promise<void> => {
  const response = await fetch("/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("신청 실패");
};



const KEYBOARD_ROWS = [
  ["ㄱ", "ㄴ", "ㄷ"],
  ["ㄹ", "ㅁ", "ㅂ"],
  ["ㅅ", "ㅇ", "ㅈ"],
  ["ㅊ", "ㅋ", "ㅌ"],
  ["ㅍ", "ㅎ", "←"],
];



const ApplicationTeacherPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ meal만 사용 (백엔드 enum 그대로)
  const mealParam = (searchParams.get("meal") ?? "DINNER") as MealType;

  const dateParam =
    searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [chosungQuery, setChosungQuery] = useState<string>("");


  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchTeachers();
        setTeachers(data);
      } catch {
        setError("교직원 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredTeachers = useMemo(
    () => teachers.filter((t) => matchesChosung(t.name, chosungQuery)),
    [teachers, chosungQuery]
  );


  const handleKeyPress = (key: string) => {
    if (key === "←") {
      setChosungQuery((prev) => prev.slice(0, -1));
    } else {
      setChosungQuery((prev) => prev + key);
    }
    setSelectedId(null);
  };


  const handleApply = async () => {
    if (selectedId === null || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await postMealApplication({
        teacherId: selectedId,
        meal: mealParam,
        date: dateParam,
      });

      navigate("/");
    } catch {
      setError("신청에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <Body>
      <ContentWrapper>
        <TotalContainer>
          <Header title="교직원 선택" showBack />

          <TabContainer>
            <TabButton active={true}>{mealParam}</TabButton>
          </TabContainer>

          <MainContent>
            <SearchSection>
              <SearchInputWrapper>
                <StyledInput
                  type="text"
                  readOnly
                  placeholder="초성으로 검색해주세요."
                  value={chosungQuery}
                />
                <img src={SearchIcon} alt="search" width={20} height={20} />
              </SearchInputWrapper>

              <KeyboardContainer>
                {KEYBOARD_ROWS.map((row, rowIdx) => (
                  <KeyboardRow key={rowIdx}>
                    {row.map((key) => (
                      <KeyButton key={key} onClick={() => handleKeyPress(key)}>
                        {key}
                      </KeyButton>
                    ))}
                  </KeyboardRow>
                ))}
              </KeyboardContainer>
            </SearchSection>

            <TableSection>
              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      <Th>이름</Th>
                      <Th>부서</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {isLoading && (
                      <tr>
                        <StatusTd colSpan={2}>불러오는 중...</StatusTd>
                      </tr>
                    )}

                    {!isLoading && filteredTeachers.length === 0 && (
                      <tr>
                        <StatusTd colSpan={2}>검색 결과가 없습니다.</StatusTd>
                      </tr>
                    )}

                    {!isLoading &&
                      filteredTeachers.map((teacher) => (
                        <Tr
                          key={teacher.id}
                          isSelected={selectedId === teacher.id}
                          onClick={() => setSelectedId(teacher.id)}
                        >
                          <Td>{teacher.name}</Td>
                          <Td>{teacher.department}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableWrapper>

              {error && <ErrorText>{error}</ErrorText>}

              <ButtonBox>
                <ApplyButton
                  active={selectedId !== null}
                  disabled={selectedId === null || isSubmitting}
                  onClick={handleApply}
                >
                  {isSubmitting ? "신청 중..." : "신청하기"}
                </ApplyButton>
              </ButtonBox>
            </TableSection>
          </MainContent>
        </TotalContainer>
      </ContentWrapper>
      <Footer />
    </Body>
  );
};





const Body = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 120px;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

const TabButton = styled.span<{ active: boolean }>`
  font-size: 18px;
  font-weight: 400;
  color: #000000;
`;

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 8px;
`;

const SearchSection = styled.div`
  width: 300px;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e5e5e5;
  border-radius: 50px;
  padding: 12px 18px;
  background-color: #fcfcfc;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
`;

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 25px;
`;

const KeyboardRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
`;

const KeyButton = styled.button`
  width: 85px;
  height: 70px;
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
`;

const TableSection = styled.div`
  flex: 1;
`;

const TableWrapper = styled.div`
  margin-top: 10px;
  height: 376px;
  overflow-y: scroll;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Thead = styled.thead`
  background-color: #444f61;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Th = styled.th`
  background-color: #444f61;
  padding: 15px;
  font-size: 22px;
  border-bottom: 2px solid #ccc;
`;

const Tbody = styled.tbody`
  tr:nth-of-type(odd) { background-color: white; }
  tr:nth-of-type(even) { background-color: #eef0f4; }
`;

const Tr = styled.tr<{ isSelected?: boolean }>`
  cursor: pointer;
  outline: ${(props) => (props.isSelected ? "3px solid #b1b1b1" : "none")};
  outline-offset: -3px;
`;

const Td = styled.td`
  padding: 16px;
  font-size: 22px;
  text-align: center;
  border-right: 1px solid #e0e0e0;
`;

const StatusTd = styled.td`
  padding: 40px;
  font-size: 18px;
  text-align: center;
  color: #888;
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin: 8px 0 0;
`;

const ButtonBox = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
`;

const ApplyButton = styled.button<{ active: boolean }>`
  width: 100%;
  height: 65px;
  font-size: 24px;
  font-weight: 500;
  color: white;
  background-color: ${(props) => (props.active ? "#444f61" : "#bec3cc")};
  border: none;
  border-radius: 10px;
  cursor: ${(props) => (props.active ? "pointer" : "not-allowed")};
`;

export default ApplicationTeacherPage;