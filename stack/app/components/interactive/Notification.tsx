import { useState } from "react";
import clsx from "clsx";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export type NotificationProps = {
  message: string;
  type: "default" | "soft" | "success" | "info" | "warning" | "error";
  children?: React.ReactNode;
  className?: string;
  closable?: boolean;
};

export const Notification = ({
  message,
  type = "default",
  children,
  className,
  closable = true,
}: NotificationProps) => {
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div>
      {showNotification && (
        <div
          className={clsx(
            "flex w-full flex-row items-center justify-between p-4",
            {
              "bg-background-canvas-dark": type === "default",
              "bg-gray-200": type === "soft",
              "bg-alert-success-light": type === "success",
              "bg-alert-info-light": type === "info",
              "bg-alert-warning-weak": type === "warning",
              "bg-alert-error-light": type === "error",
            },
            className
          )}
        >
          <div className="flex flex-row items-center justify-start">
            <div>
              {type === "default" && (
                <InformationCircleIcon className="h-5 w-5 text-white" />
              )}
              {type === "soft" && (
                <InformationCircleIcon className="h-5 w-5 text-text" />
              )}
              {type === "success" && (
                <CheckCircleIcon className="h-5 w-5 text-text" />
              )}
              {type === "info" && (
                <InformationCircleIcon className="h-5 w-5 text-text" />
              )}
              {type === "warning" && (
                <ExclamationTriangleIcon className="h-5 w-5 text-text" />
              )}
              {type === "error" && (
                <ExclamationCircleIcon className="h-5 w-5 text-text" />
              )}
            </div>
            <div
              className={clsx("text-body-sm font-light text-text", {
                "text-white": type === "default",
              })}
            >
              <span className="mx-4">{message}</span>
              {children}
            </div>
          </div>
          {closable && (
            <div className="flex flex-row items-center justify-end">
              <button
                className="text-grey-dark hover:text-grey-darker text-sm"
                onClick={() => setShowNotification(false)}
                title="Close"
                aria-label="Close"
              >
                <XMarkIcon
                  className={clsx("h-5 w-5 text-text", {
                    "text-white": type === "default",
                  })}
                />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
