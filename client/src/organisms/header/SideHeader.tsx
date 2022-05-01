import styled from '@emotion/styled';
import Icons from 'atoms/common/Icons';
import Text from 'atoms/text/Text';
import WorkspaceAddMemberModal from 'organisms/modal/workspace/WorkspaceAddMemberModal';
import WorkspaceDropDown from 'organisms/modal/workspace/WorkspaceDropDown';
import WorkspaceMemberListModal from 'organisms/modal/workspace/WorkspaceMemberListModal';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentWorkspace, isOpenSide } from 'recoil/atom';

const Container = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  position: relative;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const SideHeader = () => {
  const [isOpen, setIsOpen] = useRecoilState<boolean>(isOpenSide);
  const currentWorkspaceId = useRecoilValue(currentWorkspace);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [memberListOpen, setMemberListOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = ({ target }: any) => {
    if (dropdownOpen && !dropdownRef.current?.contains(target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const onClickSide = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const openWorkspaceMemberList = () => {
    setMemberListOpen(true);
  };
  const closeWorkspaceMemberList = () => {
    setMemberListOpen(false);
  };
  const openAddMemberModal = () => {
    setAddMemberModalOpen(true);
  };
  const closeAddMemberModal = () => {
    setAddMemberModalOpen(false);
  };

  return (
    <Container isOpen={isOpen}>
      <Title onClick={() => setDropdownOpen(!dropdownOpen)}>
        <Text size={24} weight="700" pointer={currentWorkspaceId !== 'main'}>
          {/* 워크스페이스 id로 워크스페이명 불러오는 api 연동. */}홈
        </Text>
        {currentWorkspaceId !== 'main' ? <Icons icon="dropdown" /> : null}
      </Title>
      <Icons
        icon={isOpen ? 'anglesLeft' : 'anglesRight'}
        onClick={onClickSide}
      />
      {currentWorkspaceId !== 'main' ? (
        <>
          <WorkspaceDropDown
            isOpen={dropdownOpen}
            onClose={closeDropdown}
            openMemberList={openWorkspaceMemberList}
            openAddMemberModal={openAddMemberModal}
            ref={dropdownRef}
          />
          <WorkspaceMemberListModal
            isOpen={memberListOpen}
            onClose={closeWorkspaceMemberList}
          />
          <WorkspaceAddMemberModal
            isOpen={addMemberModalOpen}
            onClose={closeAddMemberModal}
          />
        </>
      ) : null}
    </Container>
  );
};

export default SideHeader;
