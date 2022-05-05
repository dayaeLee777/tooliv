import styled from '@emotion/styled';
import { getWorkspaceInfo } from 'api/workspaceApi';
import Icons from 'atoms/common/Icons';
import Text from 'atoms/text/Text';
import WorkspaceAddMemberModal from 'organisms/modal/workspace/WorkspaceAddMemberModal';
import WorkspaceDropDown from 'organisms/modal/workspace/WorkspaceDropDown';
import WorkspaceMemberListModal from 'organisms/modal/workspace/WorkspaceMemberListModal';
import WorkspaceModifyModal from 'organisms/modal/workspace/WorkspaceModifyModal';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentWorkspace, isOpenSide, modifyWorkspaceName } from 'recoil/atom';

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
const DropdownWrapper = styled.div``;

const SideHeader = () => {
  const [isOpen, setIsOpen] = useRecoilState<boolean>(isOpenSide);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const currentWorkspaceId = useRecoilValue(currentWorkspace);
  const modWorkspaceName = useRecoilValue(modifyWorkspaceName);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [memberListOpen, setMemberListOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('홈');
  const [thumbnailImage, setThumbnailImage] = useState('');

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

  const handleWorkspaceInfo = useCallback(async () => {
    const { data } = await getWorkspaceInfo(currentWorkspaceId);
    console.log(data);
    setWorkspaceName(data.name);
    setThumbnailImage(data.thumbnailImage);
  }, [currentWorkspaceId]);

  useEffect(() => {
    if (currentWorkspaceId !== 'main') handleWorkspaceInfo();
    else setWorkspaceName('홈');
  }, [currentWorkspaceId, handleWorkspaceInfo, modWorkspaceName]);

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

  const openModifyModal = () => {
    setModifyModalOpen(true);
  };
  const closeModifyModal = () => {
    setModifyModalOpen(false);
  };

  return (
    <Container isOpen={isOpen}>
      <DropdownWrapper ref={dropdownRef}>
        <Title
          onClick={() => {
            console.log('hello');
            setDropdownOpen(!dropdownOpen);
          }}
        >
          <Text size={24} weight="700" pointer={currentWorkspaceId !== 'main'}>
            {/* 워크스페이스 id로 워크스페이명 불러오는 api 연동. */}
            {workspaceName}
          </Text>
          {currentWorkspaceId !== 'main' ? (
            <Icons width="30" height="30" icon="dropdown" />
          ) : null}
        </Title>
        <WorkspaceDropDown
          isOpen={dropdownOpen}
          onClose={closeDropdown}
          openMemberList={openWorkspaceMemberList}
          openAddMemberModal={openAddMemberModal}
          openModifyModal={openModifyModal}
        />
      </DropdownWrapper>
      <Icons
        icon={isOpen ? 'anglesLeft' : 'anglesRight'}
        onClick={onClickSide}
      />
      {currentWorkspaceId !== 'main' ? (
        <>
          <WorkspaceMemberListModal
            isOpen={memberListOpen}
            onClose={closeWorkspaceMemberList}
          />
          <WorkspaceAddMemberModal
            isOpen={addMemberModalOpen}
            onClose={closeAddMemberModal}
          />
          <WorkspaceModifyModal
            isOpen={modifyModalOpen}
            onClose={closeModifyModal}
            workspaceName={workspaceName}
            thumbnailImage={thumbnailImage}
          />
        </>
      ) : null}
    </Container>
  );
};

export default SideHeader;