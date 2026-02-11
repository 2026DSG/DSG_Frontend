//import React from 'react'
import styled from "@emotion/styled";
import ArrowLeft from "../assets/arrowLeft.svg";
import Logo from "../assets/darkLogo.svg";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

const Header = ({ title, showBack }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <HeaderBox>
      <HeaderNav>
        <HeaderLeft
          onClick={showBack ? handleBack : undefined}
          style={{ cursor: showBack ? "pointer" : "default" }}
        >
          {showBack && <img src={ArrowLeft} alt="뒤로가기" />}
          <PageTitle>{title}</PageTitle>
        </HeaderLeft>
        <img src={Logo} alt="서비스 로고" />
      </HeaderNav>
      <hr />
    </HeaderBox>
  );
};

const HeaderBox = styled.div`
  margin-top: 50px;
  width: 100%;

  hr {
    border: none;
    background-color: #e0e0e0;
    height: 3px;
  }
`;

const HeaderNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const PageTitle = styled.h1``;

export default Header;
