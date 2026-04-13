import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styled from "@emotion/styled";
import { createTeacher } from "../../services/teacher";

interface FormErrors {
  name?: string;
  department?: string;
  position?: string;
}

const TeacherCreatePage = () => {
  const [name, setName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isDisabled = !name || !department || !position || isLoading;
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name) {
      newErrors.name = "이름은 비어있을 수 없습니다";
    } else if (name.length < 2 || name.length > 4) {
      newErrors.name = "이름은 2 ~ 4자 범위만 허용됩니다";
    }

    if (!department) {
      newErrors.department = "부서는 비어있을 수 없습니다";
    } else if (department.length < 2 || department.length > 50) {
      newErrors.department = "부서는 2 ~ 50자 범위만 허용됩니다";
    }

    if (!position) {
      newErrors.position = "직위는 비어있을 수 없습니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await createTeacher({ name, department, position });
      navigate("/admin/teachers");
    } catch (err: unknown) {
      const status = (
        err as { response?: { status?: number; data?: { message?: string } } }
      )?.response?.status;

      if (status === 400) {
        const serverErrors: FormErrors = {};
        const message =
          (
            err as {
              response?: { status?: number; data?: { message?: string } };
            }
          )?.response?.data?.message ?? "";

        if (message.includes("이름")) {
          serverErrors.name = message;
        } else if (message.includes("부서")) {
          serverErrors.department = message;
        } else if (message.includes("직위")) {
          serverErrors.position = message;
        }

        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors);
        } else {
          alert("입력값이 올바르지 않습니다.");
        }
      } else if (status === 409) {
        setErrors({ name: "이미 존재하는 교직원 이름입니다" });
      } else {
        alert("교직원 등록에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartment(e.target.value);
    if (errors.department)
      setErrors((prev) => ({ ...prev, department: undefined }));
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value);
    if (errors.position)
      setErrors((prev) => ({ ...prev, position: undefined }));
  };

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
                onChange={handleNameChange}
                hasError={!!errors.name}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <FormSpan>부서</FormSpan>
              <FormInput
                type="text"
                value={department}
                placeholder="부서를 입력해주세요"
                onChange={handleDepartmentChange}
                hasError={!!errors.department}
              />
              {errors.department && (
                <ErrorMessage>{errors.department}</ErrorMessage>
              )}
            </FormGroup>
            <FormGroup>
              <FormSpan>직위</FormSpan>
              <FormSelect
                value={position}
                isEmpty={!position}
                onChange={handlePositionChange}
                hasError={!!errors.position}
              >
                <option value="" disabled>
                  직위를 선택해주세요
                </option>
                <option value="teacher">교원</option>
                <option value="general">일반직</option>
                <option value="industrial">산학겸임</option>
              </FormSelect>
              {errors.position && (
                <ErrorMessage>{errors.position}</ErrorMessage>
              )}
            </FormGroup>
          </TeacherForm>
          <CreateButton onClick={handleCreate} disabled={isDisabled}>
            {isLoading ? "등록중.." : "등록하기"}
          </CreateButton>
        </TeacherFormContainer>
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

const FormInput = styled.input<{ hasError?: boolean }>`
  width: 465px;
  padding: 18px 16px;
  outline: none;
  border: 1px solid ${({ hasError }) => (hasError ? "#e53e3e" : "#c1c6d1")};
  border-radius: 6px;
  font-size: 20px;
`;

const FormSelect = styled.select<{ isEmpty: boolean; hasError?: boolean }>`
  border: 1px solid ${({ hasError }) => (hasError ? "#e53e3e" : "#c1c6d1")};
  border-radius: 6px;
  padding: 18px 16px;
  font-size: 20px;
  color: ${({ isEmpty }) => (isEmpty ? "#8e8c8c" : "#000")};
`;

const ErrorMessage = styled.span`
  font-size: 14px;
  color: #e53e3e;
`;

const CreateButton = styled.button<{ disabled: boolean }>`
  font-size: 24px;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 188px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ disabled }) => (disabled ? "#c1c6d1" : "#444F61")};
`;

export default TeacherCreatePage;
