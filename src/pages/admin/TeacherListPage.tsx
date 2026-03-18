import styled from "@emotion/styled";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeft from "../../assets/arrowLeft.svg";
import ArrowRight from "../../assets/arrowRight.svg";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  deleteTeacher,
  uploadTeacherExcel,
  updateTeacherExcel,
  downloadTeacherExcel,
  getYearsFilter,
} from "../../services/teacher";

type teacher = {
  id: number;
  name: string;
  department: string;
  position: string;
};

const TeacherListPage = () => {
  const navigate = useNavigate();
  const [teacherList, setTeacherList] = useState<teacher[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (date: Date) => `${date.getFullYear()}`;

  const fetchTeacherList = useCallback(async () => {
    try {
      const res = await getYearsFilter(selectedDate.getFullYear());
      setTeacherList(res);
    } catch (err) {
      console.error(err);
      alert("교직원 목록 조회에 실패했습니다.");
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTeacherList();
  }, [fetchTeacherList]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteTeacher(id);
      alert("삭제되었습니다.");
      fetchTeacherList();
    } catch (err) {
      console.error(err);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleDownload = async () => {
    try {
      await downloadTeacherExcel();
    } catch (err) {
      console.error(err);
      alert("다운로드에 실패했습니다.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      if (teacherList.length === 0) {
        await uploadTeacherExcel(formData);
      } else {
        await updateTeacherExcel(formData);
      }
      alert("업로드되었습니다.");
      fetchTeacherList();
    } catch (error) {
      console.error(error);
      alert("업로드에 실패했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  const goToPrevYear = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setFullYear(d.getFullYear() - 1);
      return d;
    });
  };

  const goToNextYear = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setFullYear(d.getFullYear() + 1);
      return d;
    });
  };

  return (
    <Body>
      <TotalContainer>
        <Header title="메인페이지" />
        <UpsideBox>
          <YearNavigator>
            <img src={ArrowLeft} onClick={goToPrevYear} alt="이전 연도" />
            <Years>{formatDate(selectedDate)}</Years>
            <img src={ArrowRight} onClick={goToNextYear} alt="이후 연도" />
          </YearNavigator>

          <ApplicantListButton onClick={() => navigate("/admin/apply")}>
            <ApplicantListText>신청자 리스트</ApplicantListText>
            <img src={ArrowRight} alt="이동" />
          </ApplicantListButton>
        </UpsideBox>
        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>부서</Th>
                <Th>직위</Th>
                <Th></Th>
              </Tr>
            </Thead>

            <Tbody>
              {teacherList.length === 0 ? (
                <Tr>
                  <EmptyTd colSpan={4}>교직원이 존재하지 않습니다.</EmptyTd>
                </Tr>
              ) : (
                teacherList.map((teacher) => (
                  <Tr key={teacher.id}>
                    <Td>{teacher.name}</Td>
                    <Td>{teacher.department}</Td>
                    <Td>{teacher.position}</Td>
                    <Td>
                      <button onClick={() => handleDelete(teacher.id)}>
                        삭제
                      </button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableWrapper>

        <input
          type="file"
          accept=".xlsx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        <ButtonBox>
          <TeacherButton onClick={() => navigate("/admin/teachers/new")}>
            교직원 등록
          </TeacherButton>
          <TeacherButton onClick={handleDownload}>
            교직원 다운로드
          </TeacherButton>
          <TeacherButton onClick={() => fileInputRef.current?.click()}>
            파일 업로드
          </TeacherButton>
        </ButtonBox>
      </TotalContainer>
      <Footer />
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

const UpsideBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 34px;
`;

const YearNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;

  img {
    width: 13px;
  }
`;

const Years = styled.span`
  font-size: 24px;
  padding-bottom: 6px;
`;

const ApplicantListButton = styled.button`
  padding: 9px 18px;
  border: none;
  border-radius: 6px;
  background-color: #c1c6d1;
`;

const ApplicantListText = styled.span`
  margin-right: 10px;
  font-size: 20px;
`;

const TableWrapper = styled.div`
  margin-top: 21px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 6, 0.2);
`;

const Table = styled.table`
  width: 100%;
  //border-collapse: collapse;
  border-collapse: separate;
  border-spacing: 0;
  //border-radius: 6px;
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

const EmptyTd = styled.td`
  padding: 150px 0;
  font-size: 24px;
  text-align: center;
  color: #888;
  background-color: white;
`;

const Th = styled.th`
  background-color: #444f61;
  border-bottom: 2px solid #ccc;
  padding: 12px;
  font-size: 24px;

  /* 왼쪽 위 모서리 */
  &:first-of-type {
    border-top-left-radius: 6px;
  }
  /* 오른쪽 위 모서리 */
  &:last-of-type {
    border-top-right-radius: 6px;
  }

  position: sticky; // 스크롤 시 고정
  top: 0; // 최상단 고정
  z-index: 10;

  //position: sticky;
  //top: 0;
`;

const Td = styled.td`
  border-right: 1px solid #e0e0e0;
  padding: 12px;
  font-size: 24px;
  text-align: center;

  button {
    font-size: 24px;
    padding: 5px 29px;
    border: none;
    border-radius: 6px;
    color: white;
    background-color: #444f61;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 66px;
`;

const TeacherButton = styled.button`
  padding: 15px 50px;
  font-size: 32px;
  color: white;
  border: none;
  border-radius: 12px;
  background-color: #444f61;
`;

export default TeacherListPage;
