import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Document } from "../../firebase";

interface FolderBreadcrumbsProps {
  currentFolder: Document;
}

export const FolderBreadcrumbs = ({
  currentFolder,
}: FolderBreadcrumbsProps) => (
  <Breadcrumb
    className="flex-grow-1"
    listProps={{ className: "bg-white pl-0 m-0" }}
  >
    {currentFolder.id && (
      <Breadcrumb.Item
        linkAs={Link}
        linkProps={{
          to: {
            pathname: "/",
          },
        }}
        className="text-truncate d-inline-block"
        style={{ maxWidth: "150px" }}
      >
        <FontAwesomeIcon icon={faHome} />
      </Breadcrumb.Item>
    )}

    {currentFolder.path.map((folderId, index) => (
      <Breadcrumb.Item
        key={folderId}
        linkAs={Link}
        linkProps={{
          to: {
            pathname: folderId ? `/folder/${folderId}` : "/",
          },
        }}
        className="text-truncate d-inline-block"
        style={{ maxWidth: "150px" }}
      >
        {folderId}
      </Breadcrumb.Item>
    ))}
    {currentFolder && (
      <Breadcrumb.Item
        className="text-truncate d-inline-block"
        style={{ maxWidth: "200px" }}
        active
      >
        {currentFolder.id ? (
          currentFolder.name
        ) : (
          <FontAwesomeIcon icon={faHome} />
        )}
      </Breadcrumb.Item>
    )}
  </Breadcrumb>
);
