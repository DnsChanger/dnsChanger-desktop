import { Button } from "react-daisyui";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
  Progress,
} from "@material-tailwind/react";
import { CgSoftwareDownload } from "react-icons/cg";
import { ProgressInfo } from "electron-builder";
import { UpdateInfo } from "electron-updater";
import { EventsKeys } from "../../../shared/constants/eventsKeys.constant";
export function UpdateBtnComponent() {
  const [checking, setChecking] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  async function checkUpdate() {
    if (checking) return alert("please wait");
    try {
      setChecking(true);
      const { updateInfo, isError } = await window.ipc.checkUpdate();
      if (isError) { 
        window.ipc.notif("Unable to find any new updates");
        return;
      }
      if (updateInfo) {
        setUpdateInfo(updateInfo);
      }
    } catch (e) {
      window.ipc.dialogError("Checking failed", "Something went wrong");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className={""}>
      <Button
        size={"sm"}
        className={"normal-case text-sm font-light"}
        color={"ghost"}
        onClick={checkUpdate}
        disabled={checking}
      >
        {checking ? "Checking..." : "Check updates"}
      </Button>
      <DetailsModal updateInfo={updateInfo} />
    </div>
  );
}
interface Props {
  updateInfo: UpdateInfo;
}
function DetailsModal(prop: Props): JSX.Element {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [progressInfo, setProgressInfo] = useState<Partial<ProgressInfo>>();
  const [progressLabel, setProgressLabel] = useState<string>();
  const [speedLabel, setSpeedLabel] = useState<string>();
  useEffect(() => {
    if (prop.updateInfo) {
      setOpenDialog(true);

      (async () => {
        await window.ipc.startUpdate();
      })();

      window.ipc.on(EventsKeys.UPDATE_PROGRESS, onDownloadProgress);
      window.ipc.on(EventsKeys.UPDATE_ERROR, onError);
      return () => {
        window.ipc.off(EventsKeys.UPDATE_PROGRESS, onDownloadProgress);
        window.ipc.on(EventsKeys.UPDATE_ERROR, onError);
      };
    }
  }, [prop.updateInfo]);

  const onDownloadProgress = useCallback(
    (_event: Electron.IpcRendererEvent, arg1: ProgressInfo) => {
      setProgressInfo(arg1);
      updateProgressInfo(arg1.transferred, arg1.total);
      updateSpeedInfo(arg1.bytesPerSecond);
    },
    []
  );
  function onError(
    _event: Electron.IpcRendererEvent,
    arg1: { message: string }
  ) {
    setOpenDialog(false);
  }

  function updateProgressInfo(transferred, total) {
    const formattedTransferred = formatSize(transferred);
    const formattedTotal = formatSize(total);
    const progress = calculateProgress(transferred, total);
    setProgressLabel(
      `Progress: ${formattedTransferred} / ${formattedTotal} (${progress}%)`
    );
  }

  function updateSpeedInfo(bytesPerSecond) {
    const formattedSpeed = formatSpeed(bytesPerSecond);
    setSpeedLabel(`Speed: ${formattedSpeed}`);
  }

  if (!prop.updateInfo) return null;
  return (
    <Dialog
      open={openDialog}
      size={"xl"}
      handler={() => {}}
      className="bg-[#282828] rounded-2xl"
    >
      <DialogHeader
        className={"justify-center dark:text-white flex flex-row gap-2 py-5"}
      >
        <h3 className={"font-[BalooTamma] text-[#DADADA] text-[23px]"}>
          🎉 Found version {prop.updateInfo.version}
        </h3>
      </DialogHeader>
      <DialogBody className={"p-8"}>
        <div className="w-full">
          <div className="flex items-center justify-between gap-4 mb-2">
            <Typography color="white" variant="small">
              {progressLabel || "calculate..."}
            </Typography>
            <Typography color="white" variant="small">
              {speedLabel || "calculate..."}
            </Typography>
          </div>
          <Progress value={progressInfo?.percent || 0} color={"light-blue"} />
        </div>
      </DialogBody>
      <DialogFooter className={"justify-center "}>
        <Button
          className="bg-[#FB1919] border-none bg-opacity-10 lowercase text-[#C53939] font-[Inter]
           hover:bg-[#d11313] hover:bg-opacity-10 hover:text-[#7d2525]"
          onClick={() => setOpenDialog(false)}
        >
          <CgSoftwareDownload size={20} className={"mr-1"} /> close and
          downloading in background
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function formatSize(sizeInBytes: number): string {
  if (sizeInBytes >= 1000000000) {
    return `${(sizeInBytes / 1000000000).toFixed(2)} GB`;
  } else if (sizeInBytes >= 1000000) {
    return `${(sizeInBytes / 1000000).toFixed(2)} MB`;
  } else if (sizeInBytes >= 1000) {
    return `${(sizeInBytes / 1000).toFixed(2)} KB`;
  } else {
    return `${sizeInBytes} B`;
  }
}

function calculateProgress(transferred, total) {
  const progress = (transferred / total) * 100;
  return progress.toFixed(2);
}

function formatSpeed(speedInBytes) {
  if (speedInBytes >= 1000000000) {
    return `${(speedInBytes / 1000000000).toFixed(2)} GB/s`;
  } else if (speedInBytes >= 1000000) {
    return `${(speedInBytes / 1000000).toFixed(2)} MB/s`;
  } else if (speedInBytes >= 1000) {
    return `${(speedInBytes / 1000).toFixed(2)} KB/s`;
  } else {
    return `${speedInBytes} B/s`;
  }
}
