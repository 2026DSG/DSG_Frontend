import styled from "@emotion/styled";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchIcon from "../../assets/Search.svg";
import { getAdminTeacherList, postMealApplication } from "../../services/mealService";
import type { TeacherItem, MealType } from "../../services/mealService";

const ApplicationTeacherPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const meal = searchParams.get("meal") as MealType;
  const date = searchParams.get("date") || "";
  const reason = searchParams.get("reason") || "";

  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    getAdminTeacherList().then(setTeachers).catch(() => alert("교사 목록 로딩 실패"));
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => t.name.includes(searchQuery) || t.department.includes(searchQuery));
  }, [teachers, searchQuery]);

  const handleSubmit = async () => {
    if (!selectedId) return alert("교사를 선택해주세요.");
    try {
      await postMealApplication({ teacherId: selectedId, meal, reason, date });
      alert("신청이 완료되었습니다.");
      navigate("/");
    } catch {
      alert("신청에 실패했습니다.");
    }
  };

  return (
    <Body>
      <TotalContainer>
        <Header title="교사 선택" />
        <SearchRow>
          <SearchInputWrapper>
            <img src={SearchIcon} alt="search" />
            <input placeholder="이름 또는 부서 검색" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </SearchInputWrapper>
        </SearchRow>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr><Th>이름</Th><Th>부서</Th><Th>직위</Th></Tr>
            </Thead>
            <Tbody>
              {filteredTeachers.map(t => (
                <Tr key={t.id} isSelected={selectedId === t.id} onClick={() => setSelectedId(t.id)}>
                  <Td>{t.name}</Td><Td>{t.department}</Td><Td>{t.position}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrapper>

        <ButtonBox>
          <SubmitButton onClick={handleSubmit}>신청 완료</SubmitButton>
        </ButtonBox>
      </TotalContainer>
      <Footer />
    </Body>
  );
};

const Body = styled.div` width: 100vw; height: 100vh; `;
const TotalContainer = styled.div` display: flex; flex-direction: column; margin: 0 120px; `;
const SearchRow = styled.div` margin-top: 30px; display: flex; justify-content: flex-end; `;
const SearchInputWrapper = styled.div` display: flex; align-items: center; border: 1px solid #ccc; border-radius: 8px; padding: 8px 16px; width: 300px; img { width: 20px; margin-right: 10px; } input { border: none; outline: none; font-size: 18px; width: 100%; } `;
const TableWrapper = styled.div` margin-top: 20px; height: 400px; overflow-y: auto; border: 1px solid #eee; `;
const Table = styled.table` width: 100%; border-collapse: collapse; `;
const Thead = styled.thead` background: #444f61; color: white; position: sticky; top: 0; `;
const Th = styled.th` padding: 15px; font-size: 20px; `;
const Tbody = styled.tbody``;
const Tr = styled.tr<{ isSelected?: boolean }>` cursor: pointer; background: ${props => props.isSelected ? "#d1d5db" : "white"}; &:hover { background: #f3f4f6; } `;
const Td = styled.td` padding: 15px; text-align: center; border-bottom: 1px solid #eee; font-size: 18px; `;
const ButtonBox = styled.div` display: flex; justify-content: center; margin-top: 40px; `;
const SubmitButton = styled.button` padding: 20px 100px; font-size: 28px; background: #444f61; color: white; border: none; border-radius: 12px; cursor: pointer; `;

export default ApplicationTeacherPage;