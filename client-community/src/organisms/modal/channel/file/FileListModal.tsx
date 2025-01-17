import styled from '@emotion/styled';
import { fileList } from 'api/fileApi';
import Button from 'atoms/common/Button';
import { BulrContainer } from 'organisms/meeting/video/ScreenShareModal';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentChannel } from 'recoil/atom';
import { colors } from 'shared/color';
import { fileListModalPropsType } from 'types/channel/fileModalType';
import { FileDTO } from 'types/common/fileTypes';
import FileItem from './FileItem';

const ModalContainer = styled.div`
  position: relative;
  width: 35vw;
  height: 60vh;
  background-color: ${(props) => props.theme.bgColor};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border-radius: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const ModalHeader = styled.div`
  height: 28px;
  display: flex;
  align-items: center;

  .title {
    color: ${(props) => props.theme.textColor};
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 15px;
`;

const FilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  overflow-y: auto;
`;
const BlankContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: ${colors.gray400};
`;

const FileListModal = ({
  isOpen,
  onClose,
}: // channelId,
fileListModalPropsType) => {
  const [files, setFiles] = useState<FileDTO[]>([]);
  const { channelId } = useParams();
  useEffect(() => {
    fileList(channelId!).then((res) => {
      setFiles(res.data.fileInfoDTOList);
    });
  }, [channelId, isOpen]);

  if (!isOpen) return <></>;
  return (
    <BulrContainer>
      <ModalContainer>
        <ModalHeader>
          <div className="title">파일 서랍</div>
          <ButtonContainer>
            <Button
              text="취소"
              onClick={() => onClose(false)}
              width="80"
              height="28"
              bgColor="gray400"
            />
          </ButtonContainer>
        </ModalHeader>
        {files.length > 0 ? (
          <FilesContainer>
            {files.map((file, idx) => (
              <FileItem file={file} key={idx} />
            ))}
          </FilesContainer>
        ) : (
          <BlankContainer>
            <div>등록된 파일이 없습니다.</div>
          </BlankContainer>
        )}
      </ModalContainer>
    </BulrContainer>
  );
};

export default FileListModal;
