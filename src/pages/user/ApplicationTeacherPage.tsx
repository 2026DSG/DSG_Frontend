"use client";

import styled from "@emotion/styled";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SearchIcon from "../../assets/Search.svg";

const teacherData = [
  { id: 1, name: "권수현", department: "부서" },
  { id: 2, name: "강세아", department: "부서" },
  { id: 3, name: "김하연", department: "부서" },
  { id: 4, name: "최하은", department: "부서" },
  { id: 5, name: "김수아", department: "부서" },
  { id: 6, name: "김민서", department: "부서" },
  { id: 7, name: "이지은", department: "부서" },

];

const KEYBOARD_ROWS = [
  ["ㄱ", "ㄴ", "ㄷ"],
  ["ㄹ", "ㅁ", "ㅂ"],
  ["ㅅ", "ㅇ", "ㅈ"],
  ["ㅊ", "ㅋ", "ㅌ"],
  ["ㅍ", "ㅎ", "←"],
];

const ApplicationTeacherPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 전 페이지 선택지에 따라 바뀌는 텍스트 변수 (퍼블리싱 단계 예시)
  const selectedMeal = "석식"; // 조식 / 중식 / 석식 중 선택된 값
  const selectedType = "초과근무"; // 초과근무 / 개인부담 중 선택된 값

  return (
    <Body>
      <ContentWrapper>
        <TotalContainer>
          <Header title="교직원 선택" />

          <TabContainer>
            {/* 전 페이지 선택지 2개가 모두 표시됨 */}
            <TabButton active={true}>{selectedMeal}</TabButton>
            <Divider>|</Divider>
            <TabButton active={false}>{selectedType}</TabButton>
          </TabContainer>

          <MainContent>
            {/* 왼쪽: 검색 영역 */}
            <SearchSection>
              <SearchInputWrapper>
                <StyledInput
                  type="text"
                  readOnly
                  placeholder="초성으로 검색해주세요."
                />
                <img src={SearchIcon} alt="search" width={20} height={20} />
              </SearchInputWrapper>

              <KeyboardContainer>
                {KEYBOARD_ROWS.map((row, rowIdx) => (
                  <KeyboardRow key={rowIdx}>
                    {row.map((key) => (
                      <KeyButton key={key}>
                        {key}
                      </KeyButton>
                    ))}
                  </KeyboardRow>
                ))}
              </KeyboardContainer>
            </SearchSection>

            {/* 오른쪽: 리스트 영역 */}
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
                    {teacherData.map((teacher) => (
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

              <ButtonBox>
                <ApplyButton active={selectedId !== null} disabled={selectedId === null}>
                  신청하기
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
  width: 1280px;
  height: 768px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 100px;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
    margin-right: 78px;
`;

const TabButton = styled.span<{ active: boolean }>`
  font-size:18px;
  font-weight: 400;
  color: #000000;
`;

const Divider = styled.span`
  color: #dbdbdb;
  font-size: 22px;
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
  border-radius: 20px;
  padding: 10px 18px;
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
  max-width: 580px;
`;

const TableWrapper = styled.div`
  height: 376px; 
  overflow-y: scroll; 
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
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
  &:first-of-type { border-top-left-radius: 6px; }
  &:last-of-type { border-top-right-radius: 6px; }
`;

const Tbody = styled.tbody`
  tr:nth-of-type(odd) {
    background-color: white;
  }
  tr:nth-of-type(even) {
    background-color: #eef0f4;
  }
`;

const Tr = styled.tr<{ isSelected?: boolean }>`
  cursor: pointer;
  position: relative;
  outline: ${(props) => (props.isSelected ? "3px solid #b1b1b1" : "none")};
  outline-offset: -3px;
`;

const Td = styled.td`
  padding: 16px;
  font-size: 22px;
  text-align: center;
  border-right: 1px solid #e0e0e0;
  &:last-child { border-right: none; }
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