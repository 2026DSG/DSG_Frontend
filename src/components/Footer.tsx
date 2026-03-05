import styled from "@emotion/styled";

const Footer = () => {
  return (
    <FooterContainer>
      <Content>
        <span>FE 강세아 최하은</span>
        <Divider />
        <span>BE 권수현 김민서</span>
      </Content>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  width: 100%;
  padding: 16px 40px;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #bdbdbd;
  font-size: 14px;
`;

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: #bdbdbd;
`;

export default Footer;
