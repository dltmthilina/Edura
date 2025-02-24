import React, { useEffect } from "react";
import { Button, notification, Space } from "antd";
import { useNotifi } from "../context/NotifyContext";

const MessageTile = () => {
  const [api, contextHolder] = notification.useNotification();
  const { notifi } = useNotifi();

  const { message, code, type, isShow } = notifi;

  useEffect(() => {
    api[type]({
      message: code,
      description: message,
    });
  }, [code, message, type]);

  return <>{isShow && contextHolder}</>;
};

export default MessageTile;
