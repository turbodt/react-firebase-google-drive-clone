import { useReducer, useEffect, Reducer } from "react";
import { useAuth } from "../contexts/AuthContext";
import { database, Document, DocumentId } from "../firebase";

enum ActionType {
  SELECT_FOLDER = "select-folder",
  UPDATE_FOLDER = "update-folder",
  SET_CHILD_FOLDERS = "set-child-folders",
  SET_CHILD_FILES = "set-child-files",
}

interface SelectFolderAction {
  type: ActionType.SELECT_FOLDER;
  payload: {
    folderId: DocumentId;
  };
}

interface UpdateFolderAction {
  type: ActionType.UPDATE_FOLDER;
  payload: {
    folder: Document;
  };
}

interface SetChildFoldersAction {
  type: ActionType.SET_CHILD_FOLDERS;
  payload: {
    childFolders: Document[];
  };
}

interface SetChildFilesAction {
  type: ActionType.SET_CHILD_FILES;
  payload: {
    childFiles: Document[];
  };
}

type Action =
  | SelectFolderAction
  | UpdateFolderAction
  | SetChildFoldersAction
  | SetChildFilesAction;

interface State {
  folderId: DocumentId;
  folder: Document | null;
  childFiles: Document[];
  childFolders: Document[];
}

export const ROOT_FOLDER: Document = { id: null, name: "Root", path: [] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SELECT_FOLDER:
      return {
        folderId: action.payload.folderId,
        folder: null,
        childFiles: [],
        childFolders: [],
      };
    case ActionType.UPDATE_FOLDER:
      return {
        ...state,
        folder: action.payload.folder,
      };
    case ActionType.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: action.payload.childFolders,
      };
    case ActionType.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: action.payload.childFiles,
      };
    default:
      return state;
  }
};

export const useFolder = (folderId: DocumentId) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    folderId,
    folder: null,
    childFolders: [],
    childFiles: [],
  });
  const { currentUser } = useAuth();

  useEffect(
    () => dispatch({ type: ActionType.SELECT_FOLDER, payload: { folderId } }),
    [folderId]
  );

  useEffect(() => {
    if (folderId == null) {
      return dispatch({
        type: ActionType.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      });
    }

    database.folders
      .doc(folderId)
      .get()
      .then((doc) => {
        dispatch({
          type: ActionType.UPDATE_FOLDER,
          payload: { folder: database.formatDoc(doc) },
        });
      })
      .catch(() => {
        dispatch({
          type: ActionType.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER },
        });
      });
  }, [folderId]);

  useEffect(() => {
    return database.folders
      .where("parentId", "==", folderId)
      .where("userId", "==", currentUser.uid)
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        dispatch({
          type: ActionType.SET_CHILD_FOLDERS,
          payload: { childFolders: snapshot.docs.map(database.formatDoc) },
        });
      });
  }, [folderId, currentUser]);

  useEffect(() => {
    return (
      database.files
        .where("folderId", "==", folderId)
        .where("userId", "==", currentUser.uid)
        // .orderBy("createdAt")
        .onSnapshot((snapshot) => {
          dispatch({
            type: ActionType.SET_CHILD_FILES,
            payload: { childFiles: snapshot.docs.map(database.formatDoc) },
          });
        })
    );
  }, [folderId, currentUser]);

  return state;
};
