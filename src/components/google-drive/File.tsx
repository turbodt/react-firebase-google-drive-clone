import React from "react";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Document } from "../../firebase";

interface FileProps {
  file: Document;
}

export const File = ({ file }: FileProps) => (
  <a
    href={file.url}
    target="_blank"
    className="btn btn-outline-dark text-truncate w-100"
  >
    <FontAwesomeIcon icon={faFile} className="mr-2" />
    {file.name}
  </a>
);
