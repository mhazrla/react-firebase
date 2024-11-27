import React, { useCallback, useRef, useState } from "react";
import "@uploadcare/react-uploader/core.css";
import { FileEntry } from "@/types";
import {
  FileUploaderRegular,
  type UploadCtxProvider,
} from "@uploadcare/react-uploader";
import { OutputFileEntry } from "@uploadcare/file-uploader";

interface IFileUploader {
  fileEntry: FileEntry;
  onChange: (fileentry: FileEntry) => void;
}

const FileUploader: React.FunctionComponent<IFileUploader> = ({
  fileEntry,
  onChange,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    OutputFileEntry<"success">[]
  >([]);
  const ctxProviderRef = useRef<InstanceType<UploadCtxProvider>>(null);

  const resetUploaderState = () =>
    ctxProviderRef.current?.uploadCollection.clearAll();

  const handleChangeEvent = (files) => {
    console.log("HandleChange File : ", files);
    setUploadedFiles([
      ...files.allEntries.filter((f) => f.status === "success"),
    ] as OutputFileEntry<"success">[]);
  };

  const handleModalCloseEvent = () => {
    resetUploaderState();

    const updatedFiles = [...fileEntry.files, ...uploadedFiles];
    onChange({ ...fileEntry, files: updatedFiles });
    console.log("updatedFiles", updatedFiles);

    setUploadedFiles([]);
  };

  const handleRemoveClick = useCallback(
    (uuid: OutputFileEntry["uuid"]) => {
      console.log("Removing File:", uuid);
      const updatedFiles = fileEntry.files.filter((f) => f.uuid !== uuid);
      onChange({ ...fileEntry, files: updatedFiles });
    },
    [fileEntry, onChange]
  );

  return (
    <>
      {" "}
      <FileUploaderRegular
        sourceList="local, url, camera, dropbox"
        classNameUploader="uc-light"
        pubkey="7087bebd34f26a162788"
        onChange={handleChangeEvent}
        onModalClose={handleModalCloseEvent}
        apiRef={ctxProviderRef}
        multiple={true}
        confirmUpload={false}
        removeCopyright={true}
        imgOnly={true}
      />
      <div className="grid grid-cols-2 gap-4 mt-8">
        {fileEntry.files.map((file) => {
          console.log("Files uploaded: ", file);
          return (
            <div key={file.uuid} className="relative ">
              <img
                key={file.uuid}
                src={`${file.cdnUrl}/-/format/auto/-/quality/smart/-/stretch/fill/`}
                alt={file.fileInfo?.originalFilename || ""}
                title={file.fileInfo?.originalFilename || ""}
              />

              <div className="cursor-pointer flex justify-center absolute -right-2 -top-2 bg-white border-2 border-slate-800 rounded-full w-7 h-7">
                <button
                  className="text-slate-800 text-center"
                  type="button"
                  onClick={() => handleRemoveClick(file.uuid)}
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FileUploader;
