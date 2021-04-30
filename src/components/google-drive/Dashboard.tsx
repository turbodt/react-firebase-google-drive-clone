import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useFolder } from "../../hooks/useFolder";
import { AddFolderButton } from "./AddFolderButton";
import { AddFileButton } from "./AddFileButton";
import { FolderBreadcrumbs } from "./FolderBreadcrumbs";
import { Folder } from "./Folder";
import { File } from "./File";

interface ParamsType {
  folderId?: string;
}

export const Dashboard = () => {
  const { folderId = null } = useParams<ParamsType>();
  const { folder, childFolders, childFiles } = useFolder(folderId);

  return (
    <>
      <Navbar />
      <Container fluid>
        {folder && (
          <div className="d-flex align-items-center mt-2">
            <FolderBreadcrumbs currentFolder={folder} />
            <AddFileButton currentFolder={folder} />
            <AddFolderButton currentFolder={folder} />
          </div>
        )}
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map((childFolder) => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}

        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map((childFile) => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};
