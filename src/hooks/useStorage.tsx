import { Reducer, useReducer } from "react";
import { storage, database, Document, DocumentId } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";

type UploadingTaskSnapshot = any & {
  bytesTransferred: number;
  totalBytes: number;
};

interface UploadingFile {
  id: DocumentId;
  name: string;
  progress: number;
  error: boolean;
}

enum ActionType {
  PUT_UPLOADING_FILE = "put-uploading-file",
  UPDATE_PROGRESS = "update-progress",
  SET_UPLOADING_FILE_ERROR = "set-update-file-error",
  FINISH_UPLOADING = "finish-uploading",
}

interface PutUploadingFile {
  type: ActionType.PUT_UPLOADING_FILE;
  payload: {
    uploadingFile: UploadingFile;
  };
}

interface UpdateProgressAction {
  type: ActionType.UPDATE_PROGRESS;
  payload: {
    fileId: DocumentId;
    snapshot: UploadingTaskSnapshot;
  };
}

interface SetUploadingFileErrorAction {
  type: ActionType.SET_UPLOADING_FILE_ERROR;
  payload: {
    fileId: DocumentId;
  };
}

interface FinishUploadingAction {
  type: ActionType.FINISH_UPLOADING;
  payload: {
    fileId: DocumentId;
  };
}

type Action =
  | PutUploadingFile
  | UpdateProgressAction
  | SetUploadingFileErrorAction
  | FinishUploadingAction;

interface State {
  uploadingFiles: UploadingFile[];
}

const getInitialState = (): State => ({
  uploadingFiles: [],
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.PUT_UPLOADING_FILE:
      return {
        ...state,
        uploadingFiles: [...state.uploadingFiles, action.payload.uploadingFile],
      };
    case ActionType.UPDATE_PROGRESS:
      const progress =
        action.payload.snapshot.bytesTransferred /
        action.payload.snapshot.totalBytes;
      return {
        ...state,
        uploadingFiles: state.uploadingFiles.map((file) =>
          file.id === action.payload.fileId ? { ...file, progress } : file
        ),
      };
    case ActionType.SET_UPLOADING_FILE_ERROR:
      return {
        ...state,
        uploadingFiles: state.uploadingFiles.map((file) =>
          file.id === action.payload.fileId ? { ...file, error: true } : file
        ),
      };
    case ActionType.FINISH_UPLOADING:
      return {
        ...state,
        uploadingFiles: state.uploadingFiles.filter(
          (file) => file.id !== action.payload.fileId
        ),
      };
    default:
      return state;
  }
};

export const useStorage = (
  currentFolder: Document
): [State, (file: File) => void] => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    getInitialState()
  );
  const { currentUser } = useAuth();

  const next = (fileId: DocumentId) => (snapshot: UploadingTaskSnapshot) =>
    dispatch({
      type: ActionType.UPDATE_PROGRESS,
      payload: {
        fileId,
        snapshot,
      },
    });

  const onError = (fileId: DocumentId) => () =>
    dispatch({
      type: ActionType.SET_UPLOADING_FILE_ERROR,
      payload: {
        fileId,
      },
    });

  const onComplete = (
    fileId: DocumentId,
    file: File,
    uploadTask: any
  ) => () => {
    dispatch({
      type: ActionType.FINISH_UPLOADING,
      payload: { fileId },
    });

    // side effect
    Promise.all([
      uploadTask.snapshot.ref.getDownloadURL(),
      database.files
        .where("name", "==", file.name)
        .where("userId", "==", currentUser.uid)
        .where("folderId", "==", currentFolder.id)
        .get(),
    ])
      .then(([url, existingFiles]: [string, any]) => {
        const existingFile = existingFiles.docs[0];
        if (existingFile) {
          return existingFile.ref.update({ url });
        } else {
          return database.files.add({
            url: url,
            name: file.name,
            path: currentFolder.path,
            createdAt: database.getCurrentTimestamp(),
            folderId: currentFolder.id,
            userId: currentUser.uid,
          });
        }
      })
      .catch((err) => console.error("ERROR IN ON COMPLETE SIDE EFFECT", err));
  };

  const uploadFile = (file: File) => {
    const fileId = uuidV4();

    const filePath = currentFolder.id
      ? `${currentFolder.path.join("/")}/${currentFolder.id}/${file.name}`
      : `${currentFolder.path.join("/")}/${file.name}`;

    const uploadingFile: UploadingFile = {
      id: fileId,
      name: file.name,
      progress: 0,
      error: false,
    };

    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file);

    dispatch({
      type: ActionType.PUT_UPLOADING_FILE,
      payload: { uploadingFile },
    });

    return uploadTask.on(
      "state_changed",
      next(fileId),
      onError(fileId),
      onComplete(fileId, file, uploadTask)
    );
  };

  return [state, uploadFile];
};
